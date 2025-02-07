import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

import { type Database } from "@/database.types";

dotenv.config({ path: process.env.CI ? ".env.local" : ".env.test.local" });

export const supabaseTest = createClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
