import { z } from "zod";

import type { Database } from "@/database.types";

export const BillMemberRoleEnumSchema = z.enum(["Creditor", "Debtor"] as const satisfies Database["public"]["Enums"]["BillMemberRole"][]);
export type BillMemberRole = z.infer<typeof BillMemberRoleEnumSchema>;

export const ClientBillMemberSchema = z.object({
	userId: z.string(),
	amount: z.number(),
	role: BillMemberRoleEnumSchema,
	fullName: z.string().nullable()
});
export type ClientBillMember = z.infer<typeof ClientBillMemberSchema>;
export namespace ClientBillMember {
	export function isEqual(a: Omit<ClientBillMember, "fullName">, b: Omit<ClientBillMember, "fullName">) {
		return a.userId === b.userId && a.role === b.role;
	}
}

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

export const BillCreationPayloadSchema = z.object({
	issuedAt: z.string(),
	description: z.string(),
	receiptFile: z.string().nullable(),
	creditor: z.object({ userId: z.string(), amount: z.number() }),
	debtors: z.array(z.object({ userId: z.string(), amount: z.number() }))
});
export type BillCreationPayload = z.infer<typeof BillCreationPayloadSchema>;
