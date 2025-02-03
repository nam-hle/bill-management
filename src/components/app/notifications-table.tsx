"use client";

import React from "react";
import { Stack, HStack, VStack, Heading } from "@chakra-ui/react";

import { axiosInstance } from "@/axios";
import { type DataListResponse } from "@/types";
import { type ClientTransaction } from "@/schemas/transactions.schema";
import { type ClientNotification } from "@/schemas/notification.schema";

namespace TransactionsTable {
	export interface Props {}
}
export async function fetchNotifications() {
	const { data } = await axiosInstance.get<DataListResponse<ClientTransaction>>("/notifications");

	return data as unknown as { notifications: ClientNotification[] };
}

export const NotificationsTable: React.FC<TransactionsTable.Props> = () => {
	// const [page, setPage] = React.useState(DEFAULT_PAGE_NUMBER);

	// const { data } = useQuery({
	// 	queryFn: fetchNotifications,
	// 	queryKey: ["notifications", "list"]
	// });

	// const onPageChange = React.useCallback((params: { page: number }) => {
	// 	setPage(() => params.page);
	// }, []);

	return (
		<Stack flexDirection="row">
			<VStack width="100%" gap="{spacing.4}">
				<HStack width="100%" justifyContent="space-between">
					<Heading as="h1">Notifications</Heading>
				</HStack>

				<Stack gap="0">
					{/*{data?.notifications.map((notification) => {*/}
					{/*	return <NotificationMessage onClick={noop} key={notification.id} notification={notification} />;*/}
					{/*})}*/}
				</Stack>
			</VStack>
			{/*<NotificationContainer />*/}
		</Stack>
	);
};
