import { type API } from "@/api";
import { DEFAULT_PAGE_NUMBER } from "@/constants";
import { getCurrentUser, type SupabaseInstance } from "@/supabase/server";
import { NotificationsControllers } from "@/controllers/notifications.controllers";
import { Pagination, type TransactionStatus, type ClientTransaction } from "@/types";

export namespace TransactionsControllers {
	const TRANSACTIONS_SELECT = `
    id,
    createdAt:created_at,
    issuedAt:issued_at,
    amount,
    status,
    sender:profiles!sender_id (userId:id, username, fullName:full_name),
    receiver:profiles!receiver_id (userId:id, username, fullName:full_name)
  `;

	export async function create(supabase: SupabaseInstance, payload: { amount: number; issuedAt: string; senderId: string; receiverId: string }) {
		const { issuedAt: issued_at, senderId: sender_id, receiverId: receiver_id, ...rest } = payload;
		const { data, error } = await supabase
			.from("transactions")
			.insert({ ...rest, issued_at, sender_id, receiver_id })
			.select("id")
			.single();

		if (error) {
			throw error;
		}

		if (!data) {
			throw new Error("Error creating transaction");
		}

		await NotificationsControllers.createTransaction(supabase, {
			status: "Waiting",
			userId: receiver_id,
			triggerId: sender_id,
			transactionId: data.id
		});

		return data;
	}

	export async function getMany(
		supabase: SupabaseInstance,
		filters?: {
			senderId?: string;
			pageNumber?: number;
			receiverId?: string;
		}
	): Promise<API.Transactions.List.Response> {
		const finalQuery = supabase.from("transactions").select(TRANSACTIONS_SELECT, { count: "exact" });

		const currentUser = await getCurrentUser();

		const { senderId, pageNumber, receiverId } = filters ?? {};

		if (senderId) {
			finalQuery.eq("sender_id", senderId);
		} else if (receiverId) {
			finalQuery.eq("receiver_id", receiverId);
		} else {
			finalQuery.or(`sender_id.eq.${currentUser.id},receiver_id.eq.${currentUser.id}`);
		}

		const {
			count,
			error,
			data: transactions
		} = await finalQuery
			.order("issued_at", { ascending: false })
			.range(...Pagination.toRange({ ...Pagination.getDefault(), pageNumber: pageNumber ?? DEFAULT_PAGE_NUMBER }));

		if (error) {
			throw error;
		}

		return { fullSize: count ?? 0, data: transactions?.map(toClientTransaction) ?? [] };
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async function __get(supabase: SupabaseInstance) {
		const { data } = await supabase.from("transactions").select(TRANSACTIONS_SELECT).single();

		if (!data) {
			throw new Error("Bill not found");
		}

		return data;
	}

	type TransactionSelectResult = Awaited<ReturnType<typeof __get>>;

	function toClientTransaction(transaction: TransactionSelectResult): ClientTransaction {
		const { sender, receiver, ...rest } = transaction;

		return {
			...rest,
			sender: { id: sender.userId, username: sender.username, fullName: sender.fullName },
			receiver: { id: receiver.userId, username: receiver.username, fullName: receiver.fullName }
		};
	}

	export interface UpdatePayload {
		readonly id: string;
		readonly status: Exclude<TransactionStatus, "Waiting">;
	}

	export async function update(supabase: SupabaseInstance, payload: UpdatePayload) {
		const { id, status } = payload;
		const { data, error } = await supabase.from("transactions").update({ status }).eq("id", id).select(TRANSACTIONS_SELECT).single();

		if (error) {
			throw error;
		}

		if (status === "Confirmed") {
			await NotificationsControllers.createTransaction(supabase, {
				status,
				transactionId: id,
				userId: data.sender.userId,
				triggerId: data.receiver.userId
			});
		} else if (status === "Declined") {
			await NotificationsControllers.createTransaction(supabase, {
				status,
				transactionId: id,
				userId: data.receiver.userId,
				triggerId: data.sender.userId
			});
		} else {
			throw new Error("Invalid status");
		}
	}

	export async function getById(supabase: SupabaseInstance, id: string): Promise<ClientTransaction> {
		const { data } = await supabase.from("transactions").select(TRANSACTIONS_SELECT).eq("id", id).single();

		if (!data) {
			throw `Bill with id ${id} not found`;
		}

		return toClientTransaction(data);
	}

	export async function getByUserId(
		supabase: SupabaseInstance,
		payload: { userId: string; pagination: Pagination }
	): Promise<{ count: number; transactions: ClientTransaction[] }> {
		const { userId, pagination } = payload;
		const { data, count } = await supabase
			.from("transactions")
			.select(TRANSACTIONS_SELECT, { count: "exact" })
			.or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
			.range(...Pagination.toRange(pagination));

		if (!data || count === null) {
			throw new Error("Error fetching transactions");
		}

		return { count, transactions: data.map(toClientTransaction) };
	}

	export async function report(supabase: SupabaseInstance, userId: string): Promise<{ sent: number; received: number }> {
		const { data: received } = await supabase.from("transactions").select("amount.sum()").eq("receiver_id", userId).neq("status", "Declined");
		const { data: sent } = await supabase.from("transactions").select("amount.sum()").eq("sender_id", userId).neq("status", "Confirmed");

		return { sent: sent?.[0].sum ?? 0, received: received?.[0].sum ?? 0 };
	}
}
