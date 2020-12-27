export const postedBy = (parent, args, { prisma }) => {
  return prisma.link.findUnique({ where: { id: parent.id } }).postedBy();
};

export const votes = (parent, args, { prisma }) => {
  return prisma.link.findUnique({ where: { id: parent.id } }).votes();
};
