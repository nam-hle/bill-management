"use client";

import { useQuery } from "@tanstack/react-query";

import { Heading } from "@/components/heading";
import { TransactionCard } from "@/components/transaction-card";

import { API } from "@/api";

export function TransactionCardList({ currentUserId }: { currentUserId: string }) {
	const { data } = useQuery({
		queryKey: ["transactions"],
		queryFn: () => API.Transactions.List.query({ page: 1 })
	});

	return (
		<div className="col-span-2 flex-1 space-y-4">
			<Heading>Recent Transactions</Heading>
			<div className="space-y-4">
				{data?.data.map((transaction) => <TransactionCard key={transaction.id} transaction={transaction} currentUserId={currentUserId} />)}
			</div>
		</div>
	);
}
