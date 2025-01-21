import { createClient } from "@/supabase/server";
import { type BillFormState, type BillMemberRole } from "@/types";
import { BillsControllers } from "@/controllers/bills.controllers";
import { BillMembersControllers } from "@/controllers/bill-members.controllers";

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const payload = body as BillFormState;
		const supabase = await createClient();

		// TODO: Convert to right format
		if (!payload.creditor || !payload.creditor.amount || !payload.creditor.userId || !payload.issuedAt) {
			throw new Error("Creditor is required");
		}

		const {
			data: { user: trigger }
		} = await supabase.auth.getUser();

		if (!trigger) {
			throw new Error("User not found");
		}

		// Step 1: Insert bill
		const bill = await BillsControllers.createBill(supabase, {
			issuedAt: payload.issuedAt,
			description: payload.description,
			creatorId: payload.creditor.userId
		});

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

		await BillMembersControllers.createMany(supabase, billMembers);

		// Step 3: Insert notifications
		const billMemberNotifications = payload.debtors.map((debtor) => {
			if (!debtor.userId || !debtor.amount) {
				throw new Error("Debtor is missing userId or amount");
			}

			return {
				billId: bill.id,
				userId: debtor.userId,
				triggerId: trigger.id,
				type: "BillCreated" as const
			};
		});
		const { error: notificationErrors } = await supabase.from("notifications").insert(billMemberNotifications);

		if (notificationErrors) {
			throw new Error("Error inserting notifications");
		}

		return new Response(JSON.stringify({ success: true, data: { bill } }), {
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
