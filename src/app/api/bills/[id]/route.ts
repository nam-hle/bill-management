import { createClient } from "@/supabase/server";
import { BillsControllers } from "@/controllers/bills.controllers";
import { BillMembersControllers } from "@/controllers/bill-members.controllers";
import { type ClientBill, ClientBillMember, type BillFormState, type BillMemberRole } from "@/types";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
	try {
		const body = await request.json();
		const billId = (await params).id;

		const payload = body as BillFormState;
		const supabase = await createClient();

		const currentBill = await BillsControllers.getBillById(supabase, billId);

		const {
			data: { user: trigger }
		} = await supabase.auth.getUser();

		if (!trigger) {
			throw new Error("User not found");
		}

		if (payload.description !== currentBill.description) {
			await BillsControllers.updateById(supabase, billId, { description: payload.description });
		}

		// Step 2: Insert bill members
		const payloadBillMembers: { userId: string; amount: number; role: BillMemberRole }[] = [];

		if (!payload.creditor?.userId || !payload.creditor.amount) {
			throw new Error("Creditor is required");
		}

		payloadBillMembers.push({
			userId: payload.creditor.userId,
			amount: payload.creditor.amount,
			role: "Creditor"
		});

		payload.debtors.forEach((debtor) => {
			if (!debtor.userId || !debtor.amount) {
				throw new Error("Debtor is missing userId or amount");
			}

			payloadBillMembers.push({
				userId: debtor.userId,
				amount: debtor.amount,
				role: "Debtor"
			});
		});

		const comparisonResult = compareBillMembers(flaten(currentBill), payloadBillMembers);

		await BillMembersControllers.updateMany(
			supabase,
			comparisonResult.updateBillMembers.map((update) => ({ billId, ...update }))
		);

		await BillMembersControllers.createMany(
			supabase,
			comparisonResult.addBillMembers.map((add) => ({ billId, ...add }))
		);

		await BillMembersControllers.deleteMany(
			supabase,
			comparisonResult.removeBillMembers.map((remove) => ({ billId, ...remove }))
		);

		// Step 3: Insert notifications
		const updateAmountNotificationRequests = comparisonResult.updateBillMembers.map((debtor) => {
			if (!debtor.userId || !debtor.amount) {
				throw new Error("Debtor is missing userId or amount");
			}

			return supabase.from("notifications").insert({
				type: "BillUpdated",
				userId: debtor.userId,
				billId,
				triggerId: trigger.id,
				metadata: { previous: { amount: debtor.previousAmount }, current: { amount: debtor.amount } }
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

function flaten(clientBill: ClientBill): Omit<ClientBillMember, "fullName">[] {
	const { creditor, debtors } = clientBill;

	return [creditor, ...debtors];
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
