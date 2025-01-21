import { type Balance, type ClientUser } from "@/types";
import { type SupabaseInstance } from "@/supabase/server";

export namespace UsersControllers {
	export async function getUsers(supabase: SupabaseInstance): Promise<ClientUser[]> {
		const { data: users } = await supabase.from("profiles").select();

		if (!users) {
			throw new Error("Error fetching users");
		}

		return users;
	}

	export async function getUserById(supabase: SupabaseInstance, id: string): Promise<ClientUser> {
		const { data } = await supabase.from("profiles").select().eq("id", id).single();

		if (!data) {
			throw new Error("Error fetching user");
		}

		return data;
	}

	export async function getBalance(supabase: SupabaseInstance, userId: string): Promise<Balance> {
		const { data: sumData } = await supabase.from("bill_members").select("amount.sum(), role").eq("userId", userId);

		const owed = sumData?.find(({ role }) => role === "Debtor")?.sum || 0;
		const paid = sumData?.find(({ role }) => role === "Creditor")?.sum || 0;

		const { data: billMembers } = await supabase.from("bill_members").select("amount, role, billId").eq("userId", userId);

		const selfPaid =
			billMembers
				?.map((billMember) => {
					if (billMember.role === "Debtor" && billMembers?.some((bm) => bm.billId === billMember.billId && bm.role === "Creditor")) {
						return billMember.amount;
					}

					return 0;
				})
				.reduce((acc, val) => acc + val, 0) ?? 0;

		return { net: paid - owed, owed: owed - selfPaid, paid: paid - selfPaid };
	}
}
