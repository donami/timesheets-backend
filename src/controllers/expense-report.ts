import { Response, Request, NextFunction } from 'express';

import {
  default as ExpenseReport,
  ExpenseReportModel,
} from '../models/ExpenseReport';

export let list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const expenseReports = await ExpenseReport.find();

    return res.json(expenseReports);
  } catch (error) {
    next(error);
  }
};

export let find = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const expenseReport = await ExpenseReport.findOne({ id: req.params.id });

    return res.json(expenseReport);
  } catch (error) {
    next(error);
  }
};

export let create = async (req: Request, res: Response, next: NextFunction) => {
  const { description, items, dateApproved, dateSubmitted, status } = req.body;

  try {
    const expenseReport = new ExpenseReport({
      description,
      items,
      dateApproved,
      dateSubmitted,
      status,
    });

    const savedExpenseReport = await expenseReport.save();

    return res.json(savedExpenseReport);
  } catch (error) {
    next(error);
  }
};

export let update = async (req: Request, res: Response, next: NextFunction) => {
  const { description, items, dateApproved, status } = req.body;

  try {
    const expenseReport = <ExpenseReportModel>(
      await ExpenseReport.findOne({ id: req.params.id })
    );

    expenseReport.description = description || expenseReport.description;
    expenseReport.items = items || expenseReport.items;
    expenseReport.dateApproved = dateApproved || expenseReport.dateApproved;
    expenseReport.status = status || expenseReport.status;

    const savedReport = await expenseReport.save();

    return res.json(savedReport);
  } catch (error) {
    next(error);
  }
};

export let remove = async (req: Request, res: Response, next: NextFunction) => {
  const { expenseReportId } = req.body;

  try {
    const removedExpenseReport = await ExpenseReport.findOneAndRemove({
      id: expenseReportId,
    });

    return res.json(removedExpenseReport);
  } catch (error) {
    next(error);
  }
};
