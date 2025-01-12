import { type ClientUser } from "@/types";
import { type SupabaseInstance } from "@/supabase/server";

export namespace UsersControllers {
	export async function createUser(supabase: SupabaseInstance, payload: { username: string }) {
		const { data } = await supabase.from("users").insert(payload).select("id").single();

		if (!data) {
			throw new Error("Error creating user");
		}

		return data;
	}

	export async function getUsers(supabase: SupabaseInstance): Promise<ClientUser[]> {
		const { data: users } = await supabase.from("users").select();

		if (!users) {
			throw new Error("Error fetching users");
		}

		return users;
	}

	export async function getUserById(supabase: SupabaseInstance, id: string): Promise<ClientUser> {
		const { data } = await supabase.from("users").select().eq("id", id).single();

		if (!data) {
			throw new Error("Error fetching user");
		}

		return data;
	}
}
