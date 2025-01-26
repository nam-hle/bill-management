import { BillsControllers } from "@/controllers/bills.controllers";
import { type BillMemberRole, BillFormPayloadSchema } from "@/types";
import { getCurrentUser, createSupabaseServer } from "@/supabase/server";
import { BillMembersControllers } from "@/controllers/bill-members.controllers";

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const supabase = await createSupabaseServer();

		const parsedBody = BillFormPayloadSchema.safeParse(body);

		if (parsedBody.error) {
			return new Response(JSON.stringify({ error: "Invalid request body", details: parsedBody.error.errors }), {
				status: 400
			});
		}

		const { debtors, issuedAt, creditor, description } = parsedBody.data;
		const creator = await getCurrentUser();

		// Step 1: Insert bill
		const bill = await BillsControllers.create(supabase, {
			issuedAt,
			description,
			creatorId: creator.id
		});

		// Step 2: Insert bill members
		const billMembers = debtors.map(({ userId, amount }) => {
			return {
				userId,
				amount,
				billId: bill.id,
				role: "Debtor" as BillMemberRole
			};
		});

		billMembers.push({
			billId: bill.id,
			userId: creditor.userId,
			amount: creditor.amount,
			role: "Creditor" as BillMemberRole
		});

		await BillMembersControllers.createMany(supabase, creator.id, billMembers);

		return new Response(JSON.stringify({ success: true, data: { bill } }), {
			status: 201
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
