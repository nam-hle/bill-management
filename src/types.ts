import { z } from "zod";
import type React from "react";

import { type Database } from "@/database.types";

export interface Container {
	children: React.ReactNode;
}

export interface Pagination {
	readonly pageSize: number;
	readonly pageNumber: number;
}
export namespace Pagination {
	export function toRange(pagination: Pagination): [number, number] {
		const start = (pagination.pageNumber - 1) * pagination.pageSize;
		const end = start + pagination.pageSize - 1;

		return [start, end];
	}
}

export type ClientUser = Pick<Database["public"]["Tables"]["profiles"]["Row"], "id" | "username" | "fullName">;
export type ServerNotification = Omit<Database["public"]["Tables"]["notifications"]["Row"], "billId" | "metadata" | "triggerId">;

export interface BaseClientNotification extends ServerNotification {
	readonly type: NotificationType;
	readonly trigger: { username: string | null; fullName: string | null };
}

export interface BillCreatedNotification extends BaseClientNotification {
	readonly bill: ClientBill;
	readonly type: "BillCreated";
	readonly metadata: BillCreatedNotificationMetadata;
}

export interface BillDeletedNotification extends BaseClientNotification {
	readonly bill: ClientBill;
	readonly type: "BillDeleted";
	readonly metadata: BillDeletedNotificationMetadata;
}

export interface BillUpdatedNotification extends BaseClientNotification {
	readonly bill: ClientBill;
	readonly type: "BillUpdated";
	readonly metadata: BillUpdatedNotificationMetadata;
}

export interface TransactionWaitingNotification extends BaseClientNotification {
	readonly type: "TransactionWaiting";
	readonly transaction: ClientTransaction;
}

export interface TransactionConfirmedNotification extends BaseClientNotification {
	readonly type: "TransactionConfirmed";
	readonly transaction: ClientTransaction;
}

export interface TransactionDeclinedNotification extends BaseClientNotification {
	readonly type: "TransactionDeclined";
	readonly transaction: ClientTransaction;
}

export type ClientNotification =
	| BillCreatedNotification
	| BillUpdatedNotification
	| BillDeletedNotification
	| TransactionWaitingNotification
	| TransactionConfirmedNotification
	| TransactionDeclinedNotification;

export const BillFormPayloadSchema = z.object({
	issuedAt: z.string(),
	description: z.string(),
	creditor: z.object({ userId: z.string(), amount: z.number() }),
	debtors: z.array(z.object({ userId: z.string(), amount: z.number() }))
});

export type BillFormTransfer = z.infer<typeof BillFormPayloadSchema>;

export interface BillFormState {
	description: string;
	issuedAt: string | null;
	debtors: Array<{
		userId?: string;
		amount?: number;
	}>;
	creditor: {
		userId?: string;
		amount?: number;
		fullName?: string | null;
	};
}

export interface ErrorState {
	readonly error: string | undefined;
}

export enum FormKind {
	CREATE = "create",
	UPDATE = "update"
}

export interface UserFormState {
	username?: string;
}

export interface Balance {
	readonly net: number;
	readonly owed: number;
	readonly paid: number;
	readonly sent: number;
	readonly received: number;
}

export interface ClientTransaction {
	readonly id: string;
	readonly amount: number;
	readonly issuedAt: string;
	readonly createdAt: string;
	readonly sender: ClientUser;
	readonly receiver: ClientUser;
	readonly status: TransactionStatus;
}

export interface ClientBill {
	readonly id: string;
	readonly description: string;
	readonly issuedAt: string | null;
	readonly creditor: ClientBillMember;
	readonly debtors: ClientBillMember[];
	readonly creator: { userId: string; timestamp: string; fullName: string | null };
	readonly updater?: { userId: string; timestamp: string; fullName: string | null };
}

export interface ClientBillMember {
	readonly userId: string;
	readonly amount: number;
	readonly role: BillMemberRole;
	readonly fullName: string | null;
}
export namespace ClientBillMember {
	export function isEqual(a: Omit<ClientBillMember, "fullName">, b: Omit<ClientBillMember, "fullName">) {
		return a.userId === b.userId && a.role === b.role;
	}
}

export const TransactionStatusEnumSchema = z.enum([
	"Waiting",
	"Confirmed",
	"Declined"
] as const satisfies Database["public"]["Enums"]["TransactionStatus"][]);
export type TransactionStatus = z.infer<typeof TransactionStatusEnumSchema>;

const BillMemberRoleEnumSchema = z.enum(["Creditor", "Debtor"] as const satisfies Database["public"]["Enums"]["BillMemberRole"][]);
export type BillMemberRole = z.infer<typeof BillMemberRoleEnumSchema>;

export type NotificationType = Database["public"]["Enums"]["NotificationType"];

export const BillCreatedNotificationMetadataSchema = z.object({
	previous: z.object({}),
	current: z.object({ amount: z.number(), role: BillMemberRoleEnumSchema })
});

export type BillCreatedNotificationMetadata = z.infer<typeof BillCreatedNotificationMetadataSchema>;

export const BillDeletedNotificationMetadataSchema = z.object({
	current: z.object({}),
	previous: z.object({ role: BillMemberRoleEnumSchema })
});
export type BillDeletedNotificationMetadata = z.infer<typeof BillDeletedNotificationMetadataSchema>;

export const BillUpdatedNotificationMetadataSchema = z.object({
	current: z.object({ amount: z.number() }),
	previous: z.object({ amount: z.number() })
});
export type BillUpdatedNotificationMetadata = z.infer<typeof BillUpdatedNotificationMetadataSchema>;

export const LoginFormPayloadSchema = z.object({
	email: z.string(),
	password: z.string()
});

export type LoginFormPayload = z.infer<typeof LoginFormPayloadSchema>;

export const NotificationsQuerySchema = z.union([z.object({ before: z.string() }), z.object({ after: z.string().nullable() })]);

export type NotificationsQuery = z.infer<typeof NotificationsQuerySchema>;

export namespace APIPayload {
	export namespace Notification {
		export const ReadNotificationResponseSchema = z.object({
			unreadCount: z.number()
		});

		export type ReadNotificationResponse = z.infer<typeof ReadNotificationResponseSchema>;
	}

	export namespace Transaction {
		export const CreateTransactionRequestPayloadSchema = z.object({
			amount: z.number(),
			issuedAt: z.string(),
			receiverId: z.string()
		});

		export type CreateTransactionRequestPayload = z.infer<typeof CreateTransactionRequestPayloadSchema>;
	}
}
