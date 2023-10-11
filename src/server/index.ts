import { mergeRouters } from "./trpc";

import { userRouter } from "./routers/users";
import { authRouter } from "./routers/auth";
import { uploadRouter } from "./routers/upload";
import { settingsRouter } from "./routers/settings";
import { messagesRouter } from "./routers/messages";
import { filesImagesRouter } from "./routers/files-images";

export const appRouter = mergeRouters(
  userRouter,
  authRouter,
  uploadRouter,
  settingsRouter,
  messagesRouter,
  filesImagesRouter,
);

export type AppRouter = typeof appRouter;
