import { type BillMemberRole } from "@/types";
import { type SupabaseInstance } from "@/supabase/server";

export namespace BillMembersControllers {
	export async function createMany(supabase: SupabaseInstance, payload: { billId: string; userId: string; amount: number; role: BillMemberRole }[]) {
		const { data } = await supabase.from("bill_members").insert(payload);

		if (!data) {
			throw new Error("Error creating bill members");
		}

		return data;
	}
}
