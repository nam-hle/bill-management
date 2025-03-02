import { expect } from "@playwright/test";

import { test } from "@/test/setup";
import { FULL_NAMES } from "@/test/utils";
import { seedGroup } from "@/test/functions/seed-group";
import { createRequester } from "@/test/helpers/requester";

test("Request", async () => {
	await seedGroup();
	const harryRequester = await createRequester("harry");

	const group = await harryRequester.groups.create.mutate({ name: "First group" });

	const ronRequester = await createRequester("ron");

	await test.step("Join existing group again", async () => {
		await expect(ronRequester.groups.request.mutate({ groupDisplayId: group.displayId })).resolves.toEqual({
			ok: false,
			error: "User is already a member."
		});
	});

	// await test.step("Harry approves Ron's request", async () => {
	// 	const requests = await harryRequester.groups.requests.query({ groupId: group.id });
	//
	// 	expect(requests).toEqual([
	// 		{ status: MembershipStateSchema.enum.Inviting, user: { avatar: null, id: expect.any(String), fullName: FULL_NAMES.RON } }
	// 	]);
	//
	// 	// expect(await harryRequester.groups.members.query({ groupId: group.id })).toEqual([
	// 	// 	{ avatar: null, id: expect.any(String), fullName: FULL_NAMES.HARRY },
	// 	// 	{ avatar: null, id: expect.any(String), fullName: FULL_NAMES.RON }
	// 	// ]);
	// });

	// await test.step.skip("Hermione is rejected to join", async () => {
	// 	const hermioneRequester = await createRequester("hermione");
	//
	// 	await hermioneRequester.groups.request.mutate({ groupDisplayId: group.displayId });
	// 	// await hermioneRequester.groups.rejectRequest.mutate({ groupId: group.id, pendingUserId: userIds.HERMIONE });
	// 	const memberships = await harryRequester.groups.memberships.query({ groupId: group.id });
	//
	// 	expect(memberships).toEqual([
	// 		{ status: MembershipStateSchema.enum.Approved, user: { avatar: null, id: expect.any(String), fullName: FULL_NAMES.RON } },
	// 		{ status: MembershipStateSchema.enum.Rejected, user: { avatar: null, id: expect.any(String), fullName: FULL_NAMES.HERMIONE } }
	// 	]);
	//
	// 	expect(await harryRequester.groups.members.query({ groupId: group.id })).toEqual([
	// 		{ avatar: null, id: expect.any(String), fullName: FULL_NAMES.HARRY },
	// 		{ avatar: null, id: expect.any(String), fullName: FULL_NAMES.RON }
	// 	]);
	// });
});

test("Invite to group", async () => {
	await seedGroup();
	const ronRequester = await createRequester("ron");

	const searchResult = await ronRequester.users.findByName.query({ textSearch: "h" });

	expect(searchResult).toEqual({
		fullSize: 2,
		data: [
			{ avatar: null, id: expect.any(String), fullName: FULL_NAMES.harry },
			{ avatar: null, id: expect.any(String), fullName: FULL_NAMES.hermione }
		]
	});
});
