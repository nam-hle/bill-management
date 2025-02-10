import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { type SupabaseClient } from "@supabase/supabase-js";

import { Environments } from "@/environments";
import { type Database } from "@/database.types";

export type SupabaseInstance = SupabaseClient<Database, "public", Database["public"]>;

export async function getCurrentUser() {
	const supabase = await createSupabaseServer();

	const {
		data: { user: currentUser }
	} = await supabase.auth.getUser();

	if (!currentUser) {
		throw new Error("User not found");
	}

	return currentUser;
}

export async function createSupabaseServer(): Promise<SupabaseInstance> {
	const cookieStore = await cookies();

	return createServerClient<Database>(Environments.PUBLIC.SUPABASE.URL, Environments.PUBLIC.SUPABASE.ANON_KEY, {
		cookies: {
			getAll() {
				return cookieStore.getAll();
			},
			setAll(cookiesToSet) {
				try {
					cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
				} catch {
					// The `setAll` method was called from a Server Component.
					// This can be ignored if you have middleware refreshing
					// user sessions.
				}
			}
		}
	});
}
