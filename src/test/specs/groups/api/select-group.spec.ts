import { expect } from "@playwright/test";

import { test } from "@/test/setup";
import { createRequester } from "@/test/helpers/requester";
import { seedBasicPreset } from "@/test/functions/seed-basic-preset";

test("Select group", async () => {
	await seedBasicPreset();
	const requester = await createRequester("harry");

	const group = await requester.groups.create.mutate({ name: "Harry's group" });

	expect(await requester.profile.selectedGroup.query()).toBeNull();

	await requester.profile.selectGroup.mutate({ groupId: group.id });
	expect(await requester.profile.selectedGroup.query()).toEqual({
		name: "Harry's group",
		id: expect.any(String),
		displayId: expect.stringMatching(/^\d{8}$/)
	});
});
