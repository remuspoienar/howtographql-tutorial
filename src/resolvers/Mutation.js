import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import { APP_SECRET, getUserId } from '../utils';
export const post = async (
  parent,
  { description, url },
  { prisma, pubsub, userId }
) => {
  const link = await prisma.link.create({
    data: { url, description, postedBy: { connect: { id: userId } } },
  });
  pubsub.publish('NEW_LINK', link);
  return link;
};

export const signup = async (parent, args, { prisma }, info) => {
  const password = await bcrypt.hash(args.password, 10);

  const user = await prisma.user.create({
    data: { ...args, password },
  });

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
  };
};

export const login = async (parent, { email, password }, { prisma }, info) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) {
    throw new Error('No such user found');
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw new Error('Invalid password');
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
  };
};

export const updateLink = async (parent, { id, ...fields }, { prisma }) => {
  const link = prisma.link.update({
    data: { ...fields },
    where: { id: Number(id) },
  });

  return link;
};

export const deleteLink = async (parent, { id }, { prisma, pubsub }) => {
  const link = await prisma.link.delete({ where: { id: Number(id) } });

  return link;
};

export const vote = async (
  parent,
  { linkId },
  { prisma, ...context },
  info
) => {
  const userId = getUserId(context);

  const vote = await prisma.vote.findUnique({
    where: {
      linkId_userId: {
        linkId: Number(linkId),
        userId,
      },
    },
  });

  if (Boolean(vote)) {
    throw new Error(`Already voted for link: ${linkId}`);
  }

  const newVote = prisma.vote.create({
    data: {
      user: { connect: { id: userId } },
      link: { connect: { id: Number(linkId) } },
    },
  });
  context.pubsub.publish('NEW_VOTE', newVote);

  return newVote;
};
