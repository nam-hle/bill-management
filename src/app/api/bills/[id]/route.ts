import { BillFormPayloadSchema } from "@/types";
import { BillsControllers } from "@/controllers/bills.controllers";
import { getCurrentUser, createSupabaseServer } from "@/supabase/server";
import { BillMembersControllers } from "@/controllers/bill-members.controllers";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
	try {
		const billId = (await params).id;
		const body = await request.json();

		const parsedBody = BillFormPayloadSchema.safeParse(body);

		if (parsedBody.error) {
			return new Response(JSON.stringify({ error: "Invalid request body", details: parsedBody.error.errors }), {
				status: 400
			});
		}

		const supabase = await createSupabaseServer();

		const updater = await getCurrentUser();

		if (!updater) {
			throw new Error("User not found");
		}

		const { debtors, issuedAt, creditor, description } = parsedBody.data;

		// Members need to be updated first
		await BillMembersControllers.updateMany(supabase, updater.id, {
			billId,
			members: [{ ...creditor, role: "Creditor" }, ...debtors.map((debtor) => ({ ...debtor, role: "Debtor" as const }))]
		});

		await BillsControllers.updateById(supabase, billId, { issuedAt, description, updaterId: updater.id });

		return new Response(JSON.stringify({ success: true, data: { billId } }), { status: 201 });
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
