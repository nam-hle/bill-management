import React from "react";
import { Box } from "@chakra-ui/react";

import { type Container } from "@/types";
import { Toaster } from "@/chakra/toaster";
import { NavigationBar } from "@/components/navigation-bar";
import { type AvatarContainer } from "@/components/avatar-container";

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
