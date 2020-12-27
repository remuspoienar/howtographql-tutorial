-- AlterTable
ALTER TABLE "Link" ADD COLUMN     "postedById" INTEGER;

-- CreateTable
CREATE TABLE "User" (
"id" SERIAL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vote" (
"id" SERIAL,
    "linkId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Vote.linkId_userId_unique" ON "Vote"("linkId", "userId");

-- AddForeignKey
ALTER TABLE "Vote" ADD FOREIGN KEY("linkId")REFERENCES "Link"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD FOREIGN KEY("userId")REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Link" ADD FOREIGN KEY("postedById")REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
