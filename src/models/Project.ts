import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
import autopopulate from 'mongoose-autopopulate';

import { UserModel, UserRole } from './User';
import { TimesheetModel } from './Timesheet';
import { GroupModel } from './Group';

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
  groups: GroupModel[];
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
          autopopulate: true,
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
  {
    timestamps: true,
    usePushEach: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

projectSchema.plugin(autopopulate);

projectSchema.virtual('groups', {
  ref: 'Group',
  foreignField: 'project',
  localField: '_id',
  autopopulate: true,
});

projectSchema.plugin(autoIncrement.plugin, {
  model: 'Project',
  startAt: 1,
  field: 'id',
});

const autoPopulate = function(next: any) {
  this.populate({
    path: 'members.user',
    populate: {
      path: 'timesheets',
      model: 'Timesheet',
      populate: {
        path: 'owner',
        model: 'User',
      },
    },
  });

  this.populate({
    path: 'members.user',
    populate: {
      path: 'group',
    },
  });

  this.populate('timesheets groups');
  this.populate({
    path: 'groups',
    populate: {
      path: 'members',
      populate: {
        path: 'timesheets',
        populate: {
          path: 'owner',
        },
      },
    },
  });
  this.populate({
    path: 'groups',
    populate: {
      path: 'timesheetTemplate',
      model: 'TimesheetTemplate',
    },
  });

  this.populate({
    path: 'timesheets',
    populate: {
      path: 'owner',
    },
  });

  next();
};

projectSchema.pre('find', autoPopulate);
projectSchema.pre('findOne', autoPopulate);

// export const Project: ProjectType = mongoose.model<ProjectType>('Project', projectSchema);
const Project = mongoose.model('Project', projectSchema);
export default Project;
