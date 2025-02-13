import { pick } from "lodash";

import { ClientBillMember, type BillMemberRole } from "@/schemas";
import { type SupabaseInstance } from "@/services/supabase/server";
import { BillsControllers, NotificationsControllers } from "@/controllers";

export namespace BillMembersControllers {
	export interface CreatePayload {
		readonly billId: string;
		readonly userId: string;
		readonly amount: number;
		readonly role: BillMemberRole;
	}
	export async function createMany(supabase: SupabaseInstance, triggerId: string, payloads: CreatePayload[]) {
		await supabase
			.from("bill_members")
			.insert(payloads.map(({ billId: bill_id, userId: user_id, ...payload }) => ({ ...payload, bill_id, user_id })));

		await NotificationsControllers.createManyBillCreated(
			supabase,
			payloads.map((payload) => ({ ...payload, triggerId }))
		);
	}

	export interface UpdateMemberPayload {
		readonly userId: string;
		readonly amount: number;
		readonly role: BillMemberRole;
	}

	export interface UpdatePayload {
		readonly billId: string;
		readonly members: UpdateMemberPayload[];
	}
	export async function updateMany(supabase: SupabaseInstance, triggerId: string, payload: UpdatePayload) {
		const { billId, members } = payload;

		const bill = await BillsControllers.getById(supabase, billId);
		const currentMembers = [bill.creditor, ...bill.debtors].map((member) => pick(member, ["userId", "amount", "role"]));

		const comparisonResult = diffMembers(currentMembers, members);

		await updateManyAmount(
			supabase,
			triggerId,
			comparisonResult.updateBillMembers.map((update) => ({ billId, ...update }))
		);

		await createMany(
			supabase,
			triggerId,
			comparisonResult.addBillMembers.map((add) => ({ billId, ...add }))
		);

		await deleteMany(
			supabase,
			triggerId,
			comparisonResult.removeBillMembers.map(({ amount, ...remove }) => ({ billId, ...remove }))
		);
	}

	function diffMembers(currentBillMembers: UpdateMemberPayload[], payloadBillMembers: UpdateMemberPayload[]) {
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

	export interface UpdateAmountPayload {
		readonly billId: string;
		readonly userId: string;
		readonly amount: number;
		readonly role: BillMemberRole;
		readonly previousAmount: number;
	}
	export async function updateManyAmount(supabase: SupabaseInstance, triggerId: string, payloads: UpdateAmountPayload[]) {
		const updatePromises = payloads.map(({ role, amount, userId, billId }) =>
			supabase.from("bill_members").update({ amount }).match({ role, user_id: userId, bill_id: billId }).select()
		);

		const results = await Promise.all(updatePromises);

		const errors = results.filter((result) => result.error);

		if (errors.length > 0) {
			throw new Error("Error updating bill members");
		}

		await NotificationsControllers.createManyBillUpdated(
			supabase,
			payloads.map(({ role, previousAmount, amount: currentAmount, ...payload }) => {
				return { ...payload, triggerId, currentAmount, previousAmount };
			})
		);
	}

	export interface DeletedPayload {
		readonly billId: string;
		readonly userId: string;
		readonly role: BillMemberRole;
	}

	export async function deleteMany(supabase: SupabaseInstance, triggerId: string, payloads: DeletedPayload[]) {
		const deletePromises = payloads.map(({ role, userId: user_id, billId: bill_id }) =>
			supabase.from("bill_members").delete().match({ role, bill_id, user_id })
		);

		const results = await Promise.all(deletePromises);

		const errors = results.filter((result) => result.error);

		if (errors.length > 0) {
			throw new Error("Error deleting bill members");
		}

		await NotificationsControllers.createManyBillDeleted(
			supabase,
			payloads.map((payload) => ({ ...payload, triggerId }))
		);
	}

	const SELECT = `userId:user_id, role, amount, profiles (username)`;

	export async function getAll(supabase: SupabaseInstance) {
		const { data } = await supabase.from("bill_members").select(SELECT);

		if (!data) {
			throw new Error("Error getting bill members");
		}

		return data;
	}
}
