import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

autoIncrement.initialize(mongoose.connection);

export enum ExpenseLineItemType {
  Meal = 'MEAL',
}

export interface ExpenseLineItem {
  expenseType: ExpenseLineItemType;
  expenseDate: string;
  amount: number;
  currency: string;
  attachment?: string;
}

export enum ExpenseReportStatus {
  Submitted = 'Submitted',
  Approved = 'Approved',
}

export type ExpenseReportModel = mongoose.Document & {
  description: string;
  items: ExpenseLineItem[];
  dateSubmitted: string;
  dateApproved?: string;
  status: ExpenseReportStatus;
};

const expenseReportSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },
    items: [
      {
        expenseType: String,
        expenseDate: String,
        amount: Number,
        currency: String,
        attachment: String,
      },
    ],
    dateSubmitted: String,
    dateApproved: String,
    status: {
      type: String,
      default: ExpenseReportStatus.Submitted,
    },
  },
  { timestamps: true }
);

expenseReportSchema.plugin(autoIncrement.plugin, {
  model: 'ExpenseReport',
  startAt: 1,
  field: 'id',
});

// export const ExpenseReport: ExpenseReportType = mongoose.model<ExpenseReportType>('ExpenseReport', expenseReportSchema);
const ExpenseReport = mongoose.model('ExpenseReport', expenseReportSchema);
export default ExpenseReport;
