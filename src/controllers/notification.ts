import { Response, Request, NextFunction } from 'express';

import {
  default as Notification,
  NotificationModel,
} from '../models/Notification';
import User, { UserRole } from '../models/User';

export let list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const notifications = await Notification.find();

    return res.json(notifications);
  } catch (error) {
    next(error);
  }
};

export let find = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const notification = await Notification.findOne({
      id: req.params.id,
    });

    return res.json(notification);
  } catch (error) {
    next(error);
  }
};

export let create = async (req: Request, res: Response, next: NextFunction) => {
  const { notificationType, userId } = req.body;

  try {
    const user = await User.findOne({ id: userId });

    if (!user) {
      throw new Error(`Unable to find user with id: ${userId}.`);
    }

    const notification: any = new Notification({ notificationType });

    const savedNotification = await notification.save();

    const result = await Notification.findOne({ _id: savedNotification._id });

    return res.json(result);
  } catch (error) {
    next(error);
  }
};

export let update = async (req: Request, res: Response, next: NextFunction) => {
  const { notificationType } = req.body;

  try {
    const notification = <NotificationModel>await Notification.findOne({
      id: req.params.id,
    });

    notification.notificationType =
      notificationType || notification.notificationType;

    const savedNotification = await notification.save();

    return res.json(savedNotification);
  } catch (error) {
    next(error);
  }
};

export let remove = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const removedNotification = await Notification.findOneAndRemove({
      id,
    });

    return res.json(removedNotification);
  } catch (error) {
    next(error);
  }
};
