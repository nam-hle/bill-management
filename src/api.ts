import { z } from "zod";

import { axiosInstance } from "@/axios";
import type { APIPayload } from "@/types";
import { DEFAULT_PAGE_NUMBER } from "@/constants";
import { ClientTransactionSchema } from "@/schemas/transactions.schema";
import { ClientNotificationSchema } from "@/schemas/notification.schema";

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
				before: z.string().optional()
			});

			export type SearchParams = z.infer<typeof SearchParamsSchema>;

			export const ResponseSchema = z.object({
				hasOlder: z.boolean().optional(),
				count: z.number().int().nonnegative(),
				notifications: z.array(ClientNotificationSchema)
			});
			export type Response = z.infer<typeof ResponseSchema>;

			export function request(params: SearchParams) {
				return async () => {
					const { data } = await axiosInstance<Response>("/notifications", { params });

					return data;
				};
			}
		}

		export namespace ReadSingle {
			export const ResponseSchema = z.object({
				unreadCount: z.number().int().nonnegative()
			});
			export type Response = z.infer<typeof ResponseSchema>;

			export async function mutate(payload: { notificationId: string }) {
				const { data } = await axiosInstance.patch<APIPayload.Notification.ReadNotificationResponse>(`/notifications/${payload.notificationId}/read`);

				return data;
			}
		}

		export namespace ReadAll {
			export async function mutate() {
				await axiosInstance.patch<APIPayload.Notification.ReadNotificationResponse>(`/notifications/read-all`);
			}
		}
	}

	export namespace Transactions {
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
