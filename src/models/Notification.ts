import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
import autopopulate from 'mongoose-autopopulate';

import { UserModel } from './User';

autoIncrement.initialize(mongoose.connection);

export enum NotificationType {
  TIMESHEET_APPROVED = 'TimesheetApproved',
  TIMESHEET_NEEDS_REVISEMENT = 'TimesheetNeedsRevisement',
}

export type NotificationModel = mongoose.Document & {
  message?: string;
  notificationType: NotificationType;
  unread: boolean;
  icon?: string;
  image?: string;
  createdBy?: UserModel;
};

const notificationSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: false,
    },
    notificationType: {
      type: String,
      required: true,
    },
    unread: {
      type: Boolean,
      default: true,
    },
    icon: {
      type: String,
      required: false,
    },
    image: {
      type: String,
      required: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
  },
  {
    timestamps: true,
    usePushEach: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

notificationSchema.plugin(autopopulate);

notificationSchema.plugin(autoIncrement.plugin, {
  model: 'Notification',
  startAt: 1,
  field: 'id',
});

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
