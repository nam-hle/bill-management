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
		const { data } = await supabase.from("bill_members").select("amount, role").eq("userId", userId);

		if (!data) {
			throw new Error("Error fetching balance");
		}

		return data.reduce(
			(result, billMember) => {
				if (billMember.role === "Creditor") {
					result.net += billMember.amount;
					result.paid += billMember.amount;
				} else if (billMember.role === "Debtor") {
					result.net -= billMember.amount;
					result.owed += billMember.amount;
				} else {
					throw new Error("Invalid role");
				}

				return result;
			},
			{ net: 0, paid: 0, owed: 0 }
		);
	}
}
