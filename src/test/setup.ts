import dotenv from "dotenv";
import base from "@playwright/test";
import { createClient } from "@supabase/supabase-js";

import { type Database } from "@/database.types";
import { truncateTables } from "@/test/functions/truncate-tables";

dotenv.config({ path: process.env.CI ? ".env.local" : ".env.test.local" });

export const supabaseTest = createClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export const test = base.extend<{ forEachTest: void }>({
	forEachTest: [
		async ({}, use) => {
			await truncateTables();

			await use();
		},
		{ auto: true }
	]
});
