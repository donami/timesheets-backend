import { Response, Request, NextFunction } from 'express';

import { default as Project, ProjectModel } from '../models/Project';
import User, { UserRole } from '../models/User';

export let getProjects = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req;

    const projects = await Project.find({ 'members.user': { $in: user._id } });

    return res.json(projects);
  } catch (error) {
    next(error);
  }
};

export let findProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req;

    const project = await Project.findOne({
      id: req.params.id,
      'members.user': { $in: user._id },
    });

    return res.json(project);
  } catch (error) {
    next(error);
  }
};

export let createProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, userId } = req.body;

  try {
    const user = await User.findOne({ id: userId });

    if (!user) {
      throw new Error(`Unable to find user with id: ${userId}.`);
    }

    const project: any = new Project({ name });
    project.members = [
      {
        user: user._id,
        role: UserRole.Admin,
      },
    ];

    const savedProject = await project.save();

    const result = await Project.findOne({ _id: savedProject._id });

    return res.json(result);
  } catch (error) {
    next(error);
  }
};

export let updateProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name } = req.body;

  try {
    const { user } = req;

    const project = <ProjectModel>await Project.findOne({
      id: req.params.id,
      // 'members.user': { $in: user._id },
    });

    project.name = name;

    const savedProject = await project.save();

    return res.json(savedProject);
  } catch (error) {
    next(error);
  }
};

export let removeProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const removedProject = await Project.findOneAndRemove({
      id: req.params.id,
      // 'members.user': { $in: req.user._id },
    });

    return res.json(removedProject);
  } catch (error) {
    next(error);
  }
};
