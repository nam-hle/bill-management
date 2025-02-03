"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Stack, HStack, VStack, Heading } from "@chakra-ui/react";

import { API } from "@/api";
import { noop } from "@/utils";
import { axiosInstance } from "@/axios";
import { type DataListResponse } from "@/types";
import { Button } from "@/components/ui/button";
import { DEFAULT_PAGE_NUMBER } from "@/constants";
import { type ClientTransaction } from "@/schemas/transactions.schema";
import { type ClientNotification } from "@/schemas/notification.schema";
import { NotificationMessage } from "@/components/app/notification-message";

namespace TransactionsTable {
	export interface Props {}
}
export async function fetchNotifications() {
	const { data } = await axiosInstance.get<DataListResponse<ClientTransaction>>("/notifications");

	return data as unknown as { notifications: ClientNotification[] };
}

export const NotificationsTable: React.FC<TransactionsTable.Props> = () => {
	const [page, setPage] = React.useState(DEFAULT_PAGE_NUMBER);

	const { data } = useQuery({
		queryKey: ["notifications", "list", page],
		queryFn: API.Notifications.List.request({ page })
	});

	// const onPageChange = React.useCallback((params: { page: number }) => {
	// 	setPage(() => params.page);
	// }, []);

	return (
		<VStack>
			<VStack width="100%" gap="{spacing.4}">
				<HStack width="100%" justifyContent="space-between">
					<Heading as="h1">Notifications</Heading>
				</HStack>

				<Stack gap="0">
					{data?.notifications.map((notification) => {
						return <NotificationMessage onClick={noop} key={notification.id} notification={notification} />;
					})}
				</Stack>
			</VStack>
			<HStack width="100%" justifyContent="space-between">
				<Button onClick={() => setPage(page - 1)}>Previous</Button>
				<Button onClick={() => setPage(page + 1)}>Next</Button>
			</HStack>
			{/*<NotificationContainer />*/}
		</VStack>
	);
};
