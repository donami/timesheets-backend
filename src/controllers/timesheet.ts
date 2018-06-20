import { Response, Request, NextFunction } from 'express';

import { default as Timesheet, TimesheetModel } from '../models/Timesheet';

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
    timesheet.dates = dates || timesheet.dates;

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
