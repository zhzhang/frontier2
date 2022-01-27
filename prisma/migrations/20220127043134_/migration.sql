-- CreateEnum
CREATE TYPE "RelationType" AS ENUM ('ADVISOR', 'ADVISEE', 'COAUTHOR', 'COWORKER', 'FAMILY', 'SOCIAL');

-- CreateEnum
CREATE TYPE "IdentityContext" AS ENUM ('AUTHOR', 'REVIEWER', 'CHAIR');

-- CreateEnum
CREATE TYPE "ThreadMessageType" AS ENUM ('COMMENT', 'REVIEW', 'DECISION');

-- CreateEnum
CREATE TYPE "ReviewPolicyType" AS ENUM ('OPEN', 'SINGLE_BLIND', 'DOUBLE_BLIND');

-- CreateEnum
CREATE TYPE "ReviewRequestType" AS ENUM ('ROOT', 'REVIEW', 'CHAIR');

-- CreateEnum
CREATE TYPE "ReviewRequestStatus" AS ENUM ('CREATED', 'RELEASED', 'ACCEPTED', 'DECLINED', 'COMPLETED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "twitter" TEXT,
    "website" TEXT,
    "profilePictureUrl" TEXT,
    "institution" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Relation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "relation" "RelationType" NOT NULL,
    "endDate" TIMESTAMP(3),

    CONSTRAINT "Relation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Article" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "abstract" TEXT NOT NULL,
    "anonymous" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Identity" (
    "id" TEXT NOT NULL,
    "context" "IdentityContext",
    "venueId" TEXT,
    "number" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "anonymized" BOOLEAN NOT NULL DEFAULT true,
    "articleId" TEXT NOT NULL,

    CONSTRAINT "Identity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArticleVersion" (
    "id" TEXT NOT NULL,
    "ref" TEXT,
    "articleId" TEXT NOT NULL,
    "versionNumber" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ArticleVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ThreadMessage" (
    "id" TEXT NOT NULL,
    "type" "ThreadMessageType" NOT NULL,
    "body" TEXT NOT NULL,
    "highlights" JSONB NOT NULL,
    "authorIdentityId" TEXT,
    "authorId" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "headId" TEXT,
    "venueId" TEXT,
    "rating" JSONB,
    "decision" BOOLEAN NOT NULL DEFAULT true,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "publishTimestamp" TIMESTAMP(3),
    "released" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ThreadMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Venue" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "acceptingSubmissions" BOOLEAN NOT NULL DEFAULT false,
    "reviewPolicy" "ReviewPolicyType" NOT NULL DEFAULT E'DOUBLE_BLIND',
    "reviewTemplate" TEXT,
    "ratingFields" JSONB,
    "websiteUrl" TEXT,
    "abbreviation" TEXT,
    "description" TEXT,
    "logoRef" TEXT,
    "venueDate" TIMESTAMP(3),
    "submissionDeadline" TIMESTAMP(3),

    CONSTRAINT "Venue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VenueMembership" (
    "id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "venueId" TEXT NOT NULL,

    CONSTRAINT "VenueMembership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewRequest" (
    "id" TEXT NOT NULL,
    "type" "ReviewRequestType" NOT NULL,
    "articleId" TEXT NOT NULL,
    "venueId" TEXT NOT NULL,
    "parentRequestId" TEXT,
    "userId" TEXT,
    "note" TEXT NOT NULL DEFAULT E'',
    "status" "ReviewRequestStatus" NOT NULL DEFAULT E'CREATED',
    "reviewId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReviewRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_twitter_key" ON "User"("twitter");

-- CreateIndex
CREATE UNIQUE INDEX "User_website_key" ON "User"("website");

-- CreateIndex
CREATE UNIQUE INDEX "User_profilePictureUrl_key" ON "User"("profilePictureUrl");

-- CreateIndex
CREATE UNIQUE INDEX "ReviewRequest_reviewId_key" ON "ReviewRequest"("reviewId");

-- AddForeignKey
ALTER TABLE "Relation" ADD CONSTRAINT "Relation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Relation" ADD CONSTRAINT "Relation_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Identity" ADD CONSTRAINT "Identity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Identity" ADD CONSTRAINT "Identity_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Identity" ADD CONSTRAINT "Identity_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleVersion" ADD CONSTRAINT "ArticleVersion_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThreadMessage" ADD CONSTRAINT "ThreadMessage_authorIdentityId_fkey" FOREIGN KEY ("authorIdentityId") REFERENCES "Identity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThreadMessage" ADD CONSTRAINT "ThreadMessage_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThreadMessage" ADD CONSTRAINT "ThreadMessage_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThreadMessage" ADD CONSTRAINT "ThreadMessage_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueMembership" ADD CONSTRAINT "VenueMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueMembership" ADD CONSTRAINT "VenueMembership_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewRequest" ADD CONSTRAINT "ReviewRequest_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewRequest" ADD CONSTRAINT "ReviewRequest_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewRequest" ADD CONSTRAINT "ReviewRequest_parentRequestId_fkey" FOREIGN KEY ("parentRequestId") REFERENCES "ReviewRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewRequest" ADD CONSTRAINT "ReviewRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewRequest" ADD CONSTRAINT "ReviewRequest_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "ThreadMessage"("id") ON DELETE SET NULL ON UPDATE CASCADE;
