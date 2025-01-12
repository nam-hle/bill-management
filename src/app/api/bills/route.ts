import { createClient } from "@/supabase/server";
import { type BillFormState, type BillMemberRole } from "@/types";
import { BillsControllers } from "@/controllers/bills.controllers";
import { BillMembersControllers } from "@/controllers/bill-members.controllers";

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const payload = body as BillFormState;
		const supabase = await createClient();

		if (!payload.creditor || !payload.creditor.amount || !payload.creditor.userId) {
			throw new Error("Creditor is required");
		}

		const bill = await BillsControllers.createBill(supabase, { description: payload.description, creatorId: payload.creditor.userId });

		// Step 2: Insert bill members
		const billMembers = payload.debtors.map((debtor) => {
			if (!debtor.userId || !debtor.amount) {
				throw new Error("Debtor is missing userId or amount");
			}

			return {
				billId: bill.id,
				userId: debtor.userId,
				amount: debtor.amount,
				role: "Debtor" as BillMemberRole
			};
		});

		billMembers.push({
			billId: bill.id,
			userId: payload.creditor.userId,
			amount: payload.creditor.amount,
			role: "Creditor" as BillMemberRole
		});

		const members = await BillMembersControllers.createMany(supabase, billMembers);

		console.log("Bill and members successfully inserted:", { bill, members });

		return new Response(JSON.stringify({ success: true, data: { billData: bill, billMembers } }), {
			status: 201
		});
	} catch (error) {
		console.error("Error creating bill:", error);

		return new Response(
			JSON.stringify({
				error: "Internal Server Error",
				details: (error as any).message
			}),
			{ status: 500 }
		);
	}
}
