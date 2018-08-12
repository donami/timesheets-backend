import { TimesheetModel, TimesheetStatus } from '../models/Timesheet';
import { UserRole } from '../models/User';
import { ExpenseReportStatus } from '../models/ExpenseReport';
import { NotificationType } from '../models/Notification';

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

export const notifications: any[] = [
  {
    _id: '5b69493fc396248c198e0f88',
    message: 'Click here to find out more',
    notificationType: NotificationType.TIMESHEET_APPROVED,
    icon: 'fas fa-user',
  },
  {
    _id: '5b69493fc396248c198e0f89',
    message:
      "Ours is a life of constant reruns. We're always circling back to where we'd we started, then starting all over again. Even if we don't run extra laps that day, we surely will come back for more of the same another day soon.",
    notificationType: NotificationType.TIMESHEET_APPROVED,
    image: 'https://react.semantic-ui.com/images/avatar/small/elliot.jpg',
  },
];

export const questionArticles: any[] = [
  {
    _id: '5b6474c61ae30b09e5f2086e',
    title: 'How to set password for another user',
    teaser: 'Instructions for how to change the password for another user',
    body:
      'As an admin you can update the password for any user on your account. To do this go to Company > Manage Users and then click on edit. ',
    author: '5b294c3c00cdca62587cb455',
    access: [UserRole.User, UserRole.Manager, UserRole.Admin],
  },
  {
    _id: '5b6473c78f304df6f894f994',
    title: 'How to disable a user',
    teaser: 'Instructions for how to disable a user',
    body:
      'Next goto the password field and update the password. If you decide to autogenerate the password, ClockIt will give you the option to send it to the employee once you save.',
    author: '5b294c3c00cdca62587cb455',
    access: [UserRole.User, UserRole.Manager, UserRole.Admin],
  },
];

export const questionCategories: any[] = [
  {
    // _id: '5b2bc67b7ee7ad2e78f35a39',
    title: 'General',
    icon: 'fas fa-life-ring',
    articles: [],
  },
  {
    // _id: '5b2bc67b7ee7ad2e78f35a38',
    title: 'User Management',
    icon: 'fas fa-user',
    articles: ['5b6474c61ae30b09e5f2086e', '5b6473c78f304df6f894f994'],
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
    notifications: ['5b69493fc396248c198e0f88', '5b69493fc396248c198e0f89'],
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
