import mongoose, { Mongoose } from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
import autopopulate from 'mongoose-autopopulate';

import { UserModel } from './User';

autoIncrement.initialize(mongoose.connection);

export enum TimesheetStatus {
  InProgress = 'IN_PROGRESS',
  InProgressSaved = 'IN_PROGRESS_SAVED',
  Approved = 'APPROVED',
  WaitingForApproval = 'WAITING_FOR_APPROVAL',
  NeedsRevisement = 'NEEDS_REVISEMENT',
}

export type TimesheetModel = mongoose.Document & {
  periodEnd: string;
  periodStart: string;
  status: TimesheetStatus;
  dateApproved?: string;
  dates?: any[];
  owner: UserModel;
};

const dateSchema = new mongoose.Schema(
  {
    date: String,
    hours: Number,
    expected: Number,
  },
  { usePushEach: true }
);

const timesheetSchema = new mongoose.Schema(
  {
    periodStart: {
      type: String,
      required: true,
    },
    periodEnd: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    dateApproved: {
      type: String,
      required: false,
    },
    dates: [[dateSchema]],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      // autopopulate: { maxDepth: 5 },
    },
  },
  { timestamps: true, usePushEach: true }
);

timesheetSchema.plugin(autopopulate);

timesheetSchema.plugin(autoIncrement.plugin, {
  model: 'Timesheet',
  startAt: 1,
  field: 'id',
});

const autoPopulate = function(next: any) {
  // this.populate({
  //   path: 'owner',
  //   populate: {
  //     path: 'timesheets',
  //   },
  // });

  next();
};

timesheetSchema.pre('find', autoPopulate);
timesheetSchema.pre('findOne', autoPopulate);

// export const Timesheet: TimesheetType = mongoose.model<TimesheetType>('Timesheet', timesheetSchema);
const Timesheet = mongoose.model('Timesheet', timesheetSchema);
export default Timesheet;
