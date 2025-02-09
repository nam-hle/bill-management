import React from "react";
import { MdArrowRightAlt } from "react-icons/md";

import { LinkButton } from "@/chakra/link-button";
import { BillsTable } from "@/components/bills-table";
import { BillsControllers } from "@/controllers/bills.controllers";
import { getCurrentUser, createSupabaseServer } from "@/services/supabase/server";

export async function RecentBills() {
	const supabase = await createSupabaseServer();
	const currentUser = await getCurrentUser();

	const { bills, fullSize } = await BillsControllers.getManyByMemberId(supabase, { memberId: currentUser.id }, { pageSize: 5, pageNumber: 1 });

	return (
		<BillsTable
			mode="basic"
			bills={bills}
			fullSize={fullSize}
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
