import { mergeRouters } from "./trpc";

import { userRouter } from "./routers/users";
import { authRouter } from "./routers/auth";
import { uploadRouter } from "./routers/upload";

export const appRouter = mergeRouters(userRouter, authRouter, uploadRouter);

export type AppRouter = typeof appRouter;
