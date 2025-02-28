import { type SupabaseInstance } from "@/services/supabase/server";
import { type BankAccount, type BankAccountCreatePayload } from "@/schemas";

export namespace BankAccountsController {
	const BANK_ACCOUNT_SELECT = `
    id,
    createdAt:created_at,
    userId:user_id,
    isDefault:is_default,
    providerNumber:provider_number,
    accountNumber:account_number,
    accountHolder:account_holder,
    type,
    status
  `;

	export async function create(supabase: SupabaseInstance, userId: string, bankAccount: BankAccountCreatePayload): Promise<void> {
		const { error } = await supabase
			.from("bank_accounts")
			.insert({
				type: "Bank",
				user_id: userId,
				account_holder: bankAccount.accountHolder,
				account_number: bankAccount.accountNumber,
				provider_number: bankAccount.providerNumber
			})
			.select(BANK_ACCOUNT_SELECT);

		if (error) {
			throw error;
		}
	}

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
