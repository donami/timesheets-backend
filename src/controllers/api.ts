import { Response, Request, NextFunction } from 'express';

import { default as User } from '../models/User';
import { default as Project } from '../models/Project';
import { default as Timesheet } from '../models/Timesheet';
import * as mocks from '../util/mocks';
import ExpenseReport from '../models/ExpenseReport';

// TODO: remove
export let mock = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.deleteMany({});
    const projects = await Project.deleteMany({});
    const timesheets = await Timesheet.deleteMany({});

    const userPromises = mocks.users.map(user => {
      const newUser = new User(user);

      return newUser.save();
    });

    const expensePromises = mocks.expenses.map(expense => {
      const newExpense = new ExpenseReport(expense);

      return newExpense.save();
    });

    const timesheetPromises = mocks.timesheets.map(timesheet => {
      const newTimesheet = new Timesheet(timesheet);

      return newTimesheet.save();
    });

    const projectPromises = mocks.projects.map(project => {
      const newProject = new Project(project);

      return newProject.save();
    });

    await Promise.all([
      timesheetPromises,
      userPromises,
      expensePromises,
      projectPromises,
    ]);

    return res.json({ cleaned: true });
  } catch (error) {
    next(error);
  }
};
