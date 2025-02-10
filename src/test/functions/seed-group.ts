import { seedUser } from "@/test/functions/seed-user";
import { USERNAMES, FULL_NAMES, type USER_KEY } from "@/test/constants";

export async function seedGroup() {
	for (const key of Object.keys(USERNAMES) as USER_KEY[]) {
		await seedUser({ email: USERNAMES[key], fullName: FULL_NAMES[key] });
	}
}
