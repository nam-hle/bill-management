import { z } from "zod";

import type { Database } from "@/database.types";

export const BankAccountStatusEnumSchema = z.enum(["Active", "Inactive"] as const satisfies Database["public"]["Enums"]["BankAccountStatus"][]);
export type BankAccountStatus = z.infer<typeof BankAccountStatusEnumSchema>;

const BankAccountTypeEnumSchema = z.enum(["Bank", "Wallet"] as const satisfies Database["public"]["Enums"]["BankAccountType"][]);
export type BankAccountType = z.infer<typeof BankAccountTypeEnumSchema>;

export const BankAccountSchema = z.object({
	id: z.string(),
	userId: z.string(),
	createdAt: z.string(),
	isDefault: z.boolean(),
	providerName: z.string(),
	accountNumber: z.string(),
	accountHolder: z.string(),
	providerNumber: z.number(),
	type: BankAccountTypeEnumSchema,
	status: BankAccountStatusEnumSchema
});

export type BankAccount = z.infer<typeof BankAccountSchema>;
