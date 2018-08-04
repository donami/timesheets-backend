import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

import { UserModel } from './User';
import { TimesheetTemplateModel } from './TimesheetTemplate';
import { ProjectModel } from '../models/Project';

autoIncrement.initialize(mongoose.connection);

export type GroupModel = mongoose.Document & {
  id: number;
  name: string;
  members: UserModel[];
  timesheetTemplate: TimesheetTemplateModel;
  project: ProjectModel;
};

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    timesheetTemplate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TimesheetTemplate',
      default: undefined,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
    },
  },
  {
    timestamps: true,
    usePushEach: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

groupSchema.plugin(autoIncrement.plugin, {
  model: 'Group',
  startAt: 1,
  field: 'id',
});

// groupSchema.virtual('members', {
//   ref: 'User',
//   localField: '_id',
//   foreignField: 'group',
// });

const autoPopulate = function(next: any) {
  this.populate('timesheetTemplate');

  // this.populate({
  //   path: 'members',
  //   populate: {
  //     path: 'timesheets',
  //   },
  // });

  next();
};

groupSchema.pre('findById', autoPopulate);
groupSchema.pre('findOne', autoPopulate);
groupSchema.pre('find', autoPopulate);

// export const Group: GroupType = mongoose.model<GroupType>('Group', groupSchema);
const Group = mongoose.model('Group', groupSchema);
export default Group;
