import { z } from "zod";

import { DEFAULT_PAGE_NUMBER } from "@/constants";
import {
	ClientBillSchema,
	ClientUserSchema,
	BankAccountSchema,
	ClientTransactionSchema,
	ClientNotificationSchema,
	TransactionStatusEnumSchema
} from "@/schemas";

export namespace API {
	export const DataListResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
		z.object({
			data: z.array(itemSchema),
			fullSize: z.number().int().nonnegative()
		});

	export namespace Notifications {
		export namespace List {
			export const PayloadSchema = z.object({
				after: z.string().optional(),
				before: z.string().optional(),
				page: z.coerce.number().int().positive().optional()
			});

			export type Payload = z.infer<typeof PayloadSchema>;

			export const ResponseSchema = z.object({
				hasOlder: z.boolean().optional(),
				fullSize: z.number().int().nonnegative(),
				unreadCount: z.number().int().nonnegative(),
				notifications: z.array(ClientNotificationSchema)
			});
			export type Response = z.infer<typeof ResponseSchema>;
		}

		export namespace ReadSingle {
			export const PayloadSchema = z.object({
				notificationId: z.string()
			});
			export const ResponseSchema = z.object({
				unreadCount: z.number().int().nonnegative()
			});
		}
	}

	export namespace Users {
		export namespace List {
			export const ResponseSchema = DataListResponseSchema(ClientUserSchema);
			export type Response = z.infer<typeof ResponseSchema>;
		}
	}

	export namespace Bills {
		export namespace Get {
			export const PayloadSchema = z.object({ id: z.string() });
		}

		export const UpsertBillMemberSchema = z.object({ userId: z.string(), amount: z.number() });

		export const UpsertBillSchema = z.object({
			// TODO: Validate
			issuedAt: z.string(),
			creditor: UpsertBillMemberSchema,
			receiptFile: z.string().nullable(),
			debtors: z.array(UpsertBillMemberSchema),
			description: z.string().max(50, "Description is too long").min(1, "Description is required")
		});

		export type UpsertBill = z.infer<typeof UpsertBillSchema>;

		export namespace Update {
			export const PayloadSchema = UpsertBillSchema.extend({ id: z.string() });
		}

		export namespace List {
			export const PayloadSchema = z.object({
				q: z.string().optional(),
				debtor: z.literal("me").optional(),
				creator: z.literal("me").optional(),
				creditor: z.literal("me").optional(),
				since: z.enum(["7d", "30d"]).optional(),
				page: z.coerce.number().int().positive().optional().default(DEFAULT_PAGE_NUMBER)
			});
			export type Payload = z.infer<typeof PayloadSchema>;

			export const ResponseSchema = DataListResponseSchema(ClientBillSchema);
			export type Response = z.infer<typeof ResponseSchema>;
		}
	}

	export namespace Transactions {
		export namespace Suggestion {
			export const ResponseSchema = z.object({
				suggestion: z
					.object({
						amount: z.number(),
						receiverId: z.string(),
						bankAccountId: z.string()
					})
					.optional()
			});

			export type Response = z.infer<typeof ResponseSchema>;
		}
		export namespace List {
			export const PayloadSchema = z.object({
				senderId: z.string().optional(),
				receiverId: z.string().optional(),
				page: z.coerce.number().int().positive().optional().default(DEFAULT_PAGE_NUMBER)
			});

			export const ResponseSchema = DataListResponseSchema(ClientTransactionSchema);
			export type Response = z.infer<typeof ResponseSchema>;
		}

		export namespace Create {
			export const PayloadSchema = z.object({
				amount: z.number(),
				issuedAt: z.string(),
				bankAccountId: z.string().optional(),
				receiverId: z.string().min(1, "Receiver is required")
			});
		}

		export namespace Update {
			export const PayloadSchema = z.object({
				transactionId: z.string(),
				status: TransactionStatusEnumSchema.exclude(["Waiting"])
			});
			export type Payload = z.infer<typeof PayloadSchema>;
		}
	}

	export namespace BankAccounts {
		export namespace List {
			export const SearchParamsSchema = z.object({
				userId: z.string()
			});

			export const ResponseSchema = z.array(BankAccountSchema);
		}
	}

	export namespace QR {
		export namespace Create {
			export const BodySchema = z.object({
				amount: z.number(),
				bankAccountId: z.string()
			});
		}
	}

	export namespace Banks {
		export namespace List {
			export const BankSchema = z.object({
				providerName: z.string(),
				providerNumber: z.string()
			});

			export const ResponseSchema = z.array(BankSchema);
		}
	}

	export namespace Storage {}
}
