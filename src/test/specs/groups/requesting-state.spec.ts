import { expect } from "@playwright/test";

import { test } from "@/test/setup";
import { FULL_NAMES } from "@/test/utils";
import { type Group } from "@/schemas/group.schema";
import { seedGroup, type UsersInfo } from "@/test/functions/seed-group";

let usersInfo: UsersInfo;
let group: Group;
let requestId: string;

test.beforeEach(async () => {
	usersInfo = await seedGroup();
	group = await usersInfo.requesters.harry.groups.create.mutate({ name: "First group" });
	await usersInfo.requesters.ron.groups.request.mutate({ groupDisplayId: group.displayId });

	const requests = await usersInfo.requesters.harry.groups.requests.query({ groupId: group.id });

	expect(requests).toEqual([
		{
			id: expect.any(String),
			user: { avatar: null, id: expect.any(String), fullName: FULL_NAMES.ron }
		}
	]);

	requestId = requests[0].id;
});

test("Request again", async () => {
	expect(await usersInfo.requesters.ron.groups.request.mutate({ groupDisplayId: group.displayId })).toEqual({
		ok: false,
		error: "User is already requested."
	});

	expect(await usersInfo.requesters.harry.groups.invites.query({ groupId: group.id })).toEqual([]);
	expect(await usersInfo.requesters.harry.groups.requests.query({ groupId: group.id })).toEqual([
		{ id: requestId, user: { avatar: null, id: expect.any(String), fullName: FULL_NAMES.ron } }
	]);
	expect(await usersInfo.requesters.harry.groups.members.query({ groupId: group.id })).toEqual([
		{ avatar: null, id: expect.any(String), fullName: FULL_NAMES.harry }
	]);
});

test("Accept the request", async () => {
	await expect(usersInfo.requesters.harry.groups.acceptRequest.mutate({ requestId })).resolves.toEqual({ ok: true });

	expect(await usersInfo.requesters.harry.groups.invites.query({ groupId: group.id })).toEqual([]);
	expect(await usersInfo.requesters.harry.groups.requests.query({ groupId: group.id })).toEqual([]);
	expect(await usersInfo.requesters.harry.groups.members.query({ groupId: group.id })).toEqual([
		{ avatar: null, id: expect.any(String), fullName: FULL_NAMES.harry },
		{ avatar: null, id: expect.any(String), fullName: FULL_NAMES.ron }
	]);
});

test("Reject the request", async () => {
	await expect(usersInfo.requesters.harry.groups.rejectRequest.mutate({ requestId })).resolves.toEqual({ ok: true });

	expect(await usersInfo.requesters.harry.groups.invites.query({ groupId: group.id })).toEqual([]);
	expect(await usersInfo.requesters.harry.groups.requests.query({ groupId: group.id })).toEqual([]);
	expect(await usersInfo.requesters.harry.groups.members.query({ groupId: group.id })).toEqual([
		{ avatar: null, id: expect.any(String), fullName: FULL_NAMES.harry }
	]);
});

test("Invite", async () => {
	expect(await usersInfo.requesters.harry.groups.invite.mutate({ groupId: group.id, userId: usersInfo.userIds.ron })).toEqual({
		ok: false,
		error: "User is already requested."
	});

	expect(await usersInfo.requesters.harry.groups.invites.query({ groupId: group.id })).toEqual([]);
	expect(await usersInfo.requesters.harry.groups.requests.query({ groupId: group.id })).toEqual([
		{ id: requestId, user: { avatar: null, id: expect.any(String), fullName: FULL_NAMES.ron } }
	]);
	expect(await usersInfo.requesters.harry.groups.members.query({ groupId: group.id })).toEqual([
		{ avatar: null, id: expect.any(String), fullName: FULL_NAMES.harry }
	]);
});

test("Accept the invitation", async () => {
	await expect(usersInfo.requesters.ron.groups.acceptInvite.mutate({ invitationId: requestId })).resolves.toEqual({
		ok: false,
		error: "User is already requested."
	});

	expect(await usersInfo.requesters.harry.groups.invites.query({ groupId: group.id })).toEqual([]);
	expect(await usersInfo.requesters.harry.groups.requests.query({ groupId: group.id })).toEqual([
		{ id: requestId, user: { avatar: null, id: expect.any(String), fullName: FULL_NAMES.ron } }
	]);
	expect(await usersInfo.requesters.harry.groups.members.query({ groupId: group.id })).toEqual([
		{ avatar: null, id: expect.any(String), fullName: FULL_NAMES.harry }
	]);
});

test("Reject the invitation", async () => {
	await expect(usersInfo.requesters.ron.groups.rejectInvite.mutate({ invitationId: requestId })).resolves.toEqual({
		ok: false,
		error: "User is already requested."
	});

	expect(await usersInfo.requesters.harry.groups.invites.query({ groupId: group.id })).toEqual([]);
	expect(await usersInfo.requesters.harry.groups.requests.query({ groupId: group.id })).toEqual([
		{ id: requestId, user: { avatar: null, id: expect.any(String), fullName: FULL_NAMES.ron } }
	]);
	expect(await usersInfo.requesters.harry.groups.members.query({ groupId: group.id })).toEqual([
		{ avatar: null, id: expect.any(String), fullName: FULL_NAMES.harry }
	]);
});
