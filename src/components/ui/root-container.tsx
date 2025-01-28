"use client";

import { usePathname } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import React, { useState, useEffect } from "react";
import { Box, Stack, HStack } from "@chakra-ui/react";

import { downloadImage } from "@/utils";
import { type Container } from "@/types";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/app/link-button";
import { AvatarContainer } from "@/components/app/avatar-container";
import { NotificationContainer } from "@/components/app/notification-container";

export const RootContainer: React.FC<Container & { user: User | null; unresolvedAvatarUrl: string | undefined }> = (props) => {
	const { user, children, unresolvedAvatarUrl } = props;
	const pathname = usePathname();
	const pageName = pathname.split("/")[1];

	const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);

	useEffect(() => {
		downloadImage(unresolvedAvatarUrl).then(setAvatarUrl);
	}, [unresolvedAvatarUrl]);

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
							<LinkButton href="/transactions" active={pageName === "transactions"}>
								Transactions
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
							<AvatarContainer user={user} avatarUrl={avatarUrl} />
						</>
					)}
				</Stack>
			</HStack>
			<Box as="main" marginInline="auto" maxWidth="{sizes.8xl}" paddingBlock="{spacing.4}" paddingInline="{spacing.8}" minHeight="calc(100vh - 64px)">
				{children}
			</Box>
		</>
	);
};
