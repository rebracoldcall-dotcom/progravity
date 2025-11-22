import { router } from "./init";
import { authRouter } from "./routers/auth";
import { billingRouter } from "./routers/billing";
import { chatRouter } from "./routers/chat";
import { settingsRouter } from "./routers/settings";
import { teamRouter } from "./routers/team";

export const appRouter = router({
  auth: authRouter,
  billing: billingRouter,
  chat: chatRouter,
  settings: settingsRouter,
  team: teamRouter,
});

export type AppRouter = typeof appRouter;
