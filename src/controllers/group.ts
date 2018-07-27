import { Response, Request, NextFunction } from 'express';
import { default as Group, GroupModel } from '../models/Group';
import User, { UserModel } from '../models/User';

export let list = async (req: Request, res: Response, next: NextFunction) => {
  let options = {};

  try {
    if (req.query.byUser) {
      const user = await User.findOne({ id: req.query.byUser });

      if (!user) {
        throw new Error('Unable to find user.');
      }
      options = { members: user._id };
    }

    const groups = await Group.find(options)
      .populate('members')
      .populate('timesheetTemplate');

    return res.json(groups);
  } catch (error) {
    next(error);
  }
};

export let find = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const group = await Group.findOne({ id: req.params.id })
      .populate('members')
      .populate('timesheetTemplate');

    return res.json(group);
  } catch (error) {
    next(error);
  }
};

export let create = async (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.body;

  try {
    const group = new Group({ name, members: [] });

    const savedGroup = await group.save();

    return res.json(savedGroup);
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

    return res.json(savedGroup);
  } catch (error) {
    next(error);
  }
};

export let remove = async (req: Request, res: Response, next: NextFunction) => {
  const { groupId } = req.body;

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
  const { groupIds, userId } = req.body;

  try {
    const user = <UserModel>await User.findOne({ id: userId });

    const previousGroups = await Group.find({ members: user._id });
    const previousGroupIds = previousGroups.map(
      (group: GroupModel) => group.id
    );

    await Group.update(
      {},
      { $pull: { members: user._id } },
      { upsert: true, multi: true }
    );

    const promises = groupIds.map(async (groupId: number) => {
      const group = <GroupModel>await Group.findOne({ id: groupId });

      group.members.push(user._id);
      return group.save();
    });

    await Promise.all(promises);

    const groups = await Group.find({
      id: { $in: [...groupIds, ...previousGroupIds] },
    }).populate('members');

    return res.json(groups);
  } catch (error) {
    next(error);
  }
};
