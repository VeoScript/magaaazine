import { mergeRouters } from "./trpc";

import { userRouter } from "./routers/users";
import { authRouter } from "./routers/auth";

export const appRouter = mergeRouters(userRouter, authRouter);

export type AppRouter = typeof appRouter;
