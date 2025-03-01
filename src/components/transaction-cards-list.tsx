"use client";

import React from "react";

import { Heading } from "@/components/heading";
import { TransactionCard } from "@/components/transaction-card";

import { trpc } from "@/services/trpc/client";

namespace TransactionCardList {
	export interface Props {
		readonly currentUserId: string;
	}
}

export const TransactionCardList: React.FC<TransactionCardList.Props> = ({ currentUserId }) => {
	const { data } = trpc.transactions.get.useQuery({ page: 1 });

	return (
		<div className="col-span-2 flex-1 space-y-4">
			<Heading>Recent Transactions</Heading>
			<div className="space-y-4">
				{data?.data.map((transaction) => <TransactionCard key={transaction.id} transaction={transaction} currentUserId={currentUserId} />)}
			</div>
		</div>
	);
};
