import { TimesheetModel, TimesheetStatus } from '../models/Timesheet';
import { UserRole } from '../models/User';
import { ExpenseReportStatus } from '../models/ExpenseReport';

export const timesheets = [
  {
    _id: '5b294c3c00cdca62587cb457',
    periodEnd: '30-Jun-2018',
    status: TimesheetStatus.InProgressSaved,
  },
  {
    _id: '5b294c3c00cdca62587cb458',
    periodEnd: '31-Jul-2018',
    status: TimesheetStatus.InProgress,
  },
];

export const expenses: any[] = [
  {
    _id: '5b294e46c1825a4c500e95a9',
    description: 'Expense description',
    items: [],
    dateSubmitted: '09/12-2017',
    status: ExpenseReportStatus.Submitted,
  },
  {
    _id: '5b294e46c1825a4c500e95aa',
    description: 'Expense description #2',
    items: [],
    dateSubmitted: '09/12-2017',
    status: ExpenseReportStatus.Submitted,
  },
];

export const users = [
  {
    _id: '5b294c3c00cdca62587cb455',
    email: 'markus@gmail.com',
    password: '123',
    role: UserRole.Admin,
  },
  {
    _id: '5b294c3c00cdca62587cb456',
    email: 'liv@gmail.com',
    password: '123',
    role: UserRole.User,
  },
];

export const projects: any[] = [
  {
    _id: '5b294aa07cebb86524184674',
    timesheets: ['5b294c3c00cdca62587cb457', '5b294c3c00cdca62587cb458'],
    name: 'Humany AB',
    members: [],
  },
  {
    _id: '5b294aa07cebb86524184675',
    name: 'HiQ AB',
    members: [],
    timesheets: [],
  },
];
