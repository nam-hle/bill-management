import type React from "react";

import { type Database } from "@/database.types";

export interface Container {
	children: React.ReactNode;
}

export type ClientUser = Pick<Database["public"]["Tables"]["profiles"]["Row"], "id" | "username" | "fullName">;
export type ServerNotification = Database["public"]["Tables"]["notifications"]["Row"];

export interface BaseClientNotification extends ServerNotification {
	readonly type: NotificationType;
}

export interface BillCreatedNotification extends BaseClientNotification {
	readonly bill: ClientBill;
	readonly type: "BillCreated";
}

export type ClientNotification = BillCreatedNotification;

export interface BillFormState {
	id?: string;
	createdAt?: string;
	description: string;
	creditor?: {
		userId?: string;
		amount?: number;
	};
	debtors: Array<{
		userId?: string;
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
	readonly bill_members: ClientBillMember[];
	readonly creator: { username: string | null };
}

export interface ClientBillMember {
	id?: string;
	userId: string;
	amount: number;
	role: BillMemberRole;
}
export namespace ClientBillMember {
	export function isEqual(a: ClientBillMember, b: ClientBillMember) {
		return a.userId === b.userId && a.role === b.role;
	}
}

export type BillMemberRole = Database["public"]["Enums"]["BillMemberRole"];
export type NotificationType = Database["public"]["Enums"]["NotificationType"];
