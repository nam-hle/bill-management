import { type FULL_NAMES } from "@/test/utils";
import { createRequester } from "@/test/helpers/requester";

export async function getUserIdByName(name: (typeof FULL_NAMES)[keyof typeof FULL_NAMES]) {
	const requester = await createRequester("harry");

	const users = await requester.users.get.query();
	const user = users.data.find((u) => u.fullName === name);

	if (!user) {
		throw new Error(`User with name ${name} not found`);
	}

	return user.id;
}
