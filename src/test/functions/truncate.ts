import { supabaseTest } from "@/test/setup";

const PUBLIC_TABLES = ["bills", "transactions", "bill_members", "bank_accounts", "profiles", "notifications"] as const;

export async function truncate() {
	try {
		for (const table of PUBLIC_TABLES) {
			const { error } = await supabaseTest.from(table).delete().neq("id", "00000000-0000-0000-0000-000000000000");

			if (error) {
				console.error(`Error truncating ${table}:`, error);
			}
		}

		const {
			data: { users }
		} = await supabaseTest.auth.admin.listUsers();

		for (const user of users ?? []) {
			await supabaseTest.auth.admin.deleteUser(user.id);
		}
	} catch (error) {
		console.error("Unexpected error truncating schemas:", error);
		throw error;
	}
}
