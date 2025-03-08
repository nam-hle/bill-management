import React from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { Toaster } from "@/components/shadcn/toaster";

import { NavigationBar } from "@/components/layouts/navigation-bar";
import { ThemeProvider } from "@/components/layouts/theme-provider";
import { type AvatarContainer } from "@/components/avatars/avatar-container";

import { type Container } from "@/types";
import { TrpcProvider } from "@/services";

export const Application: React.FC<Container & Partial<AvatarContainer.Props>> = ({ children, pendingUserInfo }) => {
	return (
		<TrpcProvider>
			<ThemeProvider enableSystem attribute="class" defaultTheme="system" disableTransitionOnChange>
				<NavigationBar pendingUserInfo={pendingUserInfo} />
				<main className="mx-auto min-h-[calc(100vh-64px)] max-w-screen-2xl px-8 py-4">{children}</main>
				<Toaster />
			</ThemeProvider>
			<ReactQueryDevtools initialIsOpen={false} />
		</TrpcProvider>
	);
};
