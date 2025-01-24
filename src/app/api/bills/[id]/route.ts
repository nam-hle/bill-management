import { createClient } from "@/supabase/server";
import { BillsControllers } from "@/controllers/bills.controllers";
import { BillMembersControllers } from "@/controllers/bill-members.controllers";
import { type ClientBill, ClientBillMember, type BillMemberRole, BillFormPayloadSchema } from "@/types";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
	try {
		const body = await request.json();
		const billId = (await params).id;

		const parsedBody = BillFormPayloadSchema.safeParse(body);

		if (parsedBody.error) {
			return new Response(JSON.stringify({ error: "Invalid request body", details: parsedBody.error.errors }), {
				status: 400
			});
		}

		const { debtors, issuedAt, creditor, description } = parsedBody.data;
		const supabase = await createClient();

		const currentBill = await BillsControllers.getById(supabase, billId);

		const {
			data: { user: updater }
		} = await supabase.auth.getUser();

		if (!updater) {
			throw new Error("User not found");
		}

		await BillsControllers.updateById(supabase, billId, { issuedAt, description, updaterId: updater.id });

		// Step 2: Insert bill members
		const payloadBillMembers: { userId: string; amount: number; role: BillMemberRole }[] = [];

		payloadBillMembers.push({
			role: "Creditor",
			userId: creditor.userId,
			amount: creditor.amount
		});

		debtors.forEach(({ userId, amount }) => {
			payloadBillMembers.push({ userId, amount, role: "Debtor" });
		});

		const comparisonResult = compareBillMembers(flatten(currentBill), payloadBillMembers);
		console.log(comparisonResult);
		await BillMembersControllers.updateMany(
			supabase,
			comparisonResult.updateBillMembers.map((update) => ({ billId, ...update }))
		);

		await BillMembersControllers.createMany(
			supabase,
			updater.id,
			comparisonResult.addBillMembers.map((add) => ({ billId, ...add }))
		);

		await BillMembersControllers.deleteMany(
			supabase,
			updater.id,
			comparisonResult.removeBillMembers.map(({ amount, ...remove }) => ({ billId, ...remove }))
		);

		// Step 3: Insert notifications
		const updateAmountNotificationRequests = comparisonResult.updateBillMembers.map((debtor) => {
			return supabase.from("notifications").insert({
				billId,
				type: "BillUpdated",
				userId: debtor.userId,
				triggerId: updater.id,
				metadata: { current: { amount: debtor.amount }, previous: { amount: debtor.previousAmount } }
			});
		});

		const updateAmountNotificationResponses = await Promise.all(updateAmountNotificationRequests);

		if (updateAmountNotificationResponses.some((response) => response.error)) {
			throw new Error("Error inserting notifications");
		}

		return new Response(JSON.stringify({ success: true, data: { billId } }), {
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

function flatten(clientBill: ClientBill): Omit<ClientBillMember, "fullName">[] {
	const { debtors, creditor } = clientBill;

	return [creditor, ...debtors].map(({ fullName, ...member }) => member);
}

function compareBillMembers(currentBillMembers: Omit<ClientBillMember, "fullName">[], payloadBillMembers: Omit<ClientBillMember, "fullName">[]) {
	const addBillMembers = payloadBillMembers.filter((payloadBillMember) => {
		return !currentBillMembers.some((currentBillMember) => ClientBillMember.isEqual(currentBillMember, payloadBillMember));
	});

	const removeBillMembers = currentBillMembers.filter((currentBillMember) => {
		return !payloadBillMembers.some((payloadBillMember) => ClientBillMember.isEqual(currentBillMember, payloadBillMember));
	});

	const updateBillMembers = payloadBillMembers.flatMap((payloadBillMember) => {
		const member = currentBillMembers.find(
			(currentBillMember) => ClientBillMember.isEqual(currentBillMember, payloadBillMember) && currentBillMember.amount !== payloadBillMember.amount
		);

		if (!member) {
			return [];
		}

		return { ...payloadBillMember, previousAmount: member.amount };
	});

	return { addBillMembers, removeBillMembers, updateBillMembers };
}
