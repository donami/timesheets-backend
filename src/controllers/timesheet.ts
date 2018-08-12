import { Response, Request, NextFunction } from 'express';

import {
  default as Timesheet,
  TimesheetModel,
  TimesheetStatus,
} from '../models/Timesheet';
import Project, { ProjectModel } from '../models/Project';
import User, { UserModel } from '../models/User';
import Notification, { NotificationType } from '../models/Notification';
import Log from '../models/Log';

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

    // If status has been changed,
    // a notification for the timesheet owner should be created
    if (status && status !== timesheet.status) {
      const user = <UserModel>await User.findOne({ _id: timesheet.owner._id });

      let notification;
      let log;

      switch (status) {
        case TimesheetStatus.Approved:
          notification = new Notification({
            notificationType: NotificationType.TIMESHEET_APPROVED,
            icon: 'fas fa-check',
            createdBy: req.user._id,
          });

          log = new Log({
            message: `Timesheet was approved by ${req.user.fullName}`,
            reference: { kind: 'Timesheet', item: timesheet._id },
          });

          break;

        case TimesheetStatus.WaitingForApproval:
          log = new Log({
            message: `Timesheet was submitted for approval by ${
              req.user.fullName
            }`,
            reference: { kind: 'Timesheet', item: timesheet._id },
          });
          break;

        case TimesheetStatus.NeedsRevisement:
          notification = new Notification({
            notificationType: NotificationType.TIMESHEET_NEEDS_REVISEMENT,
            icon: 'fas fa-exclamation-circle',
            createdBy: req.user._id,
          });

          log = new Log({
            message: `Timesheet status was changed to: Needs Revisement by ${
              req.user.fullName
            }`,
            reference: { kind: 'Timesheet', item: timesheet._id },
          });
          break;

        default:
          break;
      }

      if (log) {
        await log.save();
      }

      if (notification) {
        const savedNotification = await notification.save();

        user.notifications.push(savedNotification._id);

        await user.save();
      }
    }

    timesheet.status = status || timesheet.status;
    timesheet.dateApproved = dateApproved || timesheet.dateApproved;

    if (dates) {
      timesheet.dates = [];

      dates.forEach((date: any) => {
        timesheet.dates.push(date);
      });
    }

    await timesheet.save();

    const result = await Timesheet.findOne({ id: req.params.id });

    return res.json(result);
  } catch (error) {
    next(error);
  }
};

export let remove = async (req: Request, res: Response, next: NextFunction) => {
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
      timesheet.owner = user._id;

      item.dates.forEach((date: any) => {
        timesheet.dates.push(date);
      });

      const log = new Log({
        message: `Timesheet was created by ${req.user.fullName}`,
        reference: { kind: 'Timesheet', item: timesheet._id },
      });

      return Promise.all([log.save(), timesheet.save()]).then(
        async ([savedLog, createdTimesheet]) => {
          project.timesheets.push(createdTimesheet._id);

          return await Timesheet.findOne({ _id: createdTimesheet._id });
        }
      );
    });

    const result = await Promise.all(promises);

    await project.save();
    await user.save();

    const createdIds = result.map((timesheet: any) => timesheet._id.toString());

    const createdTimesheets = await Timesheet.find({
      _id: { $in: createdIds },
    });

    return res.json(createdTimesheets);
  } catch (error) {
    next(error);
  }
};
