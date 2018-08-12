import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
import autopopulate from 'mongoose-autopopulate';

import { GroupModel } from './Group';
import { NotificationModel } from './Notification';

autoIncrement.initialize(mongoose.connection);

export enum UserRole {
  User = 'USER',
  Manager = 'MANAGER',
  Admin = 'ADMIN',
}

export type UserModel = mongoose.Document & {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: UserRole;
  image: string;
  // timesheets: any;
  fullName: string;
  group: GroupModel;
  notifications: NotificationModel[];
};

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      default: UserRole.User,
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
      autopopulate: true,
    },
    notifications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Notification',
        autopopulate: true,
      },
    ],
  },
  {
    timestamps: true,
    usePushEach: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.plugin(autopopulate);

userSchema.plugin(autoIncrement.plugin, {
  model: 'User',
  startAt: 1,
  field: 'id',
});

// userSchema.virtual('timesheets', {
//   ref: 'Timesheet',
//   localField: '_id',
//   foreignField: 'owner',
//   autopopulate: { maxDepth: 5 },
// });

userSchema.virtual('fullName').get(function() {
  return `${this.firstname} ${this.lastname}`;
});

// export const User: UserType = mongoose.model<UserType>('User', userSchema);
const User = mongoose.model('User', userSchema);
export default User;
