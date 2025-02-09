import React from "react";
import { FaRegBell } from "react-icons/fa";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Box, Stack, HStack, IconButton } from "@chakra-ui/react";

import { API } from "@/api";
import { Button } from "@/chakra/button";
import { axiosInstance } from "@/services/axios";
import { EmptyState } from "@/chakra/empty-state";
import { type ClientNotification } from "@/schemas/notification.schema";
import { NotificationMessage } from "@/components/notification-message";
import { PopoverBody, PopoverRoot, PopoverArrow, PopoverContent, PopoverTrigger } from "@/chakra/popover";

export const NotificationContainer = () => {
	const [unreadCount, setUnreadCount] = React.useState(0);
	const [notifications, setNotifications] = React.useState<ClientNotification[]>([]);
	const [hasOlder, setHasOlder] = React.useState(true);
	const [initialized, setInitialize] = React.useState(false);

	const { mutate: readAll } = useMutation({
		mutationFn: API.Notifications.ReadAll.mutate,
		onSuccess() {
			setUnreadCount(0);
			setNotifications((prev) => prev.map((notification) => ({ ...notification, readStatus: true })));
		}
	});
	const { mutate: read } = useMutation({
		mutationFn: API.Notifications.ReadSingle.mutate,
		onSuccess({ unreadCount }, { notificationId }) {
			setUnreadCount(() => unreadCount);
			setNotifications((prev) =>
				prev.map((notification) => (notification.id === notificationId ? { ...notification, readStatus: true } : notification))
			);
		}
	});

	const updateNotifications = React.useCallback((type: "append" | "prepend", response: API.Notifications.List.Response) => {
		setHasOlder((prev) => response.hasOlder ?? prev);
		setUnreadCount(response.unreadCount);
		setNotifications((prev) => {
			return type === "append" ? [...prev, ...response.notifications] : [...response.notifications, ...prev];
		});
	}, []);

	const { oldestTimestamp, latestTimestamp } = React.useMemo(() => {
		if (notifications.length === 0) {
			return { oldestTimestamp: undefined, latestTimestamp: undefined };
		}

		return { latestTimestamp: notifications[0].createdAt, oldestTimestamp: notifications[notifications.length - 1].createdAt };
	}, [notifications]);

	const { data: initialData } = useQuery<API.Notifications.List.Response>({
		queryKey: ["notifications"],
		queryFn: () => API.Notifications.List.query({})
	});

	const { data: fetchData } = useQuery({
		enabled: initialized,
		refetchOnMount: false,
		refetchInterval: 10000,
		queryKey: ["notifications", "refetch", latestTimestamp],
		queryFn: () => API.Notifications.List.query({ after: latestTimestamp })
	});

	const { mutate: loadMore, isPending: isLoadingOlderNotifications } = useMutation({
		onSuccess: (olderData) => {
			updateNotifications("append", olderData);
		},
		mutationFn: async (params: API.Notifications.List.SearchParams) => {
			const { data } = await axiosInstance<API.Notifications.List.Response>("/notifications", { params });

			return data;
		}
	});

	React.useEffect(() => {
		if (initialData) {
			setInitialize(true);
			updateNotifications("prepend", initialData);
		}
	}, [initialData, updateNotifications]);

	React.useEffect(() => {
		if (fetchData) {
			updateNotifications("prepend", fetchData);
		}
	}, [fetchData, initialData, updateNotifications]);

	const [open, setOpen] = React.useState(false);

	return (
		<PopoverRoot size="lg" open={open} onOpenChange={(e) => setOpen(e.open)} positioning={{ placement: "bottom-end" }}>
			<PopoverTrigger asChild>
				<IconButton rounded="full" variant="ghost">
					<FaRegBell />
					<CounterBadge count={unreadCount}></CounterBadge>
				</IconButton>
			</PopoverTrigger>
			<PopoverContent width="350px">
				<PopoverArrow />
				{notifications.length === 0 && (
					<PopoverBody padding={0}>
						<EmptyState title="You have no notifications" />
					</PopoverBody>
				)}
				{notifications.length > 0 && (
					<PopoverBody padding={0} display="flex" overflowY="auto" maxHeight="500px" gap="{spacing.2}" margin="{spacing.2}" flexDirection="column">
						<HStack justifyContent="flex-end">
							<Button size="xs" variant="ghost" onClick={() => readAll()} disabled={unreadCount === 0}>
								Mark all as read
							</Button>
						</HStack>
						<Stack gap="0">
							{notifications.map((notification) => {
								return (
									<NotificationMessage
										key={notification.id}
										notification={notification}
										onClick={() => {
											setOpen(false);
											read({ notificationId: notification.id });
										}}
									/>
								);
							})}
						</Stack>
						<Box w="100%">
							<Button
								w="100%"
								variant="ghost"
								disabled={!hasOlder}
								aria-label="Load older notifications"
								loading={isLoadingOlderNotifications}
								onClick={() => {
									if (oldestTimestamp) {
										loadMore({ before: oldestTimestamp });
									}
								}}>
								{hasOlder ? "Load older notifications" : "No more notifications"}
							</Button>
						</Box>
					</PopoverBody>
				)}
			</PopoverContent>
		</PopoverRoot>
	);
};

const CounterBadge: React.FC<{ count: number }> = ({ count }) => {
	if (count === 0) {
		return null;
	}

	return (
		<Box
			top="0"
			right="0"
			bg="red.500"
			color="white"
			fontSize="2xs"
			display="flex"
			position="absolute"
			borderRadius="full"
			width="{spacing.4}"
			alignItems="center"
			height="{spacing.4}"
			justifyContent="center"
			transform="translate(20%, -20%)">
			{count}
		</Box>
	);
};
