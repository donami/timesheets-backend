import { Response, Request, NextFunction } from 'express';

import QuestionArticle, {
  QuestionArticleModel,
} from '../models/QuestionArticle';
import QuestionCategory, {
  QuestionCategoryModel,
} from '../models/QuestionCategory';
import User from '../models/User';

export let list = async (req: Request, res: Response, next: NextFunction) => {
  const { q: query } = req.query;

  const options: any = {};
  if (query) {
    options.title = new RegExp(query, 'i');
  }

  try {
    const articles = await QuestionArticle.find(options);

    return res.json(articles);
  } catch (error) {
    next(error);
  }
};

export let find = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const article = await QuestionArticle.findOne({ id: req.params.id });

    return res.json(article);
  } catch (error) {
    next(error);
  }
};

export let create = async (req: Request, res: Response, next: NextFunction) => {
  const { title, userId, teaser, body, access, categoryId } = req.body;

  try {
    const category: any = await QuestionCategory.findOne({ id: categoryId });
    const author = await User.findOne({ id: userId }).then(user => user._id);

    if (!category) {
      throw new Error('No category with that ID exists.');
    }

    const article = new QuestionArticle({
      title,
      teaser,
      body,
      author,
      access,
    });

    const savedArticle = await article.save();

    category.articles.push(savedArticle._id);

    await category.save();

    const result = await QuestionCategory.findOne({ id: categoryId });

    return res.json(result);
  } catch (error) {
    next(error);
  }
};

export let update = async (req: Request, res: Response, next: NextFunction) => {
  const { title, teaser, body, access, categoryId } = req.body;

  try {
    const article = <QuestionArticleModel>(
      await QuestionArticle.findOne({ id: req.params.id })
    );

    article.title = title || article.title;
    article.access = access || article.access;
    article.teaser = teaser || article.teaser;
    article.body = body || article.body;

    await article.save();

    const category = <any>await QuestionCategory.findOne({ id: categoryId });

    await QuestionCategory.update(
      {},
      { $pull: { articles: { $in: [article._id] } } },
      { multi: true }
    );

    category.articles.push(article._id);

    await category.save();

    const result = await QuestionCategory.findOne({ id: categoryId });
    return res.json(result);
  } catch (error) {
    next(error);
  }
};

export let remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const removedArticle = await QuestionArticle.findOneAndRemove({
      id: req.params.id,
    });

    return res.json(removedArticle);
  } catch (error) {
    next(error);
  }
};
