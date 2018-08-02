import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

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
  timesheets: any;
  fullName: string;
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
    timesheets: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Timesheet',
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

userSchema.plugin(autoIncrement.plugin, {
  model: 'User',
  startAt: 1,
  field: 'id',
});

userSchema.virtual('fullName').get(function() {
  return `${this.firstname} ${this.lastname}`;
});

// export const User: UserType = mongoose.model<UserType>('User', userSchema);
const User = mongoose.model('User', userSchema);
export default User;
