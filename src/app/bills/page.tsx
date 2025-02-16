import React from "react";
import { type Metadata } from "next";
import { VStack } from "@chakra-ui/react";
import { IoIosAddCircle } from "react-icons/io";

import { BillsTable } from "@/components/tables";
import { LinkButton } from "@/chakra/link-button";
import { getCurrentUser } from "@/services/supabase/server";

export const metadata: Metadata = {
	title: "Bills"
};

export default async function BillsPage() {
	const currentUser = await getCurrentUser();

	return (
		<VStack className="ck" gap="{spacing.4}" alignItems="flex-start">
			<BillsTable
				advanced
				currentUserId={currentUser.id}
				action={
					<LinkButton size="sm" variant="solid" href="/bills/new">
						<IoIosAddCircle /> New
					</LinkButton>
				}
			/>
		</VStack>
	);
}
