"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/shadcn/button";
import { Skeleton } from "@/components/shadcn/skeleton";

import { TypographyH1 } from "@/components/typography";
import { NotificationMessage } from "@/components/notification-message";

import { API } from "@/api";
import { noop } from "@/utils";
import { cn } from "@/utils/cn";
import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE_NUMBER } from "@/constants";

namespace TransactionsTable {
	export interface Props {}
}

export const NotificationsTable: React.FC<TransactionsTable.Props> = () => {
	const [page, setPage] = React.useState(DEFAULT_PAGE_NUMBER);
	const isFirstPage = React.useMemo(() => page === DEFAULT_PAGE_NUMBER, [page]);

	const { data, isPending } = useQuery({
		queryKey: ["notifications", "list", page],
		queryFn: () => API.Notifications.List.query({ page })
	});

	const maxPage = React.useMemo(() => (data?.fullSize ? Math.ceil(data?.fullSize / DEFAULT_PAGE_SIZE) : 1), [data?.fullSize]);

	return (
		<div data-testid="table-container" className="mx-auto flex w-2/3 flex-col gap-4">
			<TypographyH1>Notifications</TypographyH1>
			<div className={cn("flex h-10 w-full", isFirstPage ? "justify-end" : "justify-between")}>
				{!isFirstPage && (
					<Button variant="secondary" onClick={() => setPage(page - 1)}>
						Previous
					</Button>
				)}
				{page === maxPage ? undefined : (
					<Button variant="secondary" onClick={() => setPage(page + 1)}>
						Next
					</Button>
				)}
			</div>
			<div data-testid="table" className="flex flex-col gap-2">
				{isPending ? (
					<>
						{Array.from({ length: DEFAULT_PAGE_SIZE }).map((_, index) => {
							return <Skeleton key={index} className="h-10 w-full" />;
						})}
					</>
				) : (
					data?.notifications.map((notification) => {
						return <NotificationMessage onClick={noop} key={notification.id} notification={notification} />;
					})
				)}
			</div>
		</div>
	);
};
