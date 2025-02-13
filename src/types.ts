import type React from "react";

import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE_NUMBER } from "@/constants";

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

export interface BillFormState {
	description: string;
	issuedAt: string | null;
	receiptFile: string | null;
	debtors: Array<{ userId?: string; amount?: number }>;
	creditor: { userId?: string; amount?: number; fullName?: string | null };
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

export interface UserInfo {
	readonly fullName: string;
	readonly avatarUrl?: string;
}
