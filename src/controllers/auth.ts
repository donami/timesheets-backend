import { Response, Request, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'node-uuid';

import jwtConfig from '../config/jwt';
import { default as User, UserModel } from '../models/User';
import Mailer from '../util/mailer';
import PasswordReset from '../models/PasswordReset';

export let auth = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    const user: any = await User.findOne({ email, password });

    if (!user) {
      return res.status(403).json({
        status: 403,
        ok: false,
        message: 'Email or password did not match.',
      });
    }

    if (user.disabled) {
      return res.status(403).json({
        success: false,
        message:
          'Your account has been disabled. If this is incorrect, please contact a system administrator.',
      });
    }

    const payload = {
      id: user.id,
      _id: user._id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
      firstname: user.firstname,
      lastname: user.lastname,
    };

    const token = jwt.sign(payload, jwtConfig.secret, {
      // expiresIn: 1440, // expires in 24 hours
    });

    return res.json({ token, data: user });
  } catch (error) {
    next(error);
  }
};

export let verify = async (req: Request, res: Response, next: NextFunction) => {
  const token =
    req.body.token || req.query.token || req.headers['x-access-token'];

  if (token) {
    return jwt.verify(
      token,
      jwtConfig.secret,
      async (err: any, decoded: any) => {
        if (err) {
          return res.json({
            success: false,
            message: 'Failed to authenticate token.',
          });
        }

        const user: any = await User.findOne({ email: decoded.email });

        return res.json({ data: user });
      }
    );
  }

  return res.status(403).send({
    success: false,
    message: 'No token provided.',
  });
};

export let verifyRecoverPasswordCode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const isValid = await PasswordReset.findOne({
      userId: req.query.userId,
      code: req.query.code,
    });

    if (!isValid) {
      return res.status(403).json({
        success: false,
        message: 'Recover code does not exist or has expired.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Recover code is valid.',
    });
  } catch (error) {
    next(error);
  }
};

export let recoverPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = <UserModel>await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(403).json({
        success: false,
        message: 'Unable to find a user with that email address.',
      });
    }

    const code = uuid();

    const passwordReset = new PasswordReset({ userId: user.id, code });
    await passwordReset.save();

    const mailer = new Mailer();

    mailer.configure({
      to: [user.email],
      ...mailer.getTemplate('FORGOTTEN_PASSWORD', user, code),
    });
    mailer.send();

    return res.json(user);
  } catch (error) {
    next(error);
  }
};

export let recoverPasswordChange = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id, password, code } = req.body;

  try {
    const validCode = await PasswordReset.findOne({
      userId: id,
      code,
    });

    const user = <UserModel>await User.findOne({ id });

    if (!validCode) {
      return res.status(403).json({
        success: false,
        message: 'Password recovery code does not exist or has expired.',
      });
    }

    if (!password) {
      throw new Error('No password provided.');
    }

    // Update password
    user.password = password;
    const savedUser = await user.save();

    // Remove code after usage
    await validCode.remove();

    return res.json(savedUser);
  } catch (error) {
    next(error);
  }
};

export let clearNotifications = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = <UserModel>await User.findOne({ _id: req.user._id });

    if (!user) {
      throw new Error('Unable to find user.');
    }

    const promises = user.notifications.map(notification => {
      notification.unread = false;
      return notification.save();
    });

    await Promise.all(promises);

    return res.json(user);
  } catch (error) {
    next(error);
  }
};

export let uploadProfileImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req;

    if (!user) {
      throw new Error('Unable to find user.');
    }

    const authedUser = <UserModel>await User.findOne({ id: user.id });

    const filename = req.file.filename;

    authedUser.image = filename;

    const savedUser = await authedUser.save();

    return res.json(savedUser);
  } catch (error) {
    next(error);
  }
};
