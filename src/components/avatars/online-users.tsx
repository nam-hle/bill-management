"use client";

import { AvatarGroup } from "@/components/avatars/avatar-group";

import { trpc } from "@/services";

export function OnlineAvatarGroup() {
	const { data: users } = trpc.groups.members.useQuery();
	const onlineUsers = users?.filter((user) => true) ?? [];

	return <AvatarGroup online max={3} users={onlineUsers} />;
}
