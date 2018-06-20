import bcrypt from 'bcrypt-nodejs';
import crypto from 'crypto';
import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
import { UserModel, UserRole } from './User';
import { TimesheetModel } from './Timesheet';

autoIncrement.initialize(mongoose.connection);

export interface ProjectMember {
  user: UserModel | number;
  role: UserRole;
}

export type ProjectModel = mongoose.Document & {
  id: number;
  name: string;
  members: ProjectMember[];
  timesheets: TimesheetModel[] | number[];
};

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        role: String,
      },
    ],
    timesheets: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Timesheet',
      },
    ],
  },
  { timestamps: true }
);

projectSchema.plugin(autoIncrement.plugin, {
  model: 'Project',
  startAt: 1,
  field: 'id',
});

// export const Project: ProjectType = mongoose.model<ProjectType>('Project', projectSchema);
const Project = mongoose.model('Project', projectSchema);
export default Project;
