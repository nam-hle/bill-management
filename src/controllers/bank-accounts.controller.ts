import { type SupabaseInstance } from "@/supabase/server";
import { type BankAccount } from "@/schemas/bank-accounts.schema";

export namespace BankAccountsController {
	const BANK_ACCOUNT_SELECT = `
    id,
    createdAt:created_at,
    userId:user_id,
    isDefault:is_default,
    providerName:provider_name,
    accountNumber:account_number,
    accountHolder:account_holder,
    type,
    status
  `;

	export async function getByUserId(supabase: SupabaseInstance, userId: string): Promise<BankAccount[]> {
		const { data, error } = await supabase.from("bank_accounts").select(BANK_ACCOUNT_SELECT).eq("user_id", userId);

		if (error) {
			throw error;
		}

		return data ?? [];
	}
}
