import { supabaseTest } from "@/test/db.config";

export async function createTestUser(): Promise<string> {
	console.log("Creating test user...");

	const { data, error } = await supabaseTest.auth.admin.createUser({
		password: "123456",
		email_confirm: true,
		email: "harry@example.com"
	});

	if (error) {
		throw error;
	}

	if (!data) {
		throw new Error("Can not get user data");
	}

	return data.user.id;
}

export async function deleteUser(userId: string) {
	const { error } = await supabaseTest.auth.admin.deleteUser(userId);

	if (error) {
		console.error("Error deleting user:", error.message);
	} else {
		console.log("User deleted successfully");
	}
}
