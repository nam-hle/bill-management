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
}

export interface BillUpdatedNotification extends BaseClientNotification {
	readonly bill: ClientBill;
	readonly type: "BillUpdated";
	readonly metadata: Record<"previous" | "current", { amount?: number }>;
}

export type ClientNotification = BillCreatedNotification | BillUpdatedNotification;

export interface BillFormState {
	id?: string;
	kind: FormKind;
	description: string;
	createdAt: string | null;
	updatedAt: string | null;
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
}

export interface ClientBill {
	readonly id: string;
	readonly description: string;
	readonly updatedAt: string | null;
	readonly createdAt: string | null;
	readonly creditor: ClientBillMember;
	readonly debtors: ClientBillMember[];
	readonly creator: { userId: string; fullName: string | null };
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

export type BillMemberRole = Database["public"]["Enums"]["BillMemberRole"];
export type NotificationType = Database["public"]["Enums"]["NotificationType"];
