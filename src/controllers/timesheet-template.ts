import { Response, Request, NextFunction } from 'express';

import {
  default as TimesheetTemplate,
  TimesheetTemplateModel,
} from '../models/TimesheetTemplate';

export let list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const templates = await TimesheetTemplate.find();

    return res.json(templates);
  } catch (error) {
    next(error);
  }
};

export let find = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const template = await TimesheetTemplate.findOne({ id: req.params.id });

    return res.json(template);
  } catch (error) {
    next(error);
  }
};

export let create = async (req: Request, res: Response, next: NextFunction) => {
  const {
    name,
    workHoursPerDay,
    shiftStartTime,
    shiftEndTime,
    reportType,
    startEndDays,
    hoursDays,
  } = req.body;

  // const parsedHoursDays = {
  //   monday: hoursDays.monday.totalHours,
  //   tuesday: hoursDays.tuesday.totalHours,
  //   wednesday: hoursDays.wednesday.totalHours,
  //   thursday: hoursDays.thursday.totalHours,
  //   friday: hoursDays.friday.totalHours,
  //   saturday: hoursDays.saturday.totalHours,
  //   sunday: hoursDays.sunday.totalHours,
  // };

  try {
    const template = new TimesheetTemplate({
      name,
      workHoursPerDay,
      shiftStartTime,
      shiftEndTime,
      reportType,
      startEndDays,
      hoursDays,
      // hoursDays: parsedHoursDays,
    });

    const savedTemplate = await template.save();

    return res.json(savedTemplate);
  } catch (error) {
    next(error);
  }
};

export let update = async (req: Request, res: Response, next: NextFunction) => {
  const {
    name,
    workHoursPerDay,
    shiftStartTime,
    shiftEndTime,
    reportType,
    startEndDays,
    hoursDays,
  } = req.body;

  try {
    const template = <TimesheetTemplateModel>(
      await TimesheetTemplate.findOne({ id: req.params.id })
    );

    template.name = name || template.name;
    template.workHoursPerDay = workHoursPerDay || template.workHoursPerDay;
    template.shiftStartTime = shiftStartTime || template.shiftStartTime;
    template.shiftEndTime = shiftEndTime || template.shiftEndTime;
    template.reportType = reportType || template.reportType;
    template.startEndDays = startEndDays || template.startEndDays;
    template.hoursDays = hoursDays || template.hoursDays;

    const savedReport = await template.save();

    return res.json(savedReport);
  } catch (error) {
    next(error);
  }
};

export let remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const removedTemplate = await TimesheetTemplate.findOneAndRemove({
      id: req.params.id,
    });

    return res.json(removedTemplate);
  } catch (error) {
    next(error);
  }
};
