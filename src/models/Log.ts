import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
import autopopulate from 'mongoose-autopopulate';

import { UserModel } from './User';

export type LogModel = {
  createdBy: UserModel;
  createdAt: string;
  updatedAt: string;
  message: string;
  reference: {
    kind: string;
    item: any;
  };
};

autoIncrement.initialize(mongoose.connection);

const logSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    reference: {
      kind: String,
      item: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'reference.kind',
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

logSchema.plugin(autopopulate);

logSchema.plugin(autoIncrement.plugin, {
  model: 'Log',
  startAt: 1,
  field: 'id',
});

const Log = mongoose.model('Log', logSchema);
export default Log;
