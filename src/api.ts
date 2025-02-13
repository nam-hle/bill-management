import { z } from "zod";

import { axiosInstance } from "@/services";
import { DEFAULT_PAGE_NUMBER } from "@/constants";
import { ClientBillSchema, BankAccountSchema, ClientTransactionSchema, ClientNotificationSchema } from "@/schemas";

export namespace API {
	export const DataListResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
		z.object({
			data: z.array(itemSchema),
			fullSize: z.number().int().nonnegative()
		});

	export namespace Notifications {
		export namespace List {
			export const SearchParamsSchema = z.object({
				after: z.string().optional(),
				before: z.string().optional(),
				page: z.coerce.number().int().positive().optional()
			});

			export type SearchParams = z.infer<typeof SearchParamsSchema>;

			export const ResponseSchema = z.object({
				hasOlder: z.boolean().optional(),
				fullSize: z.number().int().nonnegative(),
				unreadCount: z.number().int().nonnegative(),
				notifications: z.array(ClientNotificationSchema)
			});
			export type Response = z.infer<typeof ResponseSchema>;

			export async function query(params: SearchParams) {
				const { data } = await axiosInstance<Response>("/notifications", { params });

				return data;
			}
		}

		export const ReadResponseSchema = z.object({
			unreadCount: z.number()
		});

		export type ReadResponse = z.infer<typeof ReadResponseSchema>;

		export namespace ReadSingle {
			export const ResponseSchema = z.object({
				unreadCount: z.number().int().nonnegative()
			});
			export type Response = z.infer<typeof ResponseSchema>;

			export async function mutate(payload: { notificationId: string }) {
				const { data } = await axiosInstance.patch<ReadResponse>(`/notifications/${payload.notificationId}/read`);

				return data;
			}
		}

		export namespace ReadAll {
			export async function mutate() {
				await axiosInstance.patch<ReadResponse>(`/notifications/read-all`);
			}
		}
	}

	export namespace Bills {
		export namespace List {
			export const SearchParamsSchema = z.object({
				textSearch: z.string().optional(),
				debtorId: z.literal("me").optional(),
				creatorId: z.literal("me").optional(),
				creditorId: z.literal("me").optional(),
				since: z.enum(["7d", "30d"]).optional(),
				page: z.coerce.number().int().positive().optional().default(DEFAULT_PAGE_NUMBER)
			});
			export type SearchParams = z.infer<typeof SearchParamsSchema>;

			export const ResponseSchema = DataListResponseSchema(ClientBillSchema);
			export type Response = z.infer<typeof ResponseSchema>;

			export async function query(params: SearchParams) {
				const { data } = await axiosInstance<Response>("/bills", { params });

				return data;
			}
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

			export async function query() {
				const { data } = await axiosInstance.post<Response>("/transactions/suggest");

				return data;
			}
		}
		export namespace List {
			export const SearchParamsSchema = z.object({
				senderId: z.string().optional(),
				receiverId: z.string().optional(),
				page: z.coerce.number().int().positive().optional().default(DEFAULT_PAGE_NUMBER)
			});
			export type SearchParams = z.infer<typeof SearchParamsSchema>;

			export const ResponseSchema = DataListResponseSchema(ClientTransactionSchema);
			export type Response = z.infer<typeof ResponseSchema>;

			export async function query(params: SearchParams) {
				const { data } = await axiosInstance.get<Response>("/transactions", { params });

				return data;
			}
		}

		export namespace Create {
			export const BodySchema = z.object({
				amount: z.number(),
				issuedAt: z.string(),
				bankAccountId: z.string().optional(),
				receiverId: z.string().min(1, "Receiver is required")
			});

			export type Body = z.infer<typeof BodySchema>;
		}
	}

	export namespace BankAccounts {
		export namespace List {
			export const SearchParamsSchema = z.object({
				userId: z.string()
			});

			export type SearchParams = z.infer<typeof SearchParamsSchema>;

			export const ResponseSchema = z.array(BankAccountSchema);
			export type Response = z.infer<typeof ResponseSchema>;

			export async function query(params: SearchParams) {
				const { data } = await axiosInstance<Response>("/bank-accounts", { params });

				return data;
			}
		}
	}

	export namespace QR {
		export namespace Get {
			export const QueryParamsSchema = z.object({
				amount: z.number(),
				bankAccountId: z.string()
			});

			export type QueryParams = z.infer<typeof QueryParamsSchema>;
		}
	}
}
