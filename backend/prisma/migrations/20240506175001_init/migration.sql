-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "authorId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "privilege" SET DEFAULT 0,
ALTER COLUMN "avatar" DROP NOT NULL;
