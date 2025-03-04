import { supabaseTest } from "@/test/setup";
import { type TableName } from "@/controllers/utils";

const PUBLIC_TABLES = [
	"bills",
	"transactions",
	"bill_debtors",
	"bank_accounts",
	"memberships",
	"groups",
	"profiles",
	"notifications"
] satisfies TableName[];

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
