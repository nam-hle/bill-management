import { supabaseTest } from "@/test/setup";
import { DEFAULT_PASSWORD } from "@/test/constants";

export async function seedUser(params: { email: string; fullName?: string; password?: string }): Promise<string> {
	const { email, fullName, password = DEFAULT_PASSWORD } = params;
	const fullEmail = `${email}@example.com`;
	console.log(`Creating user ${fullEmail} (${fullName})...`);

	const { data, error } = await supabaseTest.auth.admin.createUser({
		password,
		email: fullEmail,
		email_confirm: true
	});

	if (error) {
		throw error;
	}

	if (!data) {
		throw new Error("Can not get user data");
	}

	if (fullName) {
		await supabaseTest.from("profiles").update({ full_name: fullName }).eq("id", data.user.id).single();
	}

	return data.user.id;
}
