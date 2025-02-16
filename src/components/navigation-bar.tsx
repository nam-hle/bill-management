"use client";

import React from "react";

import { Frame } from "@/components/tabs";
import { AvatarContainer } from "@/components/avatar-container";
import { ThemeToggleButton } from "@/components/theme-toggle-button";
import { NotificationContainer } from "@/components/notification-container";

export const NavigationBar: React.FC<Partial<AvatarContainer.Props>> = ({ pendingUserInfo }) => {
	return (
		<header className="mx-auto flex max-w-screen-2xl items-center justify-between px-8 py-2">
			<div className="flex min-h-[48px] items-center gap-2">{pendingUserInfo && <Frame />}</div>
			<div className="flex min-h-[48px] items-center gap-2">
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
