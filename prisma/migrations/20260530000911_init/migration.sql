-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "has_file" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "is_verified" BOOLEAN DEFAULT true,
ADD COLUMN     "spotify_link" TEXT,
ADD COLUMN     "tiktok_link" TEXT,
ADD COLUMN     "youtube_link" TEXT;
