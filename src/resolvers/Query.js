export const info = () => `This is the API of a Hackernews Clone`;
export const feed = async (
  parent,
  { filter, skip, take, orderBy },
  { prisma }
) => {
  const where = filter
    ? {
        OR: [
          { url: { contains: filter } },
          { description: { contains: filter } },
        ],
      }
    : {};
  const links = await prisma.link.findMany({ where, skip, take, orderBy });
  const count = await prisma.link.count({ where });
  return { links, count };
};
