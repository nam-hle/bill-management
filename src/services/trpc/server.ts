import superjson from "superjson";
import { initTRPC, TRPCError } from "@trpc/server";

import { getCurrentUser, createSupabaseServer } from "@/services/supabase/server";

export const createContext = async () => {
	const user = await getCurrentUser();
	const supabase = await createSupabaseServer();

	return { user, supabase };
};

const t = initTRPC.context<typeof createContext>().create({ transformer: superjson });

export const router = t.router;

const withAuth = t.middleware(async ({ ctx, next }) => {
	if (!ctx.user) {
		throw new TRPCError({ code: "UNAUTHORIZED" });
	}

	return next({ ctx });
});

const withErrorHandler = t.middleware(async ({ ctx, next }) => {
	try {
		return await next({ ctx });
	} catch (error) {
		if (error instanceof TRPCError) {
			throw error;
		}

		// eslint-disable-next-line no-console
		console.error("Unexpected error:", error);

		throw new TRPCError({
			code: "INTERNAL_SERVER_ERROR",
			message: "An unexpected error occurred"
		});
	}
});

export const privateProcedure = t.procedure.use(withErrorHandler).use(withAuth);
