import { Response, Request, NextFunction } from 'express';
import { default as Group, GroupModel } from '../models/Group';
import User, { UserModel } from '../models/User';
import Project from '../models/Project';
import TimesheetTemplate from '../models/TimesheetTemplate';

export let list = async (req: Request, res: Response, next: NextFunction) => {
  let options = {};
  const take = req.query.take ? +req.query.take : 9999;
  let skip = req.query.skip ? +req.query.skip : 0;

  try {
    if (req.query.byUser) {
      const user = await User.findOne({ id: req.query.byUser });

      if (!user) {
        throw new Error('Unable to find user.');
      }
      options = { members: user._id };
    }

    const totalCount = await Group.count({});

    if (req.body.except) {
      options = {
        ...options,
        id: { $nin: req.body.except },
      };

      if (totalCount - req.body.except.length <= skip) {
        skip = 0;
      }
    }

    const groups = await Group.find(options)
      // .skip(skip)
      .limit(take);

    const count = groups.length;

    return res.json({ totalCount, count, data: groups });
  } catch (error) {
    next(error);
  }
};

export let find = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const group = await Group.findOne({ id: req.params.id });

    return res.json(group);
  } catch (error) {
    next(error);
  }
};

export let create = async (req: Request, res: Response, next: NextFunction) => {
  const {
    name,
    userId,
    timesheetTemplate: timesheetTemplateId,
    project: projectId,
  } = req.body;

  try {
    const user = await User.findOne({ id: userId });
    const project: any = await Project.findOne({ id: projectId });

    if (!user) {
      throw new Error(`Unable to find user with id: ${userId}.`);
    }

    if (!project) {
      throw new Error(`Unable to find project with id: ${projectId}.`);
    }

    const group = <GroupModel>new Group({ name, members: [] });
    group.members = [user._id];

    if (timesheetTemplateId) {
      const timesheetTemplate = await TimesheetTemplate.findOne({
        id: timesheetTemplateId,
      });

      if (timesheetTemplate) {
        group.timesheetTemplate = timesheetTemplate._id;
      }
    }

    const savedGroup = await group.save();

    project.groups.push(group._id);

    await project.save();

    const result = await Group.findById(savedGroup._id);

    return res.json(result);
  } catch (error) {
    next(error);
  }
};

export let update = async (req: Request, res: Response, next: NextFunction) => {
  const { name, members } = req.body;

  try {
    const group = <GroupModel>await Group.findOne({ id: req.params.id });

    group.name = name || group.name;
    group.members = members || group.members;

    const savedGroup = await group.save();

    const result = await Group.findOne({ id: savedGroup.id });

    return res.json(result);
  } catch (error) {
    next(error);
  }
};

export let remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const removedGroup = await Group.findOneAndRemove({
      id: req.params.id,
    });

    return res.json(removedGroup);
  } catch (error) {
    next(error);
  }
};

export let updateGroupMember = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId, groupId } = req.body;

  try {
    const user = <UserModel>await User.findOne({ id: userId });
    const group = <GroupModel>await Group.findOne({ id: groupId });

    await Group.update(
      {},
      { $pull: { members: user._id } },
      { upsert: true, multi: true }
    );

    group.members.push(user._id);

    await group.save();

    const result = await Group.findOne({ id: groupId });
    return res.json(result);
  } catch (error) {
    next(error);
  }
  // try {
  //   const user = <UserModel>await User.findOne({ id: userId });
  //   const group = <GroupModel>await Group.findOne({ id: groupId });

  //   user.group = group._id;

  //   await user.save();

  //   const previousGroups = await Group.find({ members: user._id });
  //   const previousGroupIds = previousGroups.map(
  //     (group: GroupModel) => group.id
  //   );

  //   await Group.update(
  //     {},
  //     { $pull: { members: user._id } },
  //     { upsert: true, multi: true }
  //   );

  //   const promises = groupIds.map(async (groupId: number) => {
  //     const group = <GroupModel>await Group.findOne({ id: groupId });

  //     group.members.push(user._id);
  //     return group.save();
  //   });

  //   await Promise.all(promises);

  //   const groups = await Group.find({
  //     id: { $in: [...groupIds, ...previousGroupIds] },
  //   }).populate('members timesheetTemplate');

  //   return res.json(groups);
  // } catch (error) {
  //   next(error);
  // }
};
