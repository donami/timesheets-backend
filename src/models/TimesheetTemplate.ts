import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

autoIncrement.initialize(mongoose.connection);

export enum ReportType {
  Hours = 'HOURS',
  StartEnd = 'StartEnd',
}

export interface DayType {
  from: string;
  to: string;
  holiday?: boolean;
}

const DayTypeSchema = new mongoose.Schema({
  from: String,
  to: String,
  holiday: {
    type: String,
    required: false,
    default: false,
  },
});

export type TimesheetTemplateModel = mongoose.Document & {
  name: string;
  workHoursPerDay: number;
  shiftStartTime?: string;
  shiftEndTime?: string;
  reportType: ReportType;
  startEndDays?: {
    monday: DayType;
    tuesday: DayType;
    wednesday: DayType;
    thursday: DayType;
    friday: DayType;
    saturday: DayType;
    sunday: DayType;
  };
  hoursDays: {
    monday: number;
    tuesday: number;
    wednesday: number;
    thursday: number;
    friday: number;
    saturday: number;
    sunday: number;
  };
};

const timesheetTemplateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    workHoursPerDay: {
      type: Number,
      required: true,
    },
    shiftStartTime: {
      type: String,
      required: false,
    },
    shiftEndTime: {
      type: String,
      required: false,
    },
    reportType: {
      type: String,
      required: true,
    },
    startEndDays: {
      monday: DayTypeSchema,
      tuesday: DayTypeSchema,
      wednesday: DayTypeSchema,
      thursday: DayTypeSchema,
      friday: DayTypeSchema,
      saturday: DayTypeSchema,
      sunday: DayTypeSchema,
    },
    hoursDays: {
      monday: Number,
      tuesday: Number,
      wednesday: Number,
      thursday: Number,
      friday: Number,
      saturday: Number,
      sunday: Number,
    },
  },
  { timestamps: true, usePushEach: true }
);

timesheetTemplateSchema.plugin(autoIncrement.plugin, {
  model: 'TimesheetTemplate',
  startAt: 1,
  field: 'id',
});

// export const TimesheetTemplate: TimesheetTemplateType = mongoose.model<TimesheetTemplateType>('TimesheetTemplate', timesheetTemplateSchema);
const TimesheetTemplate = mongoose.model(
  'TimesheetTemplate',
  timesheetTemplateSchema
);
export default TimesheetTemplate;
