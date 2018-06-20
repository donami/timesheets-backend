import { Response, Request, NextFunction } from 'express';

import { default as User, UserModel } from '../models/User';

export let list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find().populate('timesheets');

    return res.json(users);
  } catch (error) {
    next(error);
  }
};

export let find = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findOne({ id: req.params.id });

    return res.json(user);
  } catch (error) {
    next(error);
  }
};

export let create = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, role } = req.body;

  try {
    const user = new User({ email, password, role });

    const savedUser = await user.save();

    return res.json(savedUser);
  } catch (error) {
    next(error);
  }
};

export let update = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, role } = req.body;

  try {
    const user = <UserModel>await User.findOne({ id: req.params.id });

    user.email = email || user.email;
    user.password = password || user.password;
    user.role = role || user.role;

    const savedUser = await user.save();

    return res.json(savedUser);
  } catch (error) {
    next(error);
  }
};

export let remove = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.body;

  try {
    const removedUser = await User.findOneAndRemove({ id: req.params.id });

    return res.json(removedUser);
  } catch (error) {
    next(error);
  }
};
