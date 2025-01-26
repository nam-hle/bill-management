import { type SupabaseInstance } from "@/supabase/server";
import { type TransactionStatus, type ClientTransaction } from "@/types";
import { NotificationsControllers } from "@/controllers/notifications.controllers";

export namespace TransactionsControllers {
	const TRANSACTIONS_SELECT = `
    id,
    createdAt:created_at,
    issuedAt:issued_at,
    amount,
    status,
    sender:profiles!sender_id (userId:id, username, fullName),
    receiver:profiles!receiver_id (userId:id, username, fullName)
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

	export async function getMany(supabase: SupabaseInstance): Promise<{ fullSize: number; transactions: ClientTransaction[] }> {
		const finalQuery = supabase.from("transactions").select(TRANSACTIONS_SELECT, { count: "exact" });

		const { count, error, data: transactions } = await finalQuery.order("issued_at", { ascending: false });

		if (error) {
			throw error;
		}

		return { fullSize: count ?? 0, transactions: transactions?.map(toClientTransaction) ?? [] };
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
			sender: { id: sender.userId, fullName: sender.fullName, username: sender.username },
			receiver: { id: receiver.userId, fullName: receiver.fullName, username: receiver.username }
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

		await NotificationsControllers.createTransaction(supabase, {
			status,
			transactionId: id,
			userId: data.receiver.userId,
			triggerId: data.sender.userId
		});
	}

	export async function updateById(supabase: SupabaseInstance, id: string, payload: { issuedAt: string; updaterId: string; description: string }) {
		const { data, error } = await supabase.from("bills").update(payload).eq("id", id).select();

		if (error) {
			throw error;
		}

		if (!data) {
			throw new Error("Error updating bill");
		}

		return data;
	}
}
