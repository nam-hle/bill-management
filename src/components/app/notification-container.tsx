import { FaRegBell } from "react-icons/fa";
import { type User } from "@supabase/supabase-js";
import React, { useEffect, useCallback } from "react";
import { Box, Stack, IconButton } from "@chakra-ui/react";

import { Button } from "@/components/ui/button";
import { createClient } from "@/supabase/client";
import { type ClientNotification } from "@/types";
import { EmptyState } from "@/components/ui/empty-state";
import { NotificationMessage } from "@/components/app/notification-message";
import { NotificationsControllers } from "@/controllers/notifications.controllers";
import { PopoverBody, PopoverRoot, PopoverArrow, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export const NotificationContainer: React.FC<{ user: User }> = ({ user }) => {
	const supabase = createClient();

	const [initial, setInitial] = React.useState(true);
	const [unreadCount, setUnreadCount] = React.useState(0);
	const [notifications, setNotifications] = React.useState<ClientNotification[]>([]);

	const fetchNotifications = useCallback(async () => {
		try {
			const from = notifications.length === 0 ? undefined : notifications[0].createdAt;
			const data = await NotificationsControllers.getByUserId(supabase, user.id, from);
			setNotifications((prev) => [...data, ...prev]);
			setUnreadCount((prev) => prev + data.filter((notification) => !notification.readStatus).length);
		} catch (error) {
			console.error("Error notification data!", error);
		}
	}, [notifications, supabase, user.id]);

	useEffect(() => {
		if (initial) {
			fetchNotifications().then(() => setInitial(false));
		}

		const intervalId = setInterval(fetchNotifications, 10_000);

		return () => clearInterval(intervalId);
	}, [fetchNotifications, initial]);
	const [open, setOpen] = React.useState(false);

	return (
		<>
			<Button onClick={fetchNotifications}>Fetch</Button>
			<PopoverRoot size="lg" open={open} onOpenChange={(e) => setOpen(e.open)} positioning={{ placement: "bottom-end" }}>
				<PopoverTrigger asChild>
					<IconButton rounded="full" variant="ghost">
						<FaRegBell />
						{unreadCount > 0 && (
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
								{unreadCount}
							</Box>
						)}
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
						<PopoverBody padding="{spacing.2}">
							<Stack gap="0">
								{notifications.map((notification) => {
									return <NotificationMessage key={notification.id} notification={notification} onClose={() => setOpen(false)} />;
								})}
							</Stack>
						</PopoverBody>
					)}
				</PopoverContent>
			</PopoverRoot>
		</>
	);
};
