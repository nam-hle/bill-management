import React from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";

import { Button } from "@/components/shadcn/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/shadcn/popover";

import { EmptyState } from "@/components/empty-state";
import { CounterBadge } from "@/components/counter-badge";
import { NotificationMessage } from "@/components/notification-message";

import { API } from "@/api";
import { type ClientNotification } from "@/schemas";

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
		mutationFn: API.Notifications.List.query,
		onSuccess: (olderData) => {
			updateNotifications("append", olderData);
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
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button size="icon" variant="outline" className="relative h-8 w-8 rounded-full">
					<Bell />
					<CounterBadge count={unreadCount} />
				</Button>
			</PopoverTrigger>
			<PopoverContent align="end" className="w-90 w-[400px] p-2">
				{notifications.length === 0 ? (
					<EmptyState title="You have no notifications" />
				) : (
					<div className="flex max-h-[500px] flex-col gap-2 overflow-y-auto">
						<div className="flex justify-between">
							<Button asChild size="sm" variant="ghost" onClick={() => setOpen(false)} className="cursor-pointer px-2">
								<Link href="/notifications">See more</Link>
							</Button>
							<Button size="sm" variant="ghost" onClick={() => readAll()} disabled={unreadCount === 0} className="cursor-pointer px-2">
								Mark all as read
							</Button>
						</div>

						<div className="flex flex-col gap-0">
							{notifications.map((notification) => (
								<NotificationMessage
									key={notification.id}
									notification={notification}
									onClick={() => {
										setOpen(false);
										read({ notificationId: notification.id });
									}}
								/>
							))}
						</div>

						<div className="w-full">
							<Button
								variant="ghost"
								className="w-full"
								aria-label="Load older notifications"
								disabled={!hasOlder || !isLoadingOlderNotifications}
								onClick={() => {
									if (oldestTimestamp) {
										loadMore({ before: oldestTimestamp });
									}
								}}>
								{hasOlder ? "Load older notifications" : "No more notifications"}
							</Button>
						</div>
					</div>
				)}
			</PopoverContent>
		</Popover>
	);
};
