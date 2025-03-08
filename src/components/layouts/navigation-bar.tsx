"use client";

import React from "react";

import { Tabs } from "@/components/layouts/tabs";
import { GroupSwitcher } from "@/components/layouts/group-switcher";
import { AvatarContainer } from "@/components/avatars/avatar-container";
import { ThemeToggleButton } from "@/components/buttons/theme-toggle-button";
import { NotificationContainer } from "@/components/layouts/notification-container";

export const NavigationBar: React.FC<Partial<AvatarContainer.Props>> = ({ pendingUserInfo }) => {
	return (
		<header className="mx-auto flex max-w-screen-2xl items-center justify-between px-8 py-2">
			<div className="flex min-h-[48px] items-center gap-2">{pendingUserInfo && <Tabs />}</div>
			<div className="flex min-h-[48px] items-center gap-2">
				{pendingUserInfo && <GroupSwitcher />}
				<ThemeToggleButton />
				{pendingUserInfo && (
					<>
						<NotificationContainer />
						<AvatarContainer pendingUserInfo={pendingUserInfo} />
					</>
				)}
			</div>
		</header>
	);
};
