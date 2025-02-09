"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Stack, HStack, VStack, Heading } from "@chakra-ui/react";

import { API } from "@/api";
import { noop } from "@/utils";
import { Button } from "@/chakra/button";
import { SkeletonText } from "@/chakra/skeleton";
import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE_NUMBER } from "@/constants";
import { NotificationMessage } from "@/components/notification-message";

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
		<VStack width="60vh" gap="{spacing.4}" marginInline="auto">
			<HStack width="100%" justifyContent="space-between">
				<Heading as="h1">Notifications</Heading>
			</HStack>
			<HStack width="100%" justifyContent={isFirstPage ? "flex-end" : "space-between"}>
				{!isFirstPage && (
					<Button variant="subtle" onClick={() => setPage(page - 1)}>
						Previous
					</Button>
				)}
				{page === maxPage ? undefined : (
					<Button variant="subtle" onClick={() => setPage(page + 1)}>
						Next
					</Button>
				)}
			</HStack>
			<Stack width="60vh" gap="{spacing.2}">
				{isPending ? (
					<>
						{Array.from({ length: DEFAULT_PAGE_SIZE }).map((_, index) => {
							return <SkeletonText gap="2" key={index} noOfLines={2} />;
						})}
					</>
				) : (
					data?.notifications.map((notification) => {
						return <NotificationMessage onClick={noop} key={notification.id} notification={notification} />;
					})
				)}
			</Stack>
		</VStack>
	);
};
