import { TimesheetModel, TimesheetStatus } from '../models/Timesheet';
import { UserRole } from '../models/User';
import { ExpenseReportStatus } from '../models/ExpenseReport';

export const groups: any[] = [
  {
    _id: '5b2bc67b7ee7ad2e78f35a39',
    name: 'Software Developers',
    project: '5b294aa07cebb86524184674',
    timesheetTemplate: '5b2feba6a0cbc871743a9240',
  },
  {
    _id: '5b2bc67b7ee7ad2e78f35a38',
    name: 'First Line Support',
    project: '5b294aa07cebb86524184674',
  },
];

export const timesheetTemplates: any = [
  {
    _id: '5b2feba6a0cbc871743a9240',
    id: 3,
    name: 'Standard Timesheet Template',
    workHoursPerDay: 8,
    shiftStartTime: '8:00',
    shiftEndTime: '17:00',
    reportType: 'StartEnd',
    hoursDays: {
      monday: 8,
      tuesday: 8,
      wednesday: 8,
      thursday: 8,
      friday: 8,
      saturday: 8,
      sunday: 8,
    },
  },
  {
    _id: '5b2feba6a0cbc871743a9241',
    id: 4,
    name: 'With specific times per day',
    workHoursPerDay: 8,
    shiftStartTime: '8:00',
    shiftEndTime: '17:00',
    reportType: 'StartEnd',
    startEndDays: {
      monday: {
        from: '10:00',
        to: '18:00',
      },
      tuesday: {
        from: '10:00',
        to: '18:00',
      },
      wednesday: {
        from: '10:00',
        to: '18:00',
      },
      thursday: {
        from: '10:00',
        to: '18:00',
      },
      friday: {
        from: '10:00',
        to: '18:00',
      },
      saturday: {
        holiday: true,
      },
      sunday: {
        holiday: true,
      },
    },
    hoursDays: {
      monday: 8,
      tuesday: 8,
      wednesday: 8,
      thursday: 8,
      friday: 8,
      saturday: 8,
      sunday: 8,
    },
  },
];

export const timesheets = [
  {
    _id: '5b294c3c00cdca62587cb457',
    periodEnd: '30-Jun-2018',
    status: TimesheetStatus.InProgressSaved,
    owner: '5b294c3c00cdca62587cb456',
  },
  {
    _id: '5b294c3c00cdca62587cb458',
    periodEnd: '31-Jul-2018',
    status: TimesheetStatus.InProgress,
    owner: '5b294c3c00cdca62587cb456',
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
    firstname: 'Markus',
    lastname: 'Hederström',
    password: '123',
    role: UserRole.Admin,
    group: '5b2bc67b7ee7ad2e78f35a39',
  },
  {
    _id: '5b294c3c00cdca62587cb456',
    email: 'liv@gmail.com',
    firstname: 'Liv',
    lastname: 'Nejdefelt',
    password: '123',
    role: UserRole.User,
    group: '5b2bc67b7ee7ad2e78f35a39',
  },
];

export const projects: any[] = [
  {
    _id: '5b294aa07cebb86524184674',
    timesheets: ['5b294c3c00cdca62587cb457', '5b294c3c00cdca62587cb458'],
    name: 'Humany AB',
    members: [
      {
        user: '5b294c3c00cdca62587cb455',
        role: UserRole.Admin,
      },
      {
        user: '5b294c3c00cdca62587cb456',
        role: UserRole.User,
      },
    ],
    groups: ['5b2bc67b7ee7ad2e78f35a39', '5b2bc67b7ee7ad2e78f35a38'],
  },
  {
    _id: '5b294aa07cebb86524184675',
    name: 'HiQ AB',
    members: [],
    timesheets: [],
  },
];
