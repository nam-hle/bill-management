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
		<div className="col-span-2 space-y-4">
			<h2 className="text-2xl font-bold">Recent Bills</h2>
			<div className="space-y-4">{data?.data?.map((bill) => <BillCard bill={bill} key={bill.id} currentUserId={currentUserId} />)}</div>
		</div>
	);
}
