import { z } from "zod";
import type React from "react";

import { type API } from "@/api";
import { type Database } from "@/database.types";
import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE_NUMBER } from "@/constants";

export const BillMemberRoleEnumSchema = z.enum(["Creditor", "Debtor"] as const satisfies Database["public"]["Enums"]["BillMemberRole"][]);
export type BillMemberRole = z.infer<typeof BillMemberRoleEnumSchema>;

export interface Container {
	children: React.ReactNode;
}

export interface Pagination {
	readonly pageSize: number;
	/** 1-based */
	readonly pageNumber: number;
}
export namespace Pagination {
	export function getDefault(): Pagination {
		return { pageSize: DEFAULT_PAGE_SIZE, pageNumber: DEFAULT_PAGE_NUMBER };
	}

	export function toRange(pagination: Pagination): [number, number] {
		const start = (pagination.pageNumber - 1) * pagination.pageSize;
		const end = start + pagination.pageSize - 1;

		return [start, end];
	}
}

export const ClientUserSchema = z.object({
	id: z.string(),
	username: z.string(),
	fullName: z.string()
});

export type ClientUser = z.infer<typeof ClientUserSchema>;

export const BillFormPayloadSchema = z.object({
	issuedAt: z.string(),
	description: z.string(),
	receiptFile: z.string().nullable(),
	creditor: z.object({ userId: z.string(), amount: z.number() }),
	debtors: z.array(z.object({ userId: z.string(), amount: z.number() }))
});

export type BillFormTransfer = z.infer<typeof BillFormPayloadSchema>;

export const ProfileFormPayloadSchema = z.object({
	fullName: z.string(),
	avatarUrl: z.string().nullable()
});

export type ProfileFormPayload = z.infer<typeof ProfileFormPayloadSchema>;

export interface BillFormState {
	description: string;
	issuedAt: string | null;
	receiptFile: string | null;
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

export type ClientTransaction = z.infer<typeof API.Transactions.ClientTransactionSchema>;

export const ClientBillMemberSchema = z.object({
	userId: z.string(),
	amount: z.number(),
	role: BillMemberRoleEnumSchema,
	fullName: z.string().nullable()
});

export const ClientBillSchema = z.object({
	id: z.string(),
	description: z.string(),
	issuedAt: z.string().nullable(),
	creditor: ClientBillMemberSchema,
	receiptFile: z.string().nullable(),
	debtors: z.array(ClientBillMemberSchema),
	creator: z.object({ userId: z.string(), timestamp: z.string(), fullName: z.string().nullable() }),
	updater: z.object({ userId: z.string(), timestamp: z.string(), fullName: z.string().nullable() }).optional()
});

export type ClientBill = z.infer<typeof ClientBillSchema>;

export type ClientBillMember = z.infer<typeof ClientBillMemberSchema>;
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

export const LoginFormPayloadSchema = z.object({
	email: z.string().min(1, "Email is required"),
	password: z.string().min(6, "Password must be at least 6 characters")
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
}

export interface UserInfo {
	readonly fullName: string;
	readonly avatarUrl?: string;
}

export interface DataListResponse<T> {
	readonly data: T[];
	readonly fullSize: number;
}
