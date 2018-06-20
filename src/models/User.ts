import bcrypt from 'bcrypt-nodejs';
import crypto from 'crypto';
import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

autoIncrement.initialize(mongoose.connection);

export enum UserRole {
  User = 'USER',
  Admin = 'ADMIN',
}

export type UserModel = mongoose.Document & {
  email: string;
  password: string;
  role: UserRole;
};

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: UserRole.User,
    },
  },
  { timestamps: true }
);

userSchema.plugin(autoIncrement.plugin, {
  model: 'User',
  startAt: 1,
  field: 'id',
});

// export const User: UserType = mongoose.model<UserType>('User', userSchema);
const User = mongoose.model('User', userSchema);
export default User;
