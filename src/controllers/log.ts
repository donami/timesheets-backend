import { Response, Request, NextFunction } from 'express';

import Log from '../models/Log';

export let list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const logs = await Log.find().populate({
      path: 'reference.item',
      select: 'id',
      options: { autopopulate: false },
    });

    return res.json(logs);
  } catch (error) {
    next(error);
  }
};

export let find = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const log = await Log.findOne({ id: req.params.id }).populate({
      path: 'reference.item',
      select: 'id',
      options: { autopopulate: false },
    });

    return res.json(log);
  } catch (error) {
    next(error);
  }
};

// export let create = async (req: Request, res: Response, next: NextFunction) => {
//   const { periodEnd, status } = req.body;

//   try {
//     const timesheet = new Timesheet({ periodEnd, status });

//     const savedTimesheet = await timesheet.save();

//     return res.json(savedTimesheet);
//   } catch (error) {
//     next(error);
//   }
// };

// export let update = async (req: Request, res: Response, next: NextFunction) => {
//   const { status, dateApproved, dates } = req.body;

//   try {
//     const timesheet = <TimesheetModel>(
//       await Timesheet.findOne({ id: req.params.id })
//     );

//     // If status has been changed,
//     // a notification for the timesheet owner should be created
//     if (status && status !== timesheet.status) {
//       const user = <UserModel>await User.findOne({ _id: timesheet.owner._id });

//       let notification;
//       let log;

//       switch (status) {
//         case TimesheetStatus.Approved:
//           notification = new Notification({
//             notificationType: NotificationType.TIMESHEET_APPROVED,
//             icon: 'fas fa-check',
//             createdBy: req.user._id,
//           });

//           log = new Log({
//             message: 'An event occurred',
//             reference: { kind: 'Timesheet', item: timesheet._id },
//           });

//           break;

//         default:
//           break;
//       }

//       if (log) {
//         await log.save();
//       }

//       if (notification) {
//         const savedNotification = await notification.save();

//         user.notifications.push(savedNotification._id);

//         await user.save();
//       }
//     }

//     timesheet.status = status || timesheet.status;
//     timesheet.dateApproved = dateApproved || timesheet.dateApproved;

//     if (dates) {
//       timesheet.dates = [];

//       dates.forEach((date: any) => {
//         timesheet.dates.push(date);
//       });
//     }

//     await timesheet.save();

//     const result = await Timesheet.findOne({ id: req.params.id });

//     return res.json(result);
//   } catch (error) {
//     next(error);
//   }
// };

// export let remove = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const removedTimesheet = await Timesheet.findOneAndRemove({
//       id: req.params.id,
//     });

//     return res.json(removedTimesheet);
//   } catch (error) {
//     next(error);
//   }
// };
