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
    monday: {
      inTime: string;
      outTime: string;
      break: number;
      totalHours: number;
      holiday: boolean;
    };
    tuesday: {
      inTime: string;
      outTime: string;
      break: number;
      totalHours: number;
      holiday: boolean;
    };
    wednesday: {
      inTime: string;
      outTime: string;
      break: number;
      totalHours: number;
      holiday: boolean;
    };
    thursday: {
      inTime: string;
      outTime: string;
      break: number;
      totalHours: number;
      holiday: boolean;
    };
    friday: {
      inTime: string;
      outTime: string;
      break: number;
      totalHours: number;
      holiday: boolean;
    };
    saturday: {
      inTime: string;
      outTime: string;
      break: number;
      totalHours: number;
      holiday: boolean;
    };
    sunday: {
      inTime: string;
      outTime: string;
      break: number;
      totalHours: number;
      holiday: boolean;
    };
  };
  // hoursDays: {
  //   monday: number;
  //   tuesday: number;
  //   wednesday: number;
  //   thursday: number;
  //   friday: number;
  //   saturday: number;
  //   sunday: number;
  // };
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
      monday: {
        inTime: String,
        outTime: String,
        break: Number,
        totalHours: Number,
        holiday: {
          type: Boolean,
          default: false,
        },
      },
      tuesday: {
        inTime: String,
        outTime: String,
        break: Number,
        totalHours: Number,
        holiday: {
          type: Boolean,
          default: false,
        },
      },
      wednesday: {
        inTime: String,
        outTime: String,
        break: Number,
        totalHours: Number,
        holiday: {
          type: Boolean,
          default: false,
        },
      },
      thursday: {
        inTime: String,
        outTime: String,
        break: Number,
        totalHours: Number,
        holiday: {
          type: Boolean,
          default: false,
        },
      },
      friday: {
        inTime: String,
        outTime: String,
        break: Number,
        totalHours: Number,
        holiday: {
          type: Boolean,
          default: false,
        },
      },
      saturday: {
        inTime: String,
        outTime: String,
        break: Number,
        totalHours: Number,
        holiday: {
          type: Boolean,
          default: false,
        },
      },
      sunday: {
        inTime: String,
        outTime: String,
        break: Number,
        totalHours: Number,
        holiday: {
          type: Boolean,
          default: false,
        },
      },
    },
    // hoursDays: {
    //   monday: Number,
    //   tuesday: Number,
    //   wednesday: Number,
    //   thursday: Number,
    //   friday: Number,
    //   saturday: Number,
    //   sunday: Number,
    // },
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
