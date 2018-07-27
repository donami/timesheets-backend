import { Response, Request, NextFunction } from 'express';

import {
  default as Timesheet,
  TimesheetModel,
  TimesheetStatus,
} from '../models/Timesheet';
import Project, { ProjectModel } from '../models/Project';
import User from '../models/User';

export let list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const timesheets = await Timesheet.find();

    return res.json(timesheets);
  } catch (error) {
    next(error);
  }
};

export let find = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const timesheet = await Timesheet.findOne({ id: req.params.id });

    return res.json(timesheet);
  } catch (error) {
    next(error);
  }
};

export let create = async (req: Request, res: Response, next: NextFunction) => {
  const { periodEnd, status } = req.body;

  try {
    const timesheet = new Timesheet({ periodEnd, status });

    const savedTimesheet = await timesheet.save();

    return res.json(savedTimesheet);
  } catch (error) {
    next(error);
  }
};

export let update = async (req: Request, res: Response, next: NextFunction) => {
  const { status, dateApproved, dates } = req.body;

  try {
    const timesheet = <TimesheetModel>(
      await Timesheet.findOne({ id: req.params.id })
    );

    timesheet.status = status || timesheet.status;
    timesheet.dateApproved = dateApproved || timesheet.dateApproved;

    if (dates) {
      timesheet.dates = [];

      dates.forEach((date: any) => {
        timesheet.dates.push(date);
      });
    }

    const savedTimesheet = await timesheet.save();

    return res.json(savedTimesheet);
  } catch (error) {
    next(error);
  }
};

export let remove = async (req: Request, res: Response, next: NextFunction) => {
  const { timesheetId } = req.body;

  try {
    const removedTimesheet = await Timesheet.findOneAndRemove({
      id: req.params.id,
    });

    return res.json(removedTimesheet);
  } catch (error) {
    next(error);
  }
};

export let createMany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { data } = req.body;
  const { timesheets, projectId, userId } = data;

  try {
    const project = (await Project.findOne({ id: projectId })) as any;
    const user = (await User.findOne({ id: userId })) as any;

    const promises = timesheets.map((item: any) => {
      const timesheet = <TimesheetModel>new Timesheet();
      timesheet.dates = [];
      timesheet.periodEnd = item.month; // TODO: this is actually start date, periodEnd should be removed
      timesheet.periodStart = item.month;
      timesheet.status = TimesheetStatus.InProgress;

      item.dates.forEach((date: any) => {
        timesheet.dates.push(date);
      });

      return timesheet.save().then(async createdTimesheet => {
        user.timesheets.push(createdTimesheet._id);
        project.timesheets.push(createdTimesheet._id);

        return createdTimesheet;
      });
    });

    const result = await Promise.all(promises);

    await project.save();
    await user.save();

    return res.json(result);
  } catch (error) {
    next(error);
  }
};
