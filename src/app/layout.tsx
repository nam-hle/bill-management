import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { createClient } from "@/supabase/server";
import { Toaster } from "@/components/ui/toaster";
import { RootContainer } from "@/components/ui/root-container";
import { LayoutProvider } from "@/components/ui/layout-provider";
const interSans = Inter({
	variable: "--font-geist-sans",
	subsets: ["latin"]
});

export const metadata: Metadata = {
	title: {
		template: "%s | Bill Management",
		default: "Bill Management"
	},
	description: "Nam Le"
};

export default async function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	const supabase = await createClient();

	const {
		data: { user }
	} = await supabase.auth.getUser();

	return (
		<html lang="en" suppressHydrationWarning>
			<body className={interSans.variable}>
				<LayoutProvider>
					<Toaster />
					<RootContainer user={user}>{children}</RootContainer>
				</LayoutProvider>
			</body>
		</html>
	);
}
