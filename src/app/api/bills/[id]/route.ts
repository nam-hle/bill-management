import { API } from "@/api";
import { RouteUtils } from "@/route.utils";
import { ClientBillSchema } from "@/schemas";
import { BillsControllers, BillMembersControllers } from "@/controllers";
import { getCurrentUser, createSupabaseServer } from "@/services/supabase/server";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
	try {
		const billId = (await params).id;
		const supabase = await createSupabaseServer();

		const bill = await BillsControllers.getById(supabase, billId);

		return RouteUtils.createResponse(ClientBillSchema, bill);
	} catch (error) {
		return RouteUtils.ServerError;
	}
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
	try {
		const billId = (await params).id;

		const body = await RouteUtils.parseRequestBody(request, API.Bills.UpsertBillSchema);

		if (body.error) {
			return RouteUtils.BadRequest;
		}

		const supabase = await createSupabaseServer();
		const updater = await getCurrentUser();

		const { debtors, issuedAt, creditor, description, receiptFile } = body.data;

		// Members need to be updated first
		await BillMembersControllers.updateMany(supabase, updater.id, {
			billId,
			members: [{ ...creditor, role: "Creditor" }, ...debtors.map((debtor) => ({ ...debtor, role: "Debtor" as const }))]
		});

		await BillsControllers.updateById(supabase, billId, { issuedAt, receiptFile, description, updaterId: updater.id });

		return new Response(JSON.stringify({ success: true, data: { billId } }), { status: 201 });
	} catch (error) {
		return RouteUtils.ServerError;
	}
}
