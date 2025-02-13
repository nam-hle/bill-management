import { TransactionsControllers } from "@/controllers";
import { getCurrentUser, createSupabaseServer } from "@/services";

export async function POST() {
	try {
		const supabase = await createSupabaseServer();
		const currentUser = await getCurrentUser();

		const response = await TransactionsControllers.suggest(supabase, currentUser.id);

		return new Response(JSON.stringify(response), { status: 200 });
	} catch (error) {
		return new Response(
			JSON.stringify({
				error: "Internal Server Error",
				details: (error as any).message
			}),
			{ status: 500 }
		);
	}
}
