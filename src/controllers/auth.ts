import { Response, Request, NextFunction } from 'express';

import { default as User, UserModel } from '../models/User';

export let auth = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, password });

    return res.json(user);
  } catch (error) {
    next(error);
  }
};
