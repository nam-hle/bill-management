"use client";
import { useQuery } from "@tanstack/react-query";

import { BillCard } from "@/components/bill-card";

import { API } from "@/api";

export function BillCardsList({ currentUserId }: { currentUserId: string }) {
	const { data } = useQuery({
		queryKey: ["bills"],
		queryFn: () => API.Bills.List.query({ page: 1 })
	});

	return (
		<div className="space-y-4">
			<h2 className="text-xl font-bold">Recent Bills</h2>
			<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
				{data?.data?.map((bill) => <BillCard bill={bill} key={bill.id} currentUserId={currentUserId} />)}
			</div>
		</div>
	);
}
