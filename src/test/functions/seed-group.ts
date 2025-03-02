import { seedUser } from "@/test/functions/seed-user";
import { USERNAMES, FULL_NAMES, type FullName, type UserName } from "@/test/utils";

export async function seedGroup() {
	const userIds: Record<string, string> = {};
	const userNames: Record<string, string> = {};

	for (const username of Object.values(USERNAMES)) {
		userIds[username] = await seedUser({ email: username, fullName: FULL_NAMES[username] });
		userNames[FULL_NAMES[username]] = userIds[username];
	}

	return { userIds: userIds as Record<UserName, string>, userNames: userNames as Record<FullName, string> };
}
