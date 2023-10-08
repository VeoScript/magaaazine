import { mergeRouters } from "./trpc";

import { messageRouter } from "./routers/hello";
import { userRouter } from "./routers/users";
import { authRouter } from "./routers/auth";

export const appRouter = mergeRouters(messageRouter, userRouter, authRouter);

export type AppRouter = typeof appRouter;
