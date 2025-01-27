import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Toaster } from "@/components/ui/toaster";
import { createSupabaseServer } from "@/supabase/server";
import { RootContainer } from "@/components/ui/root-container";
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

	return (
		<html lang="en" suppressHydrationWarning>
			<body className={interSans.variable}>
				<LayoutProvider>
					<Toaster />
					<RootContainer user={currentUser}>{children}</RootContainer>
				</LayoutProvider>
			</body>
		</html>
	);
}
