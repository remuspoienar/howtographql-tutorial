import fs from 'fs';
import path from 'path';
import { ApolloServer, PubSub } from 'apollo-server';
import { PrismaClient } from '@prisma/client';

import { info, feed } from './resolvers/Query';
import {
  post,
  updateLink,
  deleteLink,
  signup,
  login,
  vote,
} from './resolvers/Mutation';
import { newLink, newVote } from './resolvers/Subscription';
import { links } from './resolvers/User';
import { postedBy } from './resolvers/Link';
import { link, user } from './resolvers/Vote';
import { getUserId } from './utils';

const prisma = new PrismaClient();
const pubsub = new PubSub();

const resolvers = {
  Query: {
    info,
    feed,
  },
  Mutation: {
    post,
    updateLink,
    deleteLink,
    signup,
    login,
    vote,
  },
  Subscription: {
    newLink,
    newVote,
  },
  User: {
    links,
  },
  Link: {
    postedBy,
  },
  Vote: {
    link,
    user,
  },
};

const context = ({ req }) => ({
  ...req,
  prisma,
  pubsub,
  userId: req && req.headers.authorization ? getUserId(req) : null,
});
const typeDefs = fs.readFileSync(
  path.join(__dirname, 'schema.graphql'),
  'utf8'
);
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
});

server.listen().then(({ url }) => console.log(`Server is running on ${url}`));
