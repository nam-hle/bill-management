import React from "react";
import { capitalize } from "lodash";
import { useRouter } from "next/navigation";
import { Text, Stack, HStack, Center } from "@chakra-ui/react";

import { Status } from "@/chakra/status";
import { formatDistanceTime } from "@/utils";
import {
	type ClientNotification,
	type BillDeletedNotification,
	type BillUpdatedNotification,
	type BillCreatedNotification,
	type TransactionWaitingNotification,
	type TransactionDeclinedNotification,
	type TransactionConfirmedNotification
} from "@/schemas/notification.schema";

namespace NotificationMessage {
	export interface Props {
		onClick(): void;
		readonly notification: ClientNotification;
	}
}

export const NotificationMessage: React.FC<NotificationMessage.Props> = (props) => {
	const { onClick, notification } = props;
	const { createdAt, readStatus } = notification;

	const router = useRouter();
	const link = React.useMemo(() => renderLink(notification), [notification]);
	const message = React.useMemo(() => transformMessage(renderMessage(notification)), [notification]);

	return (
		<HStack cursor="pointer" padding="{spacing.2}" _hover={{ bg: "gray.200" }} justifyContent="space-between">
			<Stack gap="0">
				<Text
					width="100%"
					textStyle="sm"
					onClick={() => {
						if (link) {
							router.push(link);
						}

						onClick();
					}}>
					{message}
				</Text>
				<Text textStyle="xs" color="gray.500">
					{capitalize(formatDistanceTime(createdAt))}
				</Text>
			</Stack>
			<Center width="20px" height="20px">
				{!readStatus && <Status value="info" />}
			</Center>
		</HStack>
	);
};

function renderLink(notification: ClientNotification) {
	switch (notification.type) {
		case "BillCreated":
		case "BillDeleted":
		case "BillUpdated":
			return `/bills/${notification.bill.id}`;
		case "TransactionWaiting":
		case "TransactionConfirmed":
		case "TransactionDeclined":
			return `/transactions/${notification.transaction.id}`;
		default:
			return undefined;
	}
}

function renderMessage(notification: ClientNotification) {
	switch (notification.type) {
		case "BillCreated":
			return renderBillCreatedMessage(notification);
		case "BillDeleted":
			return renderBillDeletedMessage(notification);
		case "BillUpdated":
			return renderBillUpdatedMessage(notification);
		case "TransactionWaiting":
			return renderTransactionWaitingMessage(notification);
		case "TransactionDeclined":
			return renderTransactionDeclinedMessage(notification);
		case "TransactionConfirmed":
			return renderTransactionConfirmedMessage(notification);
		default:
			throw new Error("Invalid notification type");
	}
}

function renderTransactionConfirmedMessage(notification: TransactionConfirmedNotification) {
	const { transaction } = notification;
	const { amount, receiver } = transaction;

	return `Your transaction of **${amount}** to **${receiver.fullName}** has been confirmed.`;
}

function renderTransactionDeclinedMessage(notification: TransactionDeclinedNotification) {
	const { transaction } = notification;
	const { sender, amount } = transaction;

	return `Your transaction of **${amount}** from **${sender.fullName}** has been declined.`;
}

function renderTransactionWaitingMessage(notification: TransactionWaitingNotification) {
	const { transaction } = notification;
	const { sender, amount } = transaction;

	return `You have received a new transaction of **${amount}** from **${sender.fullName}**. Please review and confirm it.`;
}

function renderBillCreatedMessage(notification: BillCreatedNotification) {
	const { bill, trigger, metadata } = notification;
	const { role, amount } = metadata.current;

	return `You’ve been added to the bill **${bill.description}** by **${trigger.fullName}** as a **${role}** with an amount of **${amount}**.`;
}

function renderBillDeletedMessage(notification: BillDeletedNotification) {
	const { bill, trigger, metadata } = notification;
	const { role } = metadata.previous;

	return `You’ve been removed as a **${role}** from the bill **${bill.description}** by **${trigger.fullName}**.`;
}

function renderBillUpdatedMessage(notification: BillUpdatedNotification) {
	const { bill, trigger, metadata } = notification;
	const { current, previous } = metadata;

	return `Your amount in the bill **${bill.description}** has been updated from **${previous.amount}** to **${current.amount}** by **${trigger.fullName}**. Please review the change.`;
}

function transformMessage(text: string) {
	const parts = text.split(/(\*\*.+?\*\*)/);

	return parts.map((part, index) => {
		if (part.startsWith("**") && part.endsWith("**")) {
			return <strong key={index}>{part.slice(2, -2)}</strong>;
		}

		return part;
	});
}
