import React from "react";

import { type Container } from "@/types";
import { Toaster } from "@/chakra/toaster";
import { NavigationBar } from "@/components/navigation-bar";
import { type AvatarContainer } from "@/components/avatar-container";

export const Application: React.FC<Container & AvatarContainer.Props> = ({ userInfo, children }) => {
	return (
		<>
			<Toaster />
			<NavigationBar userInfo={userInfo} />
			<main className="mx-auto max-w-8xl py-4 px-8 min-h-[calc(100vh-64px)]">{children}</main>
		</>
	);
};
