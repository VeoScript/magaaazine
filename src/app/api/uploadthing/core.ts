import { createUploadthing } from "uploadthing/next-legacy";

const f = createUploadthing();

// * File Router -- Can contain multiple files
export const ourFileRouter = {
  // * Takes a 4 2mb images and/or 1 256mb video
  mediaPost: f({
    pdf: { maxFileSize: "2MB", maxFileCount: 3 },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
      maxFileSize: "2MB",
      maxFileCount: 3,
    },
    "application/vnd.ms-excel": { maxFileSize: "2MB", maxFileCount: 3 },
    "application/vnd.ms-powerpoint": { maxFileSize: "2MB", maxFileCount: 3 },
  }).onUploadComplete(() => {}),
};

export type OurFileRouter = typeof ourFileRouter;
