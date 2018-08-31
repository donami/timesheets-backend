import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
import autopopulate from 'mongoose-autopopulate';

import { UserModel } from './User';

export type PasswordResetModel = {
  userId: number;
  code: string;
};

autoIncrement.initialize(mongoose.connection);

const passwordResetSchema = new mongoose.Schema(
  {
    userId: {
      type: Number,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    usePushEach: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

passwordResetSchema.plugin(autopopulate);

passwordResetSchema.plugin(autoIncrement.plugin, {
  model: 'PasswordReset',
  startAt: 1,
  field: 'id',
});

const PasswordReset = mongoose.model('PasswordReset', passwordResetSchema);
export default PasswordReset;
