import { PrismaClient } from '@prisma/client';
import { lorem, internet } from 'faker';
const prisma = new PrismaClient();

async function main() {
  await Promise.all(
    Array(30)
      .fill()
      .map((x) => {
        return prisma.link.create({
          data: {
            description: lorem.sentences(5),
            url: internet.url(),
          },
        });
      })
  );

  const allLinks = await prisma.link.findMany();
  console.log(allLinks);
}

main()
  .catch((e) => {
    throw e;
  })

  .finally(async () => {
    await prisma.$disconnect();
  });
