import React from "react";
import { FaRegBell } from "react-icons/fa";
import { Box, Stack, HStack, IconButton } from "@chakra-ui/react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { APIPayload, type ClientNotification } from "@/types";
import { NotificationMessage } from "@/components/app/notification-message";
import { PopoverBody, PopoverRoot, PopoverArrow, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export const NotificationContainer = () => {
	const [unreadCount, setUnreadCount] = React.useState(0);
	const [notifications, setNotifications] = React.useState<ClientNotification[]>([]);
	const [latestTimestamp, setLatestTimestamp] = React.useState<string | null>(null);
	const [oldestTimestamp, setOldestTimestamp] = React.useState<string | null>(null);
	const [hasOlder, setHasOlder] = React.useState(true);

	const markAsReadAll = React.useCallback(() => {
		fetch("/api/notifications/read-all", { method: "PATCH" }).then((response) => {
			if (response.ok) {
				setUnreadCount(0);
				setNotifications((prev) => prev.map((notification) => ({ ...notification, readStatus: true })));
			}
		});
	}, []);

	const markAsRead = React.useCallback((notificationId: string) => {
		fetch(`/api/notifications/${notificationId}/read`, { method: "PATCH" }).then((response) => {
			if (response.ok) {
				response.json().then((result) => {
					const { unreadCount } = APIPayload.Notification.ReadNotificationResponseSchema.parse(result);

					setUnreadCount(() => unreadCount);
					setNotifications((prev) =>
						prev.map((notification) => (notification.id === notificationId ? { ...notification, readStatus: true } : notification))
					);
				});
			}
		});
	}, []);

	const loadMore = React.useCallback(() => {
		try {
			if (!oldestTimestamp) {
				return;
			}

			const searchParams = new URLSearchParams();
			searchParams.append("before", oldestTimestamp);

			fetch(`/api/notifications?${searchParams.toString()}`).then((response) => {
				if (response.ok) {
					response.json().then((result) => {
						const {
							count,
							notifications,
							hasOlder: hasOlderPayload
						} = result as { count: number; hasOlder?: boolean; notifications: ClientNotification[] };
						setUnreadCount(count);
						setNotifications((prev) => [...prev, ...notifications]);

						if (notifications.length > 0) {
							setOldestTimestamp(notifications[notifications.length - 1].createdAt);
						}

						if (hasOlderPayload !== undefined) {
							setHasOlder(() => hasOlderPayload);
						}
					});
				}
			});
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error("Error notification data!", error);
		}
	}, [oldestTimestamp]);

	const fetchNotifications = React.useCallback(() => {
		try {
			const searchParams = new URLSearchParams();

			if (latestTimestamp) {
				searchParams.append("after", latestTimestamp);
			}

			fetch(`/api/notifications?${searchParams.toString()}`).then((response) => {
				if (response.ok) {
					response.json().then((result) => {
						const {
							count,
							notifications,
							hasOlder: hasOlderPayload
						} = result as { count: number; hasOlder?: boolean; notifications: ClientNotification[] };
						setUnreadCount(count);
						setNotifications((prev) => [...notifications, ...prev]);

						if (notifications.length > 0) {
							setLatestTimestamp(notifications[0].createdAt);

							if (!latestTimestamp) {
								setOldestTimestamp(notifications[notifications.length - 1].createdAt);
							}
						}

						if (hasOlderPayload !== undefined) {
							setHasOlder(() => hasOlderPayload);
						}
					});
				}
			});
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error("Error notification data!", error);
		}
	}, [latestTimestamp]);

	React.useEffect(() => {
		fetchNotifications();

		const intervalId = setInterval(fetchNotifications, 10_000);

		return () => clearInterval(intervalId);
	}, [fetchNotifications]);

	const [open, setOpen] = React.useState(false);

	return (
		<>
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
								<Button size="xs" variant="ghost" onClick={markAsReadAll} disabled={unreadCount === 0}>
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
												markAsRead(notification.id);
											}}
										/>
									);
								})}
							</Stack>
							<Box w="100%">
								<Button w="100%" variant="ghost" onClick={loadMore} disabled={!hasOlder} aria-label="Load older notifications">
									{hasOlder ? "Load older notifications" : "No more notifications"}
								</Button>
							</Box>
						</PopoverBody>
					)}
				</PopoverContent>
			</PopoverRoot>
		</>
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
