import { seedUser } from "@/test/functions/seed-user";
import { USERNAMES, FULL_NAMES, type UserKey } from "@/test/utils";

export async function seedGroup() {
	const userIds: Record<string, string> = {};

	for (const username of Object.keys(USERNAMES) as UserKey[]) {
		userIds[username] = await seedUser({ email: USERNAMES[username], fullName: FULL_NAMES[username] });
	}

	return userIds as Record<UserKey, string>;
}
