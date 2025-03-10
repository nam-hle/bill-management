import { router } from "@/services/trpc/server";
import { billsRouter } from "@/routers/bills.router";
import { usersRouter } from "@/routers/users.router";
import { banksRouter } from "@/routers/banks.router";
import { groupsRouter } from "@/routers/groups.router";
import { profileRouter } from "@/routers/profile.router";
import { storageRouter } from "@/routers/storage.router";
import { transactionsRouter } from "@/routers/transactions.router";
import { notificationsRouter } from "@/routers/notifications.router";

export const appRouter = router({
	bills: billsRouter,
	users: usersRouter,
	banks: banksRouter,
	groups: groupsRouter,
	profile: profileRouter,
	storage: storageRouter,
	transactions: transactionsRouter,
	notifications: notificationsRouter
});

export type AppRouter = typeof appRouter;
