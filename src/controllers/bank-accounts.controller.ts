import { type BankAccount } from "@/schemas/bank-accounts.schema";
import { type SupabaseInstance } from "@/services/supabase/server";

export namespace BankAccountsController {
	const BANK_ACCOUNT_SELECT = `
    id,
    createdAt:created_at,
    userId:user_id,
    isDefault:is_default,
    providerNumber:provider_number,
    providerName:provider_name,
    accountNumber:account_number,
    accountHolder:account_holder,
    type,
    status
  `;

	export async function getById(supabase: SupabaseInstance, id: string): Promise<BankAccount | null> {
		const { data, error } = await supabase.from("bank_accounts").select(BANK_ACCOUNT_SELECT).eq("id", id).single();

		if (error) {
			throw error;
		}

		return data ?? null;
	}

	export async function getDefaultAccountByUserId(supabase: SupabaseInstance, userId: string): Promise<BankAccount | undefined> {
		const { data, error } = await supabase.from("bank_accounts").select(BANK_ACCOUNT_SELECT).eq("user_id", userId);

		if (error) {
			throw error;
		}

		return data.find((account) => account.isDefault);
	}

	export async function getByUserId(supabase: SupabaseInstance, userId: string): Promise<BankAccount[]> {
		const { data, error } = await supabase.from("bank_accounts").select(BANK_ACCOUNT_SELECT).eq("user_id", userId);

		if (error) {
			throw error;
		}

		return data ?? [];
	}
}
