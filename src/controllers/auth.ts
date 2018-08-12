import { Response, Request, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import jwtConfig from '../config/jwt';
import { default as User, UserModel } from '../models/User';

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
