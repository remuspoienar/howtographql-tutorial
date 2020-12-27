export const links = (parent, args, { prisma }) => {
  return prisma.user.findUnique({ where: { id: parent.id } }).links();
};
