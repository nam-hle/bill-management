import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { createSupabaseServer } from "@/supabase/server";
import { Application } from "@/components/app/application";
import { LayoutProvider } from "@/components/ui/layout-provider";
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

	let user: { fullName?: string; avatarUrl?: string } | undefined;

	if (currentUser) {
		const { data: profile } = await supabase.from("profiles").select(`fullName:full_name, avatar_url`).eq("id", currentUser.id).single();

		if (profile) {
			user = { fullName: profile.fullName ?? "", avatarUrl: profile.avatar_url ?? undefined };
		}
	}

	return (
		<html lang="en" suppressHydrationWarning>
			<body className={interSans.variable}>
				<LayoutProvider>
					<Application user={user}>{children}</Application>
				</LayoutProvider>
			</body>
		</html>
	);
}
