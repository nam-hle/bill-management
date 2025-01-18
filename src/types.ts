import type React from "react";

import { type Database } from "@/database.types";

export interface Container {
	children: React.ReactNode;
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
	editing?: boolean;
	description: string;
	createdAt: string | null;
	updatedAt: string | null;
	creditor?: {
		user?: { id: string };
		amount?: number;
	};
	debtors: Array<{
		user?: { id: string };
		amount?: number;
	}>;
}

export enum FormKind {
	CREATE = "create",
	UPDATE = "update"
}

export interface UserFormState {
	username?: string;
}

export interface ClientBill {
	readonly id: string;
	readonly description: string;
	readonly updatedAt: string | null;
	readonly createdAt: string | null;
	readonly bill_members: ClientBillMember[];
	readonly creator: { username: string | null; fullName: string | null };
}

export interface ClientBillMember {
	id?: string;
	amount: number;
	role: BillMemberRole;
	user: {
		id: string;
		fullName: string | null;
		username: string | null;
	};
}
export namespace ClientBillMember {
	export function isEqual(a: ClientBillMember, b: ClientBillMember) {
		return a.user.id === b.user.id && a.role === b.role;
	}
}

export type BillMemberRole = Database["public"]["Enums"]["BillMemberRole"];
export type NotificationType = Database["public"]["Enums"]["NotificationType"];
