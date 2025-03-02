import { wait } from "@/utils";
import { type Balance, type UserInfo } from "@/types";
import { GroupController } from "@/controllers/group.controller";
import { type SupabaseInstance } from "@/services/supabase/server";
import { type ClientUser, type ProfileFormPayload } from "@/schemas";
import { type Group, MembershipStatusSchema } from "@/schemas/group.schema";

export namespace UsersControllers {
	export const USERS_SELECT = `
    id,
    fullName:full_name,
    avatar:avatar_url
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

	export async function reportUsingView(supabase: SupabaseInstance, userId: string): Promise<Balance> {
		const { data, error } = await supabase.from("user_financial_summary").select("*").eq("user_id", userId).single();

		if (error) {
			throw error;
		}

		return {
			paid: data.paid ?? 0,
			sent: data.sent ?? 0,
			owed: data.owed ?? 0,
			net: data.balance ?? 0,
			received: data.received ?? 0
		};
	}

	export async function getUserInfo(supabase: SupabaseInstance, userId: string): Promise<UserInfo> {
		const { error, data: profile } = await supabase.from("profiles").select(`fullName:full_name, avatar_url`).eq("id", userId).single();

		if (error || !profile) {
			throw new Error(error?.message || "Profile not found");
		}

		const { data: user, error: userError } = await supabase.auth.getUser();

		if (userError || !user) {
			throw new Error(userError?.message || "User not found");
		}

		await wait(2000);

		const email = user.user?.email;

		if (!email) {
			throw new Error("Email not found");
		}

		let avatarUrl: string | undefined;

		if (profile.avatar_url) {
			const { data } = supabase.storage.from("avatars").getPublicUrl(profile.avatar_url);
			avatarUrl = data.publicUrl;
		}

		return { email, avatarUrl, fullName: profile.fullName ?? "" };
	}

	export async function getGroups(supabase: SupabaseInstance, payload: { userId: string }): Promise<Group[]> {
		const { data, error } = await supabase
			.from("memberships")
			.select(GroupController.MEMBERSHIP_SELECT)
			.eq("user_id", payload.userId)
			.eq("status", MembershipStatusSchema.enum.Active)
			.order("created_at", { ascending: true });

		if (error) {
			throw error;
		}

		return data.map(({ group }) => group);
	}

	export async function selectGroup(
		supabase: SupabaseInstance,
		payload: {
			userId: string;
			groupId: string;
		}
	): Promise<void> {
		const { error } = await supabase.from("profiles").update({ selected_group_id: payload.groupId }).eq("id", payload.userId);

		if (error) {
			throw error;
		}
	}

	export async function getSelectedGroup(supabase: SupabaseInstance, userId: string): Promise<Group | null> {
		const { data, error } = await supabase
			.from("profiles")
			.select(`group:groups!selected_group_id (${GroupController.GROUP_SELECT})`)
			.eq("id", userId)
			.single();

		if (error) {
			throw error;
		}

		return data.group;
	}

	export async function findByName(supabase: SupabaseInstance, payload: { textSearch: string }) {
		const { data, count } = await supabase
			.from("profiles")
			.select(USERS_SELECT, { count: "exact" })
			.filter("full_name", "fts", `${payload.textSearch}:*`);

		return { data: data ?? [], fullSize: count ?? 0 };
	}
}
