"use client";

import React from "react";
import { usePathname } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { Box, Stack, HStack } from "@chakra-ui/react";

import { type Container } from "@/types";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/app/link-button";
import { AvatarContainer } from "@/components/app/avatar-container";
import { NotificationContainer } from "@/components/app/notification-container";

export const RootContainer: React.FC<Container & { user: User | null }> = (props) => {
	const { user, children } = props;
	const pathname = usePathname();
	const pageName = pathname.split("/")[1];

	return (
		<>
			<HStack
				as="header"
				marginInline="auto"
				maxWidth="{sizes.8xl}"
				paddingBlock="{spacing.2}"
				paddingInline="{spacing.8}"
				justifyContent="space-between">
				<Stack direction="row" minHeight="48px" gap="{spacing.2}" alignItems="center">
					{user && (
						<>
							<LinkButton href="/" active={pageName === ""}>
								Home
							</LinkButton>
							<LinkButton href="/bills" active={pageName === "bills"}>
								Bills
							</LinkButton>
						</>
					)}
				</Stack>
				<Stack direction="row" minHeight="48px" gap="{spacing.2}" alignItems="center">
					{user && (
						<>
							<form method="post" action="/auth/signout">
								<Button type="submit" variant="subtle">
									Sign out
								</Button>
							</form>
							<NotificationContainer />
							<AvatarContainer user={user} />
						</>
					)}
				</Stack>
			</HStack>
			<Box as="main" marginInline="auto" maxWidth="{sizes.8xl}" paddingTop="{spacing.4}" paddingInline="{spacing.8}" minHeight="calc(100vh - 64px)">
				{children}
			</Box>
		</>
	);
};
