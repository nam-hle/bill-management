import React from "react";
import { MdArrowRightAlt } from "react-icons/md";

import { getCurrentUser } from "@/services";
import { LinkButton } from "@/chakra/link-button";
import { BillsTable } from "@/components/bills-table";

export async function RecentBills() {
	const currentUser = await getCurrentUser();

	return (
		<BillsTable
			title="Recent bills"
			currentUserId={currentUser.id}
			action={
				<LinkButton href="/bills" variant="subtle" colorScheme="blue">
					View All <MdArrowRightAlt />
				</LinkButton>
			}
		/>
	);
}
