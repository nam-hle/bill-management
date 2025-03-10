import { type GroupName } from "@/test/utils";
import { seedUsers } from "@/test/functions/seed-users";
import { type Group, type Membership } from "@/schemas/group.schema";

const findInvitations = (memberships: Membership[], userId: string) => memberships.find((invitation) => invitation.user.userId === userId)!;

export type BasicPreset = Awaited<ReturnType<typeof seedBasicPreset>>;

export async function seedBasicPreset() {
	try {
		const usersInfo = await seedUsers();

		// Setup Gryffindor group
		const gryffindorGroup = await usersInfo.requesters.harry.groups.create.mutate({ name: "Gryffindor" });
		await usersInfo.requesters.harry.profile.selectGroup.mutate({ groupId: gryffindorGroup.id });

		await usersInfo.requesters.harry.groups.invite.mutate({
			groupId: gryffindorGroup.id,
			userIds: [usersInfo.userIds.ron, usersInfo.userIds.hermione]
		});

		const gryffindorMemberships = await usersInfo.requesters.harry.groups.invitations.query({ groupId: gryffindorGroup.id });

		await usersInfo.requesters.ron.groups.acceptInvitation.mutate({
			invitationId: findInvitations(gryffindorMemberships, usersInfo.userIds.ron).id
		});
		await usersInfo.requesters.hermione.groups.acceptInvitation.mutate({
			invitationId: findInvitations(gryffindorMemberships, usersInfo.userIds.hermione).id
		});

		// Setup Hogwarts group
		const hogwartsGroup = await usersInfo.requesters.dumbledore.groups.create.mutate({ name: "Hogwarts" });
		await usersInfo.requesters.dumbledore.groups.invite.mutate({
			groupId: hogwartsGroup.id,
			userIds: [usersInfo.userIds.harry, usersInfo.userIds.ron, usersInfo.userIds.hermione, usersInfo.userIds.snape]
		});

		const hogwartsMemberships = await usersInfo.requesters.dumbledore.groups.invitations.query({ groupId: hogwartsGroup.id });
		await usersInfo.requesters.harry.groups.acceptInvitation.mutate({
			invitationId: findInvitations(hogwartsMemberships, usersInfo.userIds.harry).id
		});
		await usersInfo.requesters.ron.groups.acceptInvitation.mutate({
			invitationId: findInvitations(hogwartsMemberships, usersInfo.userIds.ron).id
		});
		await usersInfo.requesters.hermione.groups.acceptInvitation.mutate({
			invitationId: findInvitations(hogwartsMemberships, usersInfo.userIds.hermione).id
		});
		await usersInfo.requesters.snape.groups.acceptInvitation.mutate({
			invitationId: findInvitations(hogwartsMemberships, usersInfo.userIds.snape).id
		});

		for (const requester of Object.values(usersInfo.requesters)) {
			await requester.profile.selectGroup.mutate({ groupId: hogwartsGroup.id });
		}

		const groups: Record<GroupName, Group> = { Hogwarts: hogwartsGroup, Gryffindor: gryffindorGroup };

		return { ...usersInfo, groups };
	} catch (error) {
		console.error("Error while setup basic preset:", error);
		throw error;
	}
}
