import prisma from "~/config/Prisma";
import { NextResponse } from "next/server";
import { utapi } from "~/server/uploadthing";

export async function POST(request: Request) {
  let oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);

  const allFiles = await prisma.filesImages.findMany({
    where: {
      type: "FILE",
      created_at: {
        lt: oneDayAgo,
      },
    },
  });

  if (allFiles) {
    const uploadthingDeleteAllFiles = await utapi.deleteFiles(
      allFiles ? allFiles.map((file) => file.delete_url as string) : [],
    );

    await prisma.filesImages.deleteMany({
      where: {
        type: "FILE",
        created_at: {
          lt: oneDayAgo,
        },
      },
    });

    if (uploadthingDeleteAllFiles.success) {
      return new NextResponse("All files/images deleted successfully.", {
        status: 200,
      });
    } else {
      return new NextResponse("Something wrong while deleting all files/images.", {
        status: 400,
      });
    }
  }
}
