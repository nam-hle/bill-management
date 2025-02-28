import { z } from "zod";

import type { Database } from "@/database.types";

export const BankAccountStatusEnumSchema = z.enum(["Active", "Inactive"] as const satisfies Database["public"]["Enums"]["BankAccountStatus"][]);
// type BankAccountStatus = z.infer<typeof BankAccountStatusEnumSchema>;

const BankAccountTypeEnumSchema = z.enum(["Bank", "Wallet"] as const satisfies Database["public"]["Enums"]["BankAccountType"][]);
// export type BankAccountType = z.infer<typeof BankAccountTypeEnumSchema>;

export const BankAccountCreatePayloadSchema = z.object({
	providerNumber: z.string(),

	accountNumber: z.string(),
	accountHolder: z.string(),

	isDefault: z.boolean(),
	type: BankAccountTypeEnumSchema,
	status: BankAccountStatusEnumSchema
});
export type BankAccountCreatePayload = z.infer<typeof BankAccountCreatePayloadSchema>;

export const BankAccountSchema = BankAccountCreatePayloadSchema.extend({
	id: z.string(),
	userId: z.string(),
	createdAt: z.string()
});

export type BankAccount = z.infer<typeof BankAccountSchema>;
