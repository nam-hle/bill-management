import React from "react";
import { Box } from "@chakra-ui/react";

import { type Container } from "@/types";
import { Toaster } from "@/components/ui/toaster";
import { NavigationBar } from "@/components/app/navigation-bar";
import { type AvatarContainer } from "@/components/app/avatar-container";

export const Application: React.FC<Container & AvatarContainer.Props> = ({ userInfo, children }) => {
	return (
		<>
			<Toaster />
			<NavigationBar userInfo={userInfo} />
			<Box as="main" marginInline="auto" maxWidth="{sizes.8xl}" paddingBlock="{spacing.4}" paddingInline="{spacing.8}" minHeight="calc(100vh - 64px)">
				{children}
			</Box>
		</>
	);
};
