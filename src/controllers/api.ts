import { Response, Request, NextFunction } from 'express';

import { default as User } from '../models/User';
import { default as Group } from '../models/Group';
import { default as Project } from '../models/Project';
import { default as Timesheet } from '../models/Timesheet';
import { default as Notification } from '../models/Notification';
import * as mocks from '../util/mocks';
import ExpenseReport from '../models/ExpenseReport';
import TimesheetTemplate from '../models/TimesheetTemplate';
import QuestionArticle from '../models/QuestionArticle';
import QuestionCategory from '../models/QuestionCategory';

// TODO: remove
export let mock = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.deleteMany({});
    const projects = await Project.deleteMany({});
    const timesheets = await Timesheet.deleteMany({});
    const groups = await Group.deleteMany({});
    const templates = await TimesheetTemplate.deleteMany({});
    const articles = await QuestionArticle.deleteMany({});
    const categories = await QuestionCategory.deleteMany({});
    const notifications = await Notification.deleteMany({});

    const articlePromises = mocks.questionArticles.map(article => {
      const newArticle = new QuestionArticle(article);

      return newArticle.save();
    });

    const notificationPromises = mocks.notifications.map(notification => {
      const newNotification = new Notification(notification);

      return newNotification.save();
    });

    const categoryPromises = mocks.questionCategories.map(category => {
      const newCategory = new QuestionCategory(category);

      return newCategory.save();
    });

    const templatePromises = mocks.timesheetTemplates.map(template => {
      const newTemplate = new TimesheetTemplate(template);

      return newTemplate.save();
    });

    const groupPromises = mocks.groups.map(group => {
      const newGroup = new Group(group);

      return newGroup.save();
    });

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
      notificationPromises,
      articlePromises,
      categoryPromises,
      templatePromises,
      timesheetPromises,
      userPromises,
      expensePromises,
      projectPromises,
      groupPromises,
    ]);

    return res.json({ cleaned: true });
  } catch (error) {
    next(error);
  }
};
