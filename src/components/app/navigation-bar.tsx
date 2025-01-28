"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Stack, HStack } from "@chakra-ui/react";

import { LinkButton } from "@/components/app/link-button";
import { AvatarContainer } from "@/components/app/avatar-container";
import { NotificationContainer } from "@/components/app/notification-container";

export const NavigationBar: React.FC<AvatarContainer.Props> = ({ user }) => {
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
						<NotificationContainer />
						<AvatarContainer user={user} />
					</>
				)}
			</Stack>
		</HStack>
	);
};
