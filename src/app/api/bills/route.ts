import { createClient } from "@/supabase/server";
import { type BillFormState, type BillMemberRole } from "@/types";
import { BillsControllers } from "@/controllers/bills.controllers";
import { BillMembersControllers } from "@/controllers/bill-members.controllers";

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const payload = body as BillFormState;
		const supabase = await createClient();

		if (!payload.creditor || !payload.creditor.amount || !payload.creditor.user?.id) {
			throw new Error("Creditor is required");
		}

		const {
			data: { user: trigger }
		} = await supabase.auth.getUser();

		if (!trigger) {
			throw new Error("User not found");
		}

		// Step 1: Insert bill
		const bill = await BillsControllers.createBill(supabase, { description: payload.description, creatorId: payload.creditor.user.id });

		// Step 2: Insert bill members
		const billMembers = payload.debtors.map((debtor) => {
			if (!debtor.user?.id || !debtor.amount) {
				throw new Error("Debtor is missing userId or amount");
			}

			return {
				billId: bill.id,
				userId: debtor.user?.id,
				amount: debtor.amount,
				role: "Debtor" as BillMemberRole
			};
		});

		billMembers.push({
			billId: bill.id,
			userId: payload.creditor.user.id,
			amount: payload.creditor.amount,
			role: "Creditor" as BillMemberRole
		});

		const members = await BillMembersControllers.createMany(supabase, billMembers);

		// Step 3: Insert notifications
		const billMemberNotifications = payload.debtors.map((debtor) => {
			if (!debtor.user?.id || !debtor.amount) {
				throw new Error("Debtor is missing userId or amount");
			}

			return {
				type: "BillCreated" as const,
				userId: debtor.user?.id,
				billId: bill.id,
				triggerId: trigger.id
			};
		});
		const { error: notificationErrors } = await supabase.from("notifications").insert(billMemberNotifications);

		if (notificationErrors) {
			throw new Error("Error inserting notifications");
		}

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
