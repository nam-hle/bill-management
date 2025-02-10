import { createBrowserClient } from "@supabase/ssr";

import { Environments } from "@/environments";

export function createSupabaseClient() {
	return createBrowserClient(Environments.PUBLIC.SUPABASE.URL, Environments.PUBLIC.SUPABASE.ANON_KEY);
}
