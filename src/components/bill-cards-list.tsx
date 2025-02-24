"use client";
import { useQuery } from "@tanstack/react-query";

import { Heading } from "@/components/heading";
import { BillCard } from "@/components/bill-card";

import { API } from "@/api";

export function BillCardsList({ currentUserId }: { currentUserId: string }) {
	const { data } = useQuery({
		queryKey: ["bills"],
		queryFn: () => API.Bills.List.query({ page: 1 })
	});

	return (
		<div className="col-span-2 space-y-4">
			<Heading>Recent Bills</Heading>
			<div className="space-y-4">{data?.data?.map((bill) => <BillCard bill={bill} key={bill.id} currentUserId={currentUserId} />)}</div>
		</div>
	);
}
