"use client";

import React from "react";
import Link from "next/link";

import { Frame } from "@/components/tabs";
import { Button } from "@/components/shadcn/button";
import { AvatarContainer } from "@/components/avatar-container";
import { ThemeToggleButton } from "@/components/theme-toggle-button";
import { NotificationContainer } from "@/components/notification-container";

export const NavigationBar: React.FC<Partial<AvatarContainer.Props>> = ({ pendingUserInfo }) => {
	return (
		<header className="mx-auto flex max-w-screen-2xl items-center justify-between px-8 py-2">
			<div className="flex min-h-[48px] items-center gap-2">
				{pendingUserInfo && <Frame />}
				<Button asChild size="sm" variant="default">
					<Link href="/bills/new">Create</Link>
				</Button>
			</div>
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
