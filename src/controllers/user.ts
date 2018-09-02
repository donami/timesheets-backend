import { Response, Request, NextFunction } from 'express';

import { default as User, UserModel, UserRole } from '../models/User';
import Project from '../models/Project';
import Group from '../models/Group';

export let list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find();

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
  const {
    email,
    firstname,
    lastname,
    password,
    role,
    projects: projectIds,
    group: groupId,
  } = req.body;

  try {
    const user = <UserModel>new User({
      email,
      password,
      firstname,
      lastname,
      role: role || UserRole.User,
    });

    if (groupId) {
      const group = await Group.findOne({ id: groupId });

      if (group) {
        user.group = group._id;
      }
    }

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

    const result = await User.findOne({ _id: savedUser._id });

    return res.json(result);
  } catch (error) {
    next(error);
  }
};

export let update = async (req: Request, res: Response, next: NextFunction) => {
  const {
    email,
    password,
    role,
    image,
    firstname,
    lastname,
    gender,
    group: groupId,
  } = req.body;

  try {
    const emailExists = <UserModel>(
      await User.findOne({ email, id: { $ne: req.params.id } })
    );

    if (emailExists) {
      return res.status(403).json({
        success: false,
        message: 'A user with that email already exists.',
      });
    }

    const user = <UserModel>await User.findOne({ id: req.params.id });

    if (groupId) {
      const group = await Group.findOne({ id: groupId });

      if (group) {
        user.group = group._id;
      }
    }

    user.email = email || user.email;
    user.image = image || user.image;
    user.firstname = firstname || user.firstname;
    user.lastname = lastname || user.lastname;
    user.password = password || user.password;
    user.role = role || user.role;
    user.gender = gender || user.gender;

    const savedUser = await user.save();

    return res.json(savedUser);
  } catch (error) {
    next(error);
  }
};

export let disable = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = <UserModel>await User.findOne({ id: req.params.id });

    user.disabled = true;

    const savedUser = await user.save();

    return res.json(savedUser);
  } catch (error) {
    next(error);
  }
};

export let enable = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = <UserModel>await User.findOne({ id: req.params.id });

    user.disabled = false;

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
