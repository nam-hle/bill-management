"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Stack, HStack } from "@chakra-ui/react";

import { ColorModeButton } from "@/chakra/color-mode";
import { LinkButton } from "@/components/link-button";
import { AvatarContainer } from "@/components/avatar-container";
import { NotificationContainer } from "@/components/notification-container";

export const NavigationBar: React.FC<AvatarContainer.Props> = ({ userInfo }) => {
	const pathname = usePathname();
	const pageName = pathname.split("/")[1];

	return (
		<HStack
			as="header"
			marginInline="auto"
			maxWidth="{sizes.8xl}"
			paddingBlock="{spacing.2}"
			paddingInline="{spacing.8}"
			justifyContent="space-between">
			<Stack direction="row" minHeight="48px" gap="{spacing.2}" alignItems="center">
				{userInfo && (
					<>
						<LinkButton href="/" size="sm" active={pageName === ""}>
							Home
						</LinkButton>
						<LinkButton size="sm" href="/bills" active={pageName === "bills"}>
							Bills
						</LinkButton>
						<LinkButton size="sm" href="/transactions" active={pageName === "transactions"}>
							Transactions
						</LinkButton>
						<LinkButton size="sm" variant="solid" href="/bills/new">
							Create
						</LinkButton>
					</>
				)}
			</Stack>
			<Stack direction="row" minHeight="48px" gap="{spacing.2}" alignItems="center">
				<ColorModeButton />
				{userInfo && (
					<>
						<NotificationContainer />
						<AvatarContainer userInfo={userInfo} />
					</>
				)}
			</Stack>
		</HStack>
	);
};
