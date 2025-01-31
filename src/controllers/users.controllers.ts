import { type SupabaseInstance } from "@/supabase/server";
import { type Balance, type UserInfo, type ClientUser, type ProfileFormPayload } from "@/types";

export namespace UsersControllers {
	const USERS_SELECT = `
    id,
    username,
    fullName:full_name,
    avatarUrl:avatar_url
  `;

	interface UpdateProfilePayload extends ProfileFormPayload {}
	export async function updateProfile(supabase: SupabaseInstance, userId: string, payload: UpdateProfilePayload) {
		const { data, error } = await supabase
			.from("profiles")
			.update({ full_name: payload.fullName, avatar_url: payload.avatarUrl })
			.eq("id", userId)
			.select(USERS_SELECT)
			.single();

		if (error) {
			throw error;
		}

		if (!data) {
			throw new Error("Error updating profile");
		}

		return data;
	}

	export async function getUsers(supabase: SupabaseInstance): Promise<ClientUser[]> {
		const { data: users } = await supabase.from("profiles").select(USERS_SELECT);

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

	export async function getUserInfo(supabase: SupabaseInstance, userId: string): Promise<UserInfo> {
		const { error, data: profile } = await supabase.from("profiles").select(`fullName:full_name, avatar_url`).eq("id", userId).single();

		if (error || !profile) {
			throw new Error(error?.message || "Profile not found");
		}

		let avatarUrl: string | undefined;

		if (profile.avatar_url) {
			const { data } = supabase.storage.from("avatars").getPublicUrl(profile.avatar_url);
			avatarUrl = data.publicUrl;
		}

		return { avatarUrl, fullName: profile.fullName ?? "" };
	}
}
