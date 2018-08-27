import { Response, Request, NextFunction } from 'express';

import QuestionCategory, {
  QuestionCategoryModel,
} from '../models/QuestionCategory';

export let list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await QuestionCategory.find();

    return res.json(categories);
  } catch (error) {
    next(error);
  }
};

export let find = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await QuestionCategory.findOne({ id: req.params.id });

    return res.json(category);
  } catch (error) {
    next(error);
  }
};

export let create = async (req: Request, res: Response, next: NextFunction) => {
  const { title, icon } = req.body;

  try {
    const category = new QuestionCategory({
      title,
      icon,
    });

    const savedCategory = await category.save();

    return res.json(savedCategory);
  } catch (error) {
    next(error);
  }
};

export let update = async (req: Request, res: Response, next: NextFunction) => {
  const { title, icon } = req.body;

  try {
    const category = <QuestionCategoryModel>(
      await QuestionCategory.findOne({ id: req.params.id })
    );

    category.title = title || category.title;
    category.icon = icon || category.icon;

    const savedCategory = await category.save();

    return res.json(savedCategory);
  } catch (error) {
    next(error);
  }
};

export let remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = <QuestionCategoryModel>(
      await QuestionCategory.findOne({ id: req.params.id })
    );

    if ((<any>category.articles).length) {
      return res.status(400).send({
        success: false,
        message:
          'Please move existing articles to another category or remove them before attempting to remove this category.',
      });
    }

    const removedCategory = await QuestionCategory.findOneAndRemove({
      id: req.params.id,
    });

    return res.json(removedCategory);
  } catch (error) {
    next(error);
  }
};
