

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH .SCHEMA "pg-0sodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."BillMemberRole" AS ENUM (
    'Creditor',
    'Debtor'
);


ALTER TYPE "public"."BillMemberRole" OWNER TO "postgres";


CREATE TYPE "public"."NotificationType" AS ENUM (
    'BillCreated',
    'BillUpdated'
);


ALTER TYPE "public"."NotificationType" OWNER TO "postgres";


CREATE TYPE "public"."TransactionStatus" AS ENUM (
    'pending',
    'confirmed',
    'rejected'
);


ALTER TYPE "public"."TransactionStatus" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."calculate_balances"() RETURNS TABLE("user_id" "uuid", "balance" numeric)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  SELECT
      user_id
      -- SUM(CASE
      --     WHEN role = 'Creditor' THEN amount
      --     WHEN role = 'Debtor' THEN -amount
      --     ELSE 0
      -- END) AS balance
  FROM
      bill_members
  GROUP BY
      user_id;
END;
$$;


ALTER FUNCTION "public"."calculate_balances"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updatedat_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$BEGIN
    RAISE NOTICE 'Trigger executed on table % for action %', 'bills', 'update';
  NEW."updated_at" = NOW();
  RETURN NEW;
END;$$;


ALTER FUNCTION "public"."update_updatedat_column"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."bill_members" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "createdAt" timestamp with time zone DEFAULT "now"() NOT NULL,
    "amount" smallint NOT NULL,
    "updatedAt" timestamp without time zone,
    "billId" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "role" "public"."BillMemberRole" DEFAULT 'Debtor'::"public"."BillMemberRole" NOT NULL,
    "userId" "uuid" NOT NULL
);


ALTER TABLE "public"."bill_members" OWNER TO "postgres";


COMMENT ON COLUMN "public"."bill_members"."createdAt" IS 'When the bill is recorded';



CREATE TABLE IF NOT EXISTS "public"."bills" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "createdAt" timestamp with time zone DEFAULT "now"() NOT NULL,
    "description" "text" NOT NULL,
    "issuedAt" "date" NOT NULL,
    "creatorId" "uuid" NOT NULL,
    "updated_at" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text"),
    "updaterId" "uuid"
);


ALTER TABLE "public"."bills" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."notifications" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "userId" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "readStatus" boolean DEFAULT false NOT NULL,
    "type" "public"."NotificationType" NOT NULL,
    "metadata" "json",
    "createdAt" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text") NOT NULL,
    "billId" "uuid",
    "triggerId" "uuid" NOT NULL
);


ALTER TABLE "public"."notifications" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "updatedAt" timestamp with time zone,
    "username" "text" DEFAULT '''''''user_'''' || gen_random_uuid()''::text'::"text" NOT NULL,
    "fullName" "text" DEFAULT '''''''User '''' || gen_random_uuid()''::text'::"text" NOT NULL,
    "avatar_url" "text",
    "website" "text",
    CONSTRAINT "username_length" CHECK (("char_length"("username") >= 3))
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."transactions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "senderId" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "receiverId" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "status" "public"."TransactionStatus" DEFAULT 'pending'::"public"."TransactionStatus" NOT NULL
);


ALTER TABLE "public"."transactions" OWNER TO "postgres";


ALTER TABLE ONLY "public"."bill_members"
    ADD CONSTRAINT "bill_members_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bills"
    ADD CONSTRAINT "bills_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_username_key" UNIQUE ("username");



ALTER TABLE ONLY "public"."transactions"
    ADD CONSTRAINT "transactions_pkey" PRIMARY KEY ("id");



CREATE INDEX "bills_to_tsvector_idx" ON "public"."bills" USING "gin" ("to_tsvector"('"english"'::"regconfig", 'description'::"text"));



CREATE OR REPLACE TRIGGER "bill_update" BEFORE UPDATE ON "public"."bills" FOR EACH ROW EXECUTE FUNCTION "storage"."update_updated_at_column"();



ALTER TABLE ONLY "public"."bill_members"
    ADD CONSTRAINT "bill_members_bill_id_fkey" FOREIGN KEY ("billId") REFERENCES "public"."bills"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bill_members"
    ADD CONSTRAINT "bill_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."bills"
    ADD CONSTRAINT "bills_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."bills"
    ADD CONSTRAINT "bills_updaterId_fkey" FOREIGN KEY ("updaterId") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_billId_fkey" FOREIGN KEY ("billId") REFERENCES "public"."bills"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_triggerId_fkey" FOREIGN KEY ("triggerId") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."transactions"
    ADD CONSTRAINT "transactions_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."transactions"
    ADD CONSTRAINT "transactions_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "public"."profiles"("id");



CREATE POLICY "Enable all" ON "public"."bill_members" USING (true);



CREATE POLICY "Enable all" ON "public"."bills" USING (true) WITH CHECK (true);



CREATE POLICY "Enable all" ON "public"."notifications" USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."transactions" FOR SELECT USING (true);



CREATE POLICY "Public profiles are viewable by everyone." ON "public"."profiles" FOR SELECT USING (true);



CREATE POLICY "Users can insert their own profile." ON "public"."profiles" FOR INSERT WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "id"));



CREATE POLICY "Users can update own profile." ON "public"."profiles" FOR UPDATE USING ((( SELECT "auth"."uid"() AS "uid") = "id"));



ALTER TABLE "public"."bill_members" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bills" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."notifications" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."transactions" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";




















































































































































































GRANT ALL ON FUNCTION "public"."calculate_balances"() TO "anon";
GRANT ALL ON FUNCTION "public"."calculate_balances"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."calculate_balances"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updatedat_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updatedat_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updatedat_column"() TO "service_role";


















GRANT ALL ON TABLE "public"."bill_members" TO "anon";
GRANT ALL ON TABLE "public"."bill_members" TO "authenticated";
GRANT ALL ON TABLE "public"."bill_members" TO "service_role";



GRANT ALL ON TABLE "public"."bills" TO "anon";
GRANT ALL ON TABLE "public"."bills" TO "authenticated";
GRANT ALL ON TABLE "public"."bills" TO "service_role";



GRANT ALL ON TABLE "public"."notifications" TO "anon";
GRANT ALL ON TABLE "public"."notifications" TO "authenticated";
GRANT ALL ON TABLE "public"."notifications" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."transactions" TO "anon";
GRANT ALL ON TABLE "public"."transactions" TO "authenticated";
GRANT ALL ON TABLE "public"."transactions" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
