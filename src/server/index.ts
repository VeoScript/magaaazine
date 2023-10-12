import { mergeRouters } from "./trpc";

import { userRouter } from "./routers/users";
import { authRouter } from "./routers/auth";
import { resetPasswordRouter } from "./routers/reset-password";
import { uploadRouter } from "./routers/upload";
import { settingsRouter } from "./routers/settings";
import { messagesRouter } from "./routers/messages";
import { filesImagesRouter } from "./routers/files-images";
import { unreadRouter } from "./routers/unread";

export const appRouter = mergeRouters(
  userRouter,
  authRouter,
  resetPasswordRouter,
  uploadRouter,
  settingsRouter,
  messagesRouter,
  filesImagesRouter,
  unreadRouter,
);

export type AppRouter = typeof appRouter;
