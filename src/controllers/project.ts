import { Response, Request, NextFunction } from 'express';

import { default as Project, ProjectModel } from '../models/Project';

export let getProjects = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const projects = await Project.find().populate('timesheets');

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
    const project = await Project.findOne({ id: req.params.id });

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
  const { name } = req.body;

  try {
    const project = new Project({ name });

    const savedProject = await project.save();

    return res.json(savedProject);
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
    const project = <ProjectModel>await Project.findOne({ id: req.params.id });

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
  const { projectId } = req.body;

  try {
    const removedProject = await Project.findOneAndRemove({ id: projectId });

    return res.json(removedProject);
  } catch (error) {
    next(error);
  }
};
