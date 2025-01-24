import { createClient } from "@/supabase/server";

export async function GET() {
	try {
		const supabase = await createClient();

		const {
			data: { user }
		} = await supabase.auth.getUser();

		return new Response(JSON.stringify({ success: true, data: { user } }), {
			status: 200
		});
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
