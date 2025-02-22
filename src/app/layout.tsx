import "./globals.css";

import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { Application } from "@/components/application";
import { ThemeProvider } from "@/components/theme-provider";

import { UsersControllers } from "@/controllers";
import { ReactQueryClientProvider } from "@/services";
import { createSupabaseServer } from "@/services/supabase/server";

const interSans = Inter({
	subsets: ["latin"],
	variable: "--font-geist-sans"
});

export const metadata: Metadata = {
	description: "Nam Le",
	title: {
		default: "Bill Management",
		template: "%s | Bill Management"
	}
};

export default async function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	const supabase = await createSupabaseServer();

	const {
		data: { user }
	} = await supabase.auth.getUser();

	const userInfo = user ? UsersControllers.getUserInfo(supabase, user.id) : undefined;

	return (
		<ReactQueryClientProvider>
			<html lang="en" suppressHydrationWarning>
				<body suppressHydrationWarning className={interSans.variable}>
					<ThemeProvider enableSystem attribute="class" defaultTheme="system" disableTransitionOnChange>
						<Application pendingUserInfo={userInfo}>{children}</Application>
					</ThemeProvider>
					<ReactQueryDevtools initialIsOpen={false} />
				</body>
			</html>
		</ReactQueryClientProvider>
	);
}
