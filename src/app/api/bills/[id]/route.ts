import _ from "lodash";

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

		if (payload.description !== currentBill.description) {
			await BillsControllers.updateById(supabase, billId, { description: payload.description });
		}

		// Step 2: Insert bill members
		const payloadBillMembers: ClientBillMember[] = [];

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

		const comparisonResult = compareBillMembers(currentBill.bill_members, payloadBillMembers);

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
		const billMemberNotifications = _.uniqBy(
			comparisonResult.updateBillMembers.map((debtor) => {
				if (!debtor.userId || !debtor.amount) {
					throw new Error("Debtor is missing userId or amount");
				}

				return {
					type: "BillUpdated" as const,
					userId: debtor.userId,
					billId
				};
			}),
			(noti: { userId: string; billId: string }) => {
				return `${noti.billId}.${noti.userId}`;
			}
		);

		console.log(billMemberNotifications);
		const { error: notificationErrors } = await supabase.from("notifications").insert(billMemberNotifications);

		if (notificationErrors) {
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

	const updateBillMembers = payloadBillMembers.filter((payloadBillMember) => {
		return currentBillMembers.some((currentBillMember) => ClientBillMember.isEqual(currentBillMember, payloadBillMember));
	});

	return { addBillMembers, removeBillMembers, updateBillMembers };
}
