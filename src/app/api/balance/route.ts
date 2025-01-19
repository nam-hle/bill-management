import { calculateMoney } from "@/utils";
import { createClient } from "@/supabase/server";
import { BillsControllers } from "@/controllers/bills.controllers";

export async function GET() {
	try {
		const supabase = await createClient();

		const {
			data: { user }
		} = await supabase.auth.getUser();

		if (!user) {
			throw new Error("User not found");
		}

		const userBillsData = await BillsControllers.getBillsByMemberId(supabase, { memberId: user.id });

		const balance = (userBillsData ?? []).reduce(
			(result, bill) => {
				const balances = calculateMoney(bill, user.id);
				result.net += balances.net;
				result.paid += balances.paid ?? 0;
				result.owed += balances.owed ?? 0;

				return result;
			},
			{ net: 0, paid: 0, owed: 0 }
		);

		return new Response(JSON.stringify({ success: true, data: { balance } }), {
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
