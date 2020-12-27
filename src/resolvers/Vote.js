export const link = (parent, args, { prisma }) => {
  return prisma.vote.findUnique({ where: { id: parent.id } }).link();
};

export const user = (parent, args, { prisma }) => {
  return prisma.vote.findUnique({ where: { id: parent.id } }).user();
};
