import { FaRegBell } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { type User } from "@supabase/supabase-js";
import React, { useEffect, useCallback } from "react";
import { Text, Stack, IconButton } from "@chakra-ui/react";

import { createClient } from "@/supabase/client";
import { type ClientNotification } from "@/types";
import { NotificationsControllers } from "@/controllers/notifications.controllers";
import { PopoverBody, PopoverRoot, PopoverArrow, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export const NotificationButton: React.FC<{ user: User }> = ({ user }) => {
	const supabase = createClient();

	const [notifications, setNotifications] = React.useState<ClientNotification[]>([]);

	const getNotifications = useCallback(async () => {
		try {
			const data = await NotificationsControllers.getByUserId(supabase, user.id);

			setNotifications(data);
		} catch (error) {
			alert("Error loading user data!");
		}
	}, [user, supabase]);

	useEffect(() => {
		getNotifications();
	}, [getNotifications]);
	const [open, setOpen] = React.useState(false);

	return (
		<PopoverRoot size="lg" open={open} onOpenChange={(e) => setOpen(e.open)} positioning={{ placement: "bottom-end" }}>
			<PopoverTrigger asChild>
				<IconButton variant="ghost">
					<FaRegBell />
				</IconButton>
			</PopoverTrigger>
			<PopoverContent minW="25vw">
				<PopoverArrow />
				<PopoverBody padding="{spacing.3}">
					<Stack gap="0">
						{notifications.map((notification) => {
							return <NotificationMessage key={notification.id} notification={notification} onClose={() => setOpen(false)} />;
						})}
					</Stack>
				</PopoverBody>
			</PopoverContent>
		</PopoverRoot>
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
				You’ve been added to the bill <strong>{bill.description}</strong> by <strong>{bill.creator.username}</strong>
			</>
		);
		link = `/bills/${bill.id}`;
	} else {
		throw new Error("Invalid notification type");
	}

	const time = formatDistanceToNow(new Date(createdAt), { addSuffix: true });

	return (
		<Stack gap="0" cursor="pointer" padding="{spacing.2}" _hover={{ bg: "gray.100" }}>
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
	);
};
