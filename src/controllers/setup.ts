import { Response, Request, NextFunction } from 'express';
import Group from '../models/Group';
import User, { UserRole, UserModel } from '../models/User';
import Project from '../models/Project';
import TimesheetTemplate from '../models/TimesheetTemplate';
import Timesheet from '../models/Timesheet';
import QuestionArticle, {
  QuestionArticleModel,
} from '../models/QuestionArticle';
import QuestionCategory, {
  QuestionCategoryModel,
} from '../models/QuestionCategory';
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

const categories = [
  {
    title: 'General',
    icon: 'fas fa-comment',
    articles: [
      {
        title: 'How to sign up for a Timefly account.',
        teaser: 'Timefly Sign Up',
        body: `1. Goto [timefly.io](http://timefly.io) and click on the create account link.\n2. Fill up the basic details, agree to the Terms of Service and Privacy Policy and click submit.\n3. Timefly will send you a verification email to your email address given during the signup process. Click on the activation button from your email to and then sign in into Timefly.\n4. On successful sign in you will be taken to a page where you will need to setup your company name, address and contact details. We use this data for any reports that may be generated.\n5. Once you setup your company data you will need to create a site. A site nothing but a business location, a shop or a location. Employees must belong to a site and each site can have one or more time templates (employee schedules.) For example a site can be Dubai Office, London Office, UK Office etc.\n6. After creating your site you will be asked to create at least one time template (employee schedule). A site can have multiple time templates. For Example, if your company has lets say different timings for house keeping and other employees you can create several time templates\n7. under one site. However in this step you will be required to create one time template to proceed to the next step. Use the sliders and the on screen arrow keys to fine tune your time template.\n8. After setting up the above two steps Timefly will take you directly to the dashboard of your account and should look like the screen below. Note you may have an empty dashboard.`,
      },
      {
        title: 'How to set password for another user.',
        teaser:
          'How to update and set a password for another user as an admin.',
        body: `As an admin you can update the password for any user on your account. To do this go to Company > Manage Users and then click on *edit*.\n\nNext go to the password field and update the password.\n\nIf you decide to auto generate the password, Timefly will give you the option to send it to the employee once you save.\nOnce one scroll to the bottom and click on *save*.`,
      },
    ],
  },
  {
    title: 'Profile',
    icon: 'far fa-user-circle',
    articles: [
      {
        title: 'Profile View',
        teaser: 'Understanding the profile view and how to use it.',
        body: `You can access the profile view by clicking on your profile and clicking on profile.The data on this page is calculated as per the date range selected.\nBy default the last 30 days is selected.\n\n## Total Hours Worked\nThe total hours worked is the sum of all hours that you have punched in excluding your calculated breaks as per the punch algorithm.\n\nNote: This value changes as per the date range selected.\n\n## Total Hours Required\nThis is the total required hours as per your time template. This excludes holidays and weekends.\n\nNote: This value changes as per the date range selected.The punch statistics will show the total days of early/late punch IN and early/late punch OUT.\nThese values are only accurate if your company follows strict timing policy.\n\n## Punch Frequency\nThe punch frequency will indicate the during which hours of the day are the most punches recorded.\n\n## Punch Calendar\nThe punch calendar is where all your punches are shown. This calendar also shows the holidays, leaves/vacation and correction requests on your account.\n\nIf Timefly sees that there is a missing punch, it will be indicated with a missing out punch status. If you would like to correct any of the punches follow this article. How to raise correction requests.\n\nNote: Correction requests can only be raised for past days and cannot be raised for today.`,
      },
    ],
  },
];

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

    const helpCategories = categories.map(async item => {
      const articles = await Promise.all(
        item.articles.map(article => {
          const savedArticle = <QuestionArticleModel>(
            new QuestionArticle(article)
          );
          savedArticle.author = savedUser._id;

          return savedArticle.save();
        })
      );

      const category = <QuestionCategoryModel>new QuestionCategory({
        title: item.title,
        icon: item.icon,
        articles,
      });

      return category.save();
    });

    const savedCategories = await Promise.all(helpCategories);

    return res.json({
      data: {
        user: savedUser,
        categories: savedCategories,
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
