// eslint-disable-next-line no-restricted-imports
import "./globals.css";

import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Application } from "@/components/application";

import { UsersControllers } from "@/controllers";
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
		<html lang="en" suppressHydrationWarning>
			<body suppressHydrationWarning className={interSans.variable}>
				<Application pendingUserInfo={userInfo}>{children}</Application>
			</body>
		</html>
	);
}
