import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
import { UserModel } from './User';
import { TimesheetTemplateModel } from './TimesheetTemplate';

autoIncrement.initialize(mongoose.connection);

export type GroupModel = mongoose.Document & {
  id: number;
  name: string;
  members: UserModel[];
  timesheetTemplate: TimesheetTemplateModel;
};

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    timesheetTemplate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TimesheetTemplate',
      default: undefined,
    },
  },
  { timestamps: true, usePushEach: true }
);

groupSchema.plugin(autoIncrement.plugin, {
  model: 'Group',
  startAt: 1,
  field: 'id',
});

const autoPopulate = function(next: any) {
  this.populate('timesheetTemplate members');

  next();
};

groupSchema.pre('findById', autoPopulate);
groupSchema.pre('findOne', autoPopulate);
groupSchema.pre('find', autoPopulate);

// export const Group: GroupType = mongoose.model<GroupType>('Group', groupSchema);
const Group = mongoose.model('Group', groupSchema);
export default Group;
