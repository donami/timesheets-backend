import { Response, Request, NextFunction } from 'express';

import { default as User, UserModel, UserRole } from '../models/User';
import Project from '../models/Project';

export let list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find()
      .populate('timesheets')
      .populate('timesheets');

    return res.json(users);
  } catch (error) {
    next(error);
  }
};

export let find = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findOne({ id: req.params.id }).populate(
      'timesheets'
    );

    return res.json(user);
  } catch (error) {
    next(error);
  }
};

export let create = async (req: Request, res: Response, next: NextFunction) => {
  const {
    email,
    firstname,
    lastname,
    password,
    role,
    projects: projectIds,
  } = req.body;

  try {
    const user = new User({
      email,
      password,
      firstname,
      lastname,
      role: role || UserRole.User,
    });

    const savedUser = await user.save();

    const projects = await Project.find({ id: { $in: projectIds } });

    const projectPromises = projects.map((project: any) => {
      project.members.push({
        user: savedUser._id,
        role: role || UserRole.User,
      });

      return project.save();
    });

    await Promise.all(projectPromises);

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
