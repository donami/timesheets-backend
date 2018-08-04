import { Response, Request, NextFunction } from 'express';

import QuestionArticle, {
  QuestionArticleModel,
} from '../models/QuestionArticle';
import QuestionCategory from '../models/QuestionCategory';

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
  const { title, author, teaser, body, access, categoryId } = req.body;

  try {
    const category: any = await QuestionCategory.findOne({ id: categoryId });

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

    const savedCategory = await category.save();

    return res.json(savedCategory);
  } catch (error) {
    next(error);
  }
};

export let update = async (req: Request, res: Response, next: NextFunction) => {
  const { title, author, teaser, body, access } = req.body;

  try {
    const article = <QuestionArticleModel>(
      await QuestionArticle.findOne({ id: req.params.id })
    );

    article.title = title || article.title;
    article.author = author || article.author;
    article.access = access || article.access;
    article.teaser = teaser || article.teaser;
    article.body = body || article.body;

    const savedArticle = await article.save();

    return res.json(savedArticle);
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
