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

	export async function report(supabase: SupabaseInstance, userId: string): Promise<Balance> {
		const { data, error } = await supabase.rpc("report", { target_user_id: userId }).single();

		if (error) {
			throw error;
		}

		const { owed, paid, sent, received, self_paid } = data;

		return { sent, received, owed: owed - self_paid, paid: paid - self_paid, net: paid - owed + received - sent };
	}
}
