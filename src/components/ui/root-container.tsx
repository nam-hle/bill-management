"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Box, Stack, HStack } from "@chakra-ui/react";

import { type Container } from "@/types";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/link-button";

export const RootContainer: React.FC<Container & { loggedIn: boolean }> = (props) => {
	const pathname = usePathname();
	const pageName = pathname.split("/")[1];

	return (
		<>
			<HStack as="header" marginInline="auto" maxWidth="{sizes.8xl}" paddingInline="{spacing.8}" justifyContent="space-between">
				<Stack direction="row" minHeight="48px" gap="{spacing.4}" alignItems="center">
					<LinkButton href="/users" active={pageName === "users"}>
						Users
					</LinkButton>
					<LinkButton href="/bills" active={pageName === "bills"}>
						Bills
					</LinkButton>
				</Stack>
				<Stack direction="row" minHeight="48px" gap="{spacing.8}" alignItems="center">
					{props.loggedIn ? (
						<form method="post" action="/auth/signout">
							<Button type="submit" variant="subtle">
								Sign out
							</Button>
						</form>
					) : pageName !== "login" ? (
						<LinkButton href="/login" variant="solid" colorPalette="steal">
							Login
						</LinkButton>
					) : null}
				</Stack>
			</HStack>
			<Box as="main" marginInline="auto" maxWidth="{sizes.8xl}" paddingTop="{spacing.4}" paddingInline="{spacing.8}" minHeight="calc(100vh - 48px)">
				{props.children}
			</Box>
		</>
	);
};
