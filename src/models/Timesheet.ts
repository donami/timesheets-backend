import bcrypt from 'bcrypt-nodejs';
import crypto from 'crypto';
import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

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
  status: TimesheetStatus;
  dateApproved?: string;
  dates?: any[];
};

const timesheetSchema = new mongoose.Schema(
  {
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
    dates: [
      {
        type: String,
        default: [],
      },
    ],
  },
  { timestamps: true }
);

timesheetSchema.plugin(autoIncrement.plugin, {
  model: 'Timesheet',
  startAt: 1,
  field: 'id',
});

// export const Timesheet: TimesheetType = mongoose.model<TimesheetType>('Timesheet', timesheetSchema);
const Timesheet = mongoose.model('Timesheet', timesheetSchema);
export default Timesheet;
