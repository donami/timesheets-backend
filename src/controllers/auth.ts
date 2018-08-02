import { Response, Request, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import jwtConfig from '../config/jwt';
import { default as User, UserModel } from '../models/User';

export let auth = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    const user: any = await User.findOne({ email, password }).populate(
      'timesheets'
    );

    const payload = {
      id: user.id,
      _id: user._id,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, jwtConfig.secret, {
      expiresIn: 1440, // expires in 24 hours
      // expiresInMinutes: 1440 // expires in 24 hours
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

        const user: any = await User.findOne({ email: decoded.email }).populate(
          'timesheets'
        );

        return res.json({ data: user });
      }
    );
  }

  return res.status(403).send({
    success: false,
    message: 'No token provided.',
  });
};
