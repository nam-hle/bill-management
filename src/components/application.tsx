import React from "react";

import { Toaster } from "@/components/shadcn/toaster";
import { NavigationBar } from "@/components/navigation-bar";
import { type AvatarContainer } from "@/components/avatar-container";

import { type Container } from "@/types";

export const Application: React.FC<Container & Partial<AvatarContainer.Props>> = ({ children, pendingUserInfo }) => {
	return (
		<>
			<NavigationBar pendingUserInfo={pendingUserInfo} />
			<main className="mx-auto min-h-[calc(100vh-64px)] max-w-screen-2xl px-8 py-4">{children}</main>
			<Toaster />
		</>
	);
};
