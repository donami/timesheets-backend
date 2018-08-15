import { Response, Request, NextFunction } from 'express';
import Group from '../models/Group';
import User, { UserRole, UserModel } from '../models/User';
import Project from '../models/Project';
import TimesheetTemplate from '../models/TimesheetTemplate';
import Timesheet from '../models/Timesheet';
import QuestionArticle from '../models/QuestionArticle';
import QuestionCategory from '../models/QuestionCategory';
import Notification from '../models/Notification';

export let isConfigured = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const projects = await Project.find();

    const hasProjects = projects.length > 0;

    return res.json({
      configured: hasProjects,
    });
  } catch (error) {
    next(error);
  }
};

export let setup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await Promise.all([
      User.deleteMany({}),
      Project.deleteMany({}),
      Timesheet.deleteMany({}),
      Group.deleteMany({}),
      TimesheetTemplate.deleteMany({}),
      QuestionArticle.deleteMany({}),
      QuestionCategory.deleteMany({}),
      Notification.deleteMany({}),
    ]);

    const { user: userData, project: projectData, group: groupData } = req.body;

    const user = <UserModel>new User({
      firstname: userData.firstname,
      lastname: userData.lastname,
      email: userData.email,
      password: userData.password,
      role: UserRole.Admin,
    });

    const project = new Project({
      name: projectData.name,
      members: [
        {
          role: UserRole.Admin,
          user: user._id,
        },
      ],
    });

    const group = new Group({
      name: groupData.name,
      project: project._id,
    });

    user.group = group._id;

    const savedUser = await user.save();
    const savedProject = await project.save();
    const savedGroup = await group.save();

    return res.json({
      data: {
        user: savedUser,
        project: savedProject,
        group: savedGroup,
      },
      success: true,
      status: 200,
    });
  } catch (error) {
    next(error);
  }
};
