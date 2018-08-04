import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
import autopopulate from 'mongoose-autopopulate';

import { QuestionArticleModel } from './QuestionArticle';

autoIncrement.initialize(mongoose.connection);

export type QuestionCategoryModel = mongoose.Document & {
  title: string;
  icon: string;
  articles: QuestionArticleModel;
};

const QuestionCategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    articles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'QuestionArticle',
        autopopulate: true,
      },
    ],
  },
  {
    timestamps: true,
    usePushEach: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

QuestionCategorySchema.plugin(autopopulate);

QuestionCategorySchema.plugin(autoIncrement.plugin, {
  model: 'QuestionCategory',
  startAt: 1,
  field: 'id',
});

const QuestionCategory = mongoose.model(
  'QuestionCategory',
  QuestionCategorySchema
);
export default QuestionCategory;
