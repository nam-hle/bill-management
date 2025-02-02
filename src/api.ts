import { z } from "zod";

import { DEFAULT_PAGE_NUMBER } from "@/constants";
import { ClientUserSchema, TransactionStatusEnumSchema } from "@/types";

export namespace API {
	export const DataListResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
		z.object({
			data: z.array(itemSchema),
			fullSize: z.number().int().nonnegative()
		});

	export namespace Transactions {
		export const ClientTransactionSchema = z.object({
			id: z.string(),
			amount: z.number(),
			issuedAt: z.string(),
			createdAt: z.string(),
			sender: ClientUserSchema,
			receiver: ClientUserSchema,
			status: TransactionStatusEnumSchema
		});

		export namespace List {
			export const SearchParamsSchema = z.object({
				senderId: z.string().optional(),
				receiverId: z.string().optional(),
				page: z.coerce.number().int().positive().optional().default(DEFAULT_PAGE_NUMBER)
			});
			export type SearchParams = z.infer<typeof SearchParamsSchema>;

			export const ResponseSchema = DataListResponseSchema(ClientTransactionSchema);
			export type Response = z.infer<typeof ResponseSchema>;
		}

		export namespace Create {
			export const BodySchema = z.object({
				amount: z.number(),
				issuedAt: z.string(),
				receiverId: z.string().min(1, "Receiver is required")
			});

			export type Body = z.infer<typeof BodySchema>;
		}
	}
}
