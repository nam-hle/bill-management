import { expect } from "@playwright/test";

import { test } from "@/test/setup";
import { FULL_NAMES } from "@/test/utils";
import { type Group } from "@/schemas/group.schema";
import { seedGroup, type UsersInfo } from "@/test/functions/seed-group";

let usersInfo: UsersInfo;
let group: Group;
let inviteId: string;

test.beforeEach(async () => {
	usersInfo = await seedGroup();
	group = await usersInfo.requesters.harry.groups.create.mutate({ name: "First group" });
	await usersInfo.requesters.harry.groups.invite.mutate({ groupId: group.id, userId: usersInfo.userIds.ron });

	const invites = await usersInfo.requesters.harry.groups.invites.query({ groupId: group.id });
	inviteId = invites[0].id;

	await usersInfo.requesters.ron.groups.acceptInvite.mutate({ invitationId: inviteId });

	expect(await usersInfo.requesters.harry.groups.members.query({ groupId: group.id })).toEqual([
		{ avatar: null, id: expect.any(String), fullName: FULL_NAMES.harry },
		{ avatar: null, id: expect.any(String), fullName: FULL_NAMES.ron }
	]);
});

test("Request", async () => {
	expect(await usersInfo.requesters.ron.groups.request.mutate({ groupDisplayId: group.displayId })).toEqual({
		ok: false,
		error: "User is already a member."
	});

	expect(await usersInfo.requesters.harry.groups.invites.query({ groupId: group.id })).toEqual([]);
	expect(await usersInfo.requesters.harry.groups.requests.query({ groupId: group.id })).toEqual([]);
	expect(await usersInfo.requesters.harry.groups.members.query({ groupId: group.id })).toEqual([
		{ avatar: null, id: expect.any(String), fullName: FULL_NAMES.harry },
		{ avatar: null, id: expect.any(String), fullName: FULL_NAMES.ron }
	]);
});

test("Accept the request", async () => {
	await expect(usersInfo.requesters.harry.groups.acceptRequest.mutate({ requestId: inviteId })).resolves.toEqual({
		ok: false,
		error: "User is already a member."
	});

	expect(await usersInfo.requesters.harry.groups.invites.query({ groupId: group.id })).toEqual([]);
	expect(await usersInfo.requesters.harry.groups.requests.query({ groupId: group.id })).toEqual([]);
	expect(await usersInfo.requesters.harry.groups.members.query({ groupId: group.id })).toEqual([
		{ avatar: null, id: expect.any(String), fullName: FULL_NAMES.harry },
		{ avatar: null, id: expect.any(String), fullName: FULL_NAMES.ron }
	]);
});

test("Reject the request", async () => {
	await expect(usersInfo.requesters.harry.groups.rejectRequest.mutate({ requestId: inviteId })).resolves.toEqual({
		ok: false,
		error: "User is already a member."
	});

	expect(await usersInfo.requesters.harry.groups.invites.query({ groupId: group.id })).toEqual([]);
	expect(await usersInfo.requesters.harry.groups.requests.query({ groupId: group.id })).toEqual([]);
	expect(await usersInfo.requesters.harry.groups.members.query({ groupId: group.id })).toEqual([
		{ avatar: null, id: expect.any(String), fullName: FULL_NAMES.harry },
		{ avatar: null, id: expect.any(String), fullName: FULL_NAMES.ron }
	]);
});

test("Invite ", async () => {
	expect(await usersInfo.requesters.harry.groups.invite.mutate({ groupId: group.id, userId: usersInfo.userIds.ron })).toEqual({
		ok: false,
		error: "User is already a member."
	});

	expect(await usersInfo.requesters.harry.groups.invites.query({ groupId: group.id })).toEqual([]);
	expect(await usersInfo.requesters.harry.groups.requests.query({ groupId: group.id })).toEqual([]);
	expect(await usersInfo.requesters.harry.groups.members.query({ groupId: group.id })).toEqual([
		{ avatar: null, id: expect.any(String), fullName: FULL_NAMES.harry },
		{ avatar: null, id: expect.any(String), fullName: FULL_NAMES.ron }
	]);
});

test("Accept the invitation", async () => {
	await expect(usersInfo.requesters.ron.groups.acceptInvite.mutate({ invitationId: inviteId })).resolves.toEqual({
		ok: false,
		error: "User is already a member."
	});

	expect(await usersInfo.requesters.harry.groups.invites.query({ groupId: group.id })).toEqual([]);
	expect(await usersInfo.requesters.harry.groups.requests.query({ groupId: group.id })).toEqual([]);
	expect(await usersInfo.requesters.harry.groups.members.query({ groupId: group.id })).toEqual([
		{ avatar: null, id: expect.any(String), fullName: FULL_NAMES.harry },
		{ avatar: null, id: expect.any(String), fullName: FULL_NAMES.ron }
	]);
});

test("Reject the invitation", async () => {
	await expect(usersInfo.requesters.ron.groups.rejectInvite.mutate({ invitationId: inviteId })).resolves.toEqual({
		ok: false,
		error: "User is already a member."
	});

	expect(await usersInfo.requesters.harry.groups.invites.query({ groupId: group.id })).toEqual([]);
	expect(await usersInfo.requesters.harry.groups.requests.query({ groupId: group.id })).toEqual([]);
	expect(await usersInfo.requesters.harry.groups.members.query({ groupId: group.id })).toEqual([
		{ avatar: null, id: expect.any(String), fullName: FULL_NAMES.harry },
		{ avatar: null, id: expect.any(String), fullName: FULL_NAMES.ron }
	]);
});
