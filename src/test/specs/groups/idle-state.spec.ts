import { expect } from "@playwright/test";

import { test } from "@/test/setup";
import { FULL_NAMES } from "@/test/utils";
import { type Group } from "@/schemas/group.schema";
import { seedGroup, type UsersInfo } from "@/test/functions/seed-group";

let usersInfo: UsersInfo;
let group: Group;

test.beforeEach(async () => {
	usersInfo = await seedGroup();
	group = await usersInfo.requesters.harry.groups.create.mutate({ name: "First group" });
});

test("Request to non-existing group", async () => {
	await expect(usersInfo.requesters.ron.groups.request.mutate({ groupDisplayId: "12345678" })).resolves.toEqual({
		ok: false,
		error: "Group not found"
	});
});

test("Request to existing group", async () => {
	expect(await usersInfo.requesters.ron.groups.request.mutate({ groupDisplayId: group.displayId })).toEqual({ ok: true });

	expect(await usersInfo.requesters.harry.groups.requests.query({ groupId: group.id })).toEqual([
		{
			id: expect.any(String),
			user: { avatar: null, id: expect.any(String), fullName: FULL_NAMES.ron }
		}
	]);

	expect(await usersInfo.requesters.harry.groups.members.query({ groupId: group.id })).toEqual([
		{ avatar: null, id: expect.any(String), fullName: FULL_NAMES.harry }
	]);
});

test("Invite", async () => {
	expect(await usersInfo.requesters.harry.groups.invite.mutate({ groupId: group.id, userId: usersInfo.userIds.ron })).toEqual({ ok: true });

	expect(await usersInfo.requesters.harry.groups.invites.query({ groupId: group.id })).toEqual([
		{
			id: expect.any(String),
			user: { avatar: null, id: expect.any(String), fullName: FULL_NAMES.ron }
		}
	]);
	expect(await usersInfo.requesters.harry.groups.requests.query({ groupId: group.id })).toEqual([]);
	expect(await usersInfo.requesters.harry.groups.members.query({ groupId: group.id })).toEqual([
		{ avatar: null, id: expect.any(String), fullName: FULL_NAMES.harry }
	]);
});
