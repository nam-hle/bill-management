import React from "react";
import type { Metadata } from "next";
import { TRPCError } from "@trpc/server";

import { TransactionForm } from "@/components/forms";
import { NotFoundMessage } from "@/components/layouts/not-found-message";
import { ForbiddenMessage } from "@/components/layouts/forbidden-message";
import { CorrectGroupGuard } from "@/components/layouts/correct-group-guard";

import { createCaller } from "@/services/trpc/caller";
import { getCurrentUser } from "@/services/supabase/server";

export const metadata: Metadata = {
	title: "Transaction Details"
};

namespace TransactionDetailsPage {
	export interface Props {
		params: Promise<{ id: string }>;
	}
}

export default async function TransactionDetailsPage(props: TransactionDetailsPage.Props) {
	const transactionId = (await props.params).id;
	const { id } = await getCurrentUser();

	try {
		const caller = await createCaller();
		const transaction = await caller.transactions.get({ transactionId });

		return (
			<CorrectGroupGuard expectedGroup={transaction.group}>
				<TransactionForm currentUserId={id} kind={{ transaction, type: "update" }} />
			</CorrectGroupGuard>
		);
	} catch (error) {
		if (error instanceof TRPCError) {
			if (error.code === "NOT_FOUND") {
				return <NotFoundMessage />;
			}

			if (error.code === "FORBIDDEN") {
				return <ForbiddenMessage />;
			}
		}

		throw error;
	}
}
