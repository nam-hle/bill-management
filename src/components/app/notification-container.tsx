import { FaRegBell } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { type User } from "@supabase/supabase-js";
import React, { useEffect, useCallback } from "react";
import { Box, Text, Stack, HStack, IconButton } from "@chakra-ui/react";

import { Button } from "@/components/ui/button";
import { Status } from "@/components/ui/status";
import { createClient } from "@/supabase/client";
import { type ClientNotification } from "@/types";
import { EmptyState } from "@/components/ui/empty-state";
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
			console.error("Error loading user data!", error);
		}
	}, [notifications, supabase, user.id]);

	useEffect(() => {
		if (initial) {
			fetchNotifications().then(() => setInitial(false));
		}

		const intervalId = setInterval(fetchNotifications, 30_000);

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
				<PopoverContent minW="35vw">
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

const NotificationMessage = ({ notification, onClose }: { notification: ClientNotification; onClose: () => void }) => {
	const { type, createdAt } = notification;

	let content: React.ReactNode;
	let link: string | undefined;

	const router = useRouter();

	if (type === "BillCreated") {
		const { bill } = notification;

		content = (
			<>
				You’ve been added to the bill <strong>{bill.description}</strong> by <strong>{bill.creator.fullName}</strong>
			</>
		);
		link = `/bills/${bill.id}`;
	} else {
		throw new Error("Invalid notification type");
	}

	const time = formatDistanceToNow(new Date(createdAt), { addSuffix: true });

	return (
		<HStack cursor="pointer" padding="{spacing.2}" _hover={{ bg: "gray.200" }}>
			<Stack gap="0">
				<Text
					textStyle="sm"
					onClick={() => {
						if (link) {
							router.push(link);
							onClose();
						}
					}}>
					{content}
				</Text>
				<Text textStyle="xs" color="gray.500">
					{time[0].toUpperCase() + time.slice(1)}
				</Text>
			</Stack>
			<Status value="info" />
		</HStack>
	);
};
