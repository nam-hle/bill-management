import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { createSupabaseServer } from "@/supabase/server";
import { Application } from "@/components/app/application";
import { LayoutProvider } from "@/components/ui/layout-provider";
import { UsersControllers } from "@/controllers/users.controllers";
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
		data: { user: currentUser }
	} = await supabase.auth.getUser();

	const userInfo = currentUser ? UsersControllers.getUserInfoInternal(currentUser.id) : undefined;

	return (
		<html lang="en" suppressHydrationWarning>
			<body className={interSans.variable}>
				<LayoutProvider>
					<Application userInfo={userInfo}>{children}</Application>
				</LayoutProvider>
			</body>
		</html>
	);
}
