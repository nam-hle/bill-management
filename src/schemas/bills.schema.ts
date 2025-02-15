import { z } from "zod";

import type { Database } from "@/database.types";

export const BillMemberRoleSchema = z.enum(["Creditor", "Debtor"] as const satisfies Database["public"]["Enums"]["BillMemberRole"][]);
export type BillMemberRole = z.infer<typeof BillMemberRoleSchema>;

export const ClientBillMemberSchema = z.object({
	userId: z.string(),
	amount: z.number(),
	fullName: z.string(),
	role: BillMemberRoleSchema
});
export type ClientBillMember = z.infer<typeof ClientBillMemberSchema>;
export namespace ClientBillMember {
	export function isEqual(a: Omit<ClientBillMember, "fullName">, b: Omit<ClientBillMember, "fullName">) {
		return a.userId === b.userId && a.role === b.role;
	}
}

export const ClientBillSchema = z.object({
	id: z.string(),
	issuedAt: z.string(),
	creditor: ClientBillMemberSchema,
	receiptFile: z.string().nullable(),
	debtors: z.array(ClientBillMemberSchema),
	description: z.string().max(50, "Description is too long").min(1, "Description is required"),
	creator: z.object({ userId: z.string(), timestamp: z.string(), fullName: z.string().nullable() }),
	updater: z.object({ userId: z.string(), timestamp: z.string(), fullName: z.string().nullable() }).optional()
});
export type ClientBill = z.infer<typeof ClientBillSchema>;
