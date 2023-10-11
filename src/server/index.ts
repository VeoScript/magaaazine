import { mergeRouters } from "./trpc";

import { userRouter } from "./routers/users";
import { authRouter } from "./routers/auth";
import { uploadRouter } from "./routers/upload";
import { settingsRouter } from "./routers/settings";
import { messagesRouter } from "./routers/messages";

export const appRouter = mergeRouters(
  userRouter,
  authRouter,
  uploadRouter,
  settingsRouter,
  messagesRouter,
);

export type AppRouter = typeof appRouter;
