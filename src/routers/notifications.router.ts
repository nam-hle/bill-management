import { API } from "@/api";
import { NotificationsControllers } from "@/controllers";
import { router, privateProcedure } from "@/services/trpc/server";

export const notificationsRouter = router({
	readAll: privateProcedure.mutation(({ ctx: { user, supabase } }) => NotificationsControllers.readAll(supabase, user.id)),
	getQuery: privateProcedure
		.input(API.Notifications.List.PayloadSchema)
		.query(({ input, ctx: { user, supabase } }) => NotificationsControllers.getByUserId(supabase, user.id, input)),
	getMutation: privateProcedure
		.input(API.Notifications.List.PayloadSchema)
		.mutation(({ input, ctx: { user, supabase } }) => NotificationsControllers.getByUserId(supabase, user.id, input)),
	read: privateProcedure
		.input(API.Notifications.ReadSingle.PayloadSchema)
		.output(API.Notifications.ReadSingle.ResponseSchema)
		.mutation(async ({ input, ctx: { user, supabase } }) => {
			const unreadCount = await NotificationsControllers.read(supabase, user.id, input.notificationId);

			return { unreadCount };
		})
});
