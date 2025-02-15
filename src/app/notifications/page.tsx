import React from "react";
import { type Metadata } from "next";
import { VStack } from "@chakra-ui/react";

import { NotificationsTable } from "@/components/tables";

export const metadata: Metadata = {
	title: "Notifications"
};

export default async function NotificationsPage() {
	return (
		<VStack gap="{spacing.4}" alignItems="flex-start">
			<NotificationsTable />
		</VStack>
	);
}
