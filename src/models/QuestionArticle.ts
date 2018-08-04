import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
import autopopulate from 'mongoose-autopopulate';

import { UserModel, UserRole } from './User';

autoIncrement.initialize(mongoose.connection);

export type QuestionArticleModel = mongoose.Document & {
  title: string;
  author: UserModel;
  teaser?: string;
  body: string;
  // createdAt: Time
  // updatedAt: Time
  access: UserRole[];
  votes: {
    negative: number;
    neutral: number;
    positive: number;
  };
};

const questionArticleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    teaser: {
      type: String,
      required: false,
    },
    body: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      autopopulate: true,
    },
    access: [
      {
        type: String,
      },
    ],
    votes: {
      negative: {
        type: Number,
        default: 0,
      },
      neutral: {
        type: Number,
        default: 0,
      },
      positive: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
    usePushEach: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

questionArticleSchema.plugin(autopopulate);

questionArticleSchema.plugin(autoIncrement.plugin, {
  model: 'QuestionArticle',
  startAt: 1,
  field: 'id',
});

const QuestionArticle = mongoose.model(
  'QuestionArticle',
  questionArticleSchema
);
export default QuestionArticle;
