import { FaRegBell } from "react-icons/fa";
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

	return (
		<PopoverRoot>
			<PopoverTrigger asChild>
				<IconButton variant="ghost">
					<FaRegBell />
				</IconButton>
			</PopoverTrigger>
			<PopoverContent>
				<PopoverArrow />
				<PopoverBody>
					<Stack>
						{notifications.map((notification) => {
							if (notification.type === "BillCreated") {
								const { bill, createdAt } = notification;

								return (
									<React.Fragment key={notification.id}>
										<Text>
											You’ve been added to the bill <strong>{bill.description}</strong> by <strong>{bill.creator.username}</strong>
										</Text>
										<Text textStyle="xs">
											{formatDistanceToNow(new Date(createdAt), {
												addSuffix: true
											})}
										</Text>
									</React.Fragment>
								);
							}

							return <Text key={notification.id}>Unknown notification</Text>;
						})}
					</Stack>
				</PopoverBody>
			</PopoverContent>
		</PopoverRoot>
	);
};
