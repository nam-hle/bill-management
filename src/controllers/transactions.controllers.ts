import { TRPCError } from "@trpc/server";

import { type API } from "@/api";
import { Pagination } from "@/types";
import { DEFAULT_PAGE_NUMBER } from "@/constants";
import { type ClientTransaction } from "@/schemas";
import { ensureAuthorized } from "@/controllers/utils";
import { GroupController } from "@/controllers/group.controller";
import { type MemberContext, type SupabaseInstance } from "@/services/supabase/server";
import { UsersControllers, BankAccountsController, NotificationsControllers } from "@/controllers";

export namespace TransactionsControllers {
	const TRANSACTIONS_SELECT = `
    id,
    group:groups!group_id (${GroupController.GROUP_SELECT}),
    createdAt:created_at,
    issuedAt:issued_at,
    
    amount,
    status,
    sender:profiles!sender_id (userId:id, username, fullName:full_name, avatar:avatar_url),
    bankAccountId:bank_account_id,
    receiver:profiles!receiver_id (userId:id, username, fullName:full_name, avatar:avatar_url)
  `;

	export async function create(
		supabase: SupabaseInstance,
		payload: { amount: number; groupId: string; issuedAt: string; senderId: string; receiverId: string; bankAccountId: string | undefined }
	) {
		const { groupId: group_id, issuedAt: issued_at, senderId: sender_id, receiverId: receiver_id, bankAccountId: bank_account_id, ...rest } = payload;
		const { data, error } = await supabase
			.from("transactions")
			.insert({ ...rest, group_id, issued_at, sender_id, receiver_id, bank_account_id })
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

	export async function suggest(supabase: SupabaseInstance, senderId: string): Promise<API.Transactions.Suggestion.Response> {
		const { error, data: receivers } = await supabase
			.from("user_financial_summary")
			.select("*")
			.lt("balance", 0)
			.order("balance", { ascending: true });

		if (error) {
			throw error;
		}

		if (!receivers?.length) {
			return { suggestion: undefined };
		}

		const receiver = receivers[0];
		const receiverBalance = receiver.balance;

		if (receiverBalance === null) {
			throw new Error("Amount is null");
		}

		if (receiver.user_id === null) {
			throw new Error("User id is null");
		}

		const bankAccount = await BankAccountsController.getDefaultAccountByUserId(supabase, receiver.user_id);

		if (!bankAccount) {
			return { suggestion: undefined };
		}

		const senderBalance = await UsersControllers.reportUsingView(supabase, senderId, "");

		const amount = Math.min(Math.abs(senderBalance.net), Math.abs(receiverBalance));

		return { suggestion: { amount, receiverId: receiver.user_id, bankAccountId: bankAccount.id } };
	}

	export async function getMany(
		supabase: SupabaseInstance,
		userContext: MemberContext,
		filters?: {
			page?: number;
			senderId?: string;
			receiverId?: string;
		}
	): Promise<API.Transactions.List.Response> {
		const finalQuery = supabase.from("transactions").select(TRANSACTIONS_SELECT, { count: "exact" }).eq("group_id", userContext.group.id);
		const { page, senderId, receiverId } = filters ?? {};

		if (senderId) {
			finalQuery.eq("sender_id", senderId);
		} else if (receiverId) {
			finalQuery.eq("receiver_id", receiverId);
		} else {
			finalQuery.or(`sender_id.eq.${userContext.id},receiver_id.eq.${userContext.id}`);
		}

		const {
			count,
			error,
			data: transactions
		} = await finalQuery
			.order("issued_at", { ascending: false })
			.range(...Pagination.toRange({ ...Pagination.getDefault(), pageNumber: page ?? DEFAULT_PAGE_NUMBER }));

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
			sender: { userId: sender.userId, avatar: sender.avatar, fullName: sender.fullName },
			receiver: { userId: receiver.userId, avatar: receiver.avatar, fullName: receiver.fullName }
		};
	}

	export async function update(supabase: SupabaseInstance, payload: API.Transactions.Update.Payload) {
		const { status, transactionId } = payload;
		const { data, error } = await supabase.from("transactions").update({ status }).eq("id", transactionId).select(TRANSACTIONS_SELECT).single();

		if (error) {
			throw error;
		}

		if (status === "Confirmed") {
			await NotificationsControllers.createTransaction(supabase, {
				status,
				transactionId,
				userId: data.sender.userId,
				triggerId: data.receiver.userId
			});
		} else if (status === "Declined") {
			await NotificationsControllers.createTransaction(supabase, {
				status,
				transactionId,
				userId: data.receiver.userId,
				triggerId: data.sender.userId
			});
		} else {
			throw new Error("Invalid status");
		}
	}

	export async function getById(supabase: SupabaseInstance, payload: { userId: string; transactionId: string }): Promise<ClientTransaction> {
		const { data } = await supabase.from("transactions").select(TRANSACTIONS_SELECT).eq("id", payload.transactionId).single();

		if (!data) {
			throw new TRPCError({ code: "NOT_FOUND", message: "Transaction not found" });
		}

		// TODO: Remove this after implementing RLS
		await ensureAuthorized(supabase, { userId: payload.userId, groupId: data.group.id });

		return toClientTransaction(data);
	}
}
