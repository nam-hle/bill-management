import { z } from "zod";

import { axiosInstance } from "@/services";
import { DEFAULT_PAGE_NUMBER } from "@/constants";
import {
	type ClientBill,
	ClientBillSchema,
	ClientUserSchema,
	BankAccountSchema,
	ClientTransactionSchema,
	type ProfileFormPayload,
	ClientNotificationSchema
} from "@/schemas";

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

	export namespace Users {
		export namespace List {
			export const ResponseSchema = DataListResponseSchema(ClientUserSchema);
			export type Response = z.infer<typeof ResponseSchema>;

			export async function query() {
				const { data } = await axiosInstance<Response>("/users");

				return data;
			}
		}
	}

	export namespace Bills {
		export namespace Get {
			export async function query(params: { billId: string }) {
				const { data } = await axiosInstance<ClientBill>(`/bills/${params.billId}`);

				return data;
			}
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

		export namespace Create {
			export async function mutate(params: { bill: UpsertBill }) {
				await axiosInstance.post<Body>(`/bills`, params.bill);
			}
		}

		export namespace Update {
			export interface Payload {
				readonly id: string;
				readonly bill: UpsertBill;
			}

			export async function mutate(payload: Payload) {
				await axiosInstance.put<UpsertBill>(`/bills/${payload.id}`, payload.bill);
			}
		}

		export namespace List {
			export const SearchParamsSchema = z.object({
				q: z.string().optional(),
				debtor: z.literal("me").optional(),
				creator: z.literal("me").optional(),
				creditor: z.literal("me").optional(),
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

			export async function mutation(payload: Body) {
				await axiosInstance.post("/transactions", payload);
			}
		}

		export namespace Update {
			export async function mutate(payload: { transactionId: string; action: "confirm" | "decline" }) {
				await axiosInstance.patch(`/transactions/${payload.transactionId}/${payload.action}`);
			}
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
		export namespace Create {
			export const BodySchema = z.object({
				amount: z.number(),
				bankAccountId: z.string()
			});

			export type Body = z.infer<typeof BodySchema>;

			export async function mutate(payload: Body) {
				const { data } = await axiosInstance.post("/qr", payload);

				return data as { url: string };
			}
		}
	}

	export namespace Profile {
		export namespace Update {
			export async function mutate(payload: ProfileFormPayload): Promise<ProfileFormPayload> {
				const { data } = await axiosInstance.post("/profile", payload);

				return data;
			}
		}
	}

	export namespace Storage {
		export type BucketName = "avatars" | "receipts";

		export async function downloadFile(bucketName: BucketName, path: string | undefined): Promise<string | undefined> {
			if (!path) {
				return undefined;
			}

			try {
				const response = await axiosInstance.get(`/storage`, { responseType: "blob", params: { path, bucketName } });

				return URL.createObjectURL(response.data);
			} catch (error) {
				// eslint-disable-next-line no-console
				console.error("Error downloading image:", error);
			}

			return undefined;
		}
	}
}
