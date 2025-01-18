import { createClient } from "@/supabase/server";
import { ClientBillMember, type BillFormState } from "@/types";
import { BillsControllers } from "@/controllers/bills.controllers";
import { BillMembersControllers } from "@/controllers/bill-members.controllers";

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
		const payloadBillMembers: ClientBillMember[] = [];

		if (!payload.creditor?.userId || !payload.creditor.amount) {
			throw new Error("Creditor is required");
		}

		payloadBillMembers.push({
			user: { id: payload.creditor.userId, fullName: null, username: null },
			amount: payload.creditor.amount,
			role: "Creditor"
		});

		payload.debtors.forEach((debtor) => {
			if (!debtor.userId || !debtor.amount) {
				throw new Error("Debtor is missing userId or amount");
			}

			payloadBillMembers.push({
				user: { id: debtor.userId, fullName: null, username: null },
				amount: debtor.amount,
				role: "Debtor"
			});
		});

		const comparisonResult = compareBillMembers(currentBill.bill_members, payloadBillMembers);

		await BillMembersControllers.updateMany(
			supabase,
			comparisonResult.updateBillMembers.map((update) => ({ billId, userId: update.user.id, ...update }))
		);

		await BillMembersControllers.createMany(
			supabase,
			comparisonResult.addBillMembers.map((add) => ({ billId, userId: add.user.id, ...add }))
		);

		await BillMembersControllers.deleteMany(
			supabase,
			comparisonResult.removeBillMembers.map((remove) => ({ billId, userId: remove.user.id, ...remove }))
		);

		// Step 3: Insert notifications
		const updateAmountNotificationRequests = comparisonResult.updateBillMembers.map((debtor) => {
			if (!debtor.user.id || !debtor.amount) {
				throw new Error("Debtor is missing userId or amount");
			}

			return supabase.from("notifications").insert({
				type: "BillUpdated",
				userId: debtor.user.id,
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

function compareBillMembers(currentBillMembers: ClientBillMember[], payloadBillMembers: ClientBillMember[]) {
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
