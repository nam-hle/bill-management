SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.8
-- Dumped by pg_dump version 15.8

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

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") VALUES
	('00000000-0000-0000-0000-000000000000', 'deb07962-538a-4f51-a1af-ace92c509827', '{"action":"user_confirmation_requested","actor_id":"a1039db5-13fb-4771-8f8e-d5f507512e88","actor_username":"drnam288@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2025-01-13 14:01:38.780836+00', ''),
	('00000000-0000-0000-0000-000000000000', '31a68930-904b-40ae-8cbf-8edaad686f9a', '{"action":"user_signedup","actor_id":"a1039db5-13fb-4771-8f8e-d5f507512e88","actor_username":"drnam288@gmail.com","actor_via_sso":false,"log_type":"team"}', '2025-01-13 14:02:42.620078+00', ''),
	('00000000-0000-0000-0000-000000000000', '53ea1195-c147-4210-bf29-f4e79f5c378d', '{"action":"logout","actor_id":"a1039db5-13fb-4771-8f8e-d5f507512e88","actor_username":"drnam288@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-01-13 14:05:45.612745+00', ''),
	('00000000-0000-0000-0000-000000000000', '4bf24c47-42fd-4238-8fb3-b9b1dd723b17', '{"action":"login","actor_id":"a1039db5-13fb-4771-8f8e-d5f507512e88","actor_username":"drnam288@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-13 14:13:47.864652+00', ''),
	('00000000-0000-0000-0000-000000000000', 'afba41f8-1011-4f9c-ae35-ac7360199655', '{"action":"logout","actor_id":"a1039db5-13fb-4771-8f8e-d5f507512e88","actor_username":"drnam288@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-01-13 14:19:43.885594+00', ''),
	('00000000-0000-0000-0000-000000000000', '3a7bee7d-cec0-41ab-8616-471509eeac94', '{"action":"login","actor_id":"a1039db5-13fb-4771-8f8e-d5f507512e88","actor_username":"drnam288@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-13 14:21:27.921273+00', ''),
	('00000000-0000-0000-0000-000000000000', '6eaae423-5ae7-4435-99bc-884e9b115747', '{"action":"logout","actor_id":"a1039db5-13fb-4771-8f8e-d5f507512e88","actor_username":"drnam288@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-01-13 14:21:40.095476+00', ''),
	('00000000-0000-0000-0000-000000000000', '3eae2803-7bff-476e-a1f3-5e15f9eaf662', '{"action":"login","actor_id":"a1039db5-13fb-4771-8f8e-d5f507512e88","actor_username":"drnam288@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-13 14:28:03.841069+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cd9f384a-7085-4aa5-9253-6a4441ba4861', '{"action":"logout","actor_id":"a1039db5-13fb-4771-8f8e-d5f507512e88","actor_username":"drnam288@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-01-13 14:28:09.693917+00', ''),
	('00000000-0000-0000-0000-000000000000', '51dc1e64-2ccb-4192-9686-eb4f252d451d', '{"action":"login","actor_id":"a1039db5-13fb-4771-8f8e-d5f507512e88","actor_username":"drnam288@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-13 14:31:23.401947+00', ''),
	('00000000-0000-0000-0000-000000000000', '8574704a-5466-4868-bde2-d4f1a00528d6', '{"action":"logout","actor_id":"a1039db5-13fb-4771-8f8e-d5f507512e88","actor_username":"drnam288@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-01-13 14:42:09.770016+00', ''),
	('00000000-0000-0000-0000-000000000000', '19092ec8-7b99-4ea9-b2f8-69961ea6c88c', '{"action":"login","actor_id":"a1039db5-13fb-4771-8f8e-d5f507512e88","actor_username":"drnam288@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-13 14:42:59.063755+00', ''),
	('00000000-0000-0000-0000-000000000000', '741be911-21b8-4e77-8901-ed2d539287d2', '{"action":"logout","actor_id":"a1039db5-13fb-4771-8f8e-d5f507512e88","actor_username":"drnam288@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-01-13 14:43:14.334581+00', ''),
	('00000000-0000-0000-0000-000000000000', '21e81c90-53ae-4fcb-a8ce-567ca463b44a', '{"action":"user_repeated_signup","actor_id":"a1039db5-13fb-4771-8f8e-d5f507512e88","actor_username":"drnam288@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2025-01-13 15:13:38.479201+00', ''),
	('00000000-0000-0000-0000-000000000000', '95ed1e34-5a2c-4935-9dea-b3a0290bc154', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"user1@example.com","user_id":"8fe422fe-ac2d-484d-8274-6faf27efcf09","user_phone":""}}', '2025-01-13 15:16:11.881339+00', ''),
	('00000000-0000-0000-0000-000000000000', '05747369-fd8d-4e72-b867-5b82585cd41b', '{"action":"login","actor_id":"8fe422fe-ac2d-484d-8274-6faf27efcf09","actor_username":"user1@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-13 15:16:55.890722+00', ''),
	('00000000-0000-0000-0000-000000000000', '83bbb83c-450c-4c33-a961-b09ed65d4256', '{"action":"login","actor_id":"a1039db5-13fb-4771-8f8e-d5f507512e88","actor_username":"drnam288@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-13 15:42:52.114314+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ec65c3d0-fb0e-489f-ad0a-bc4f544429fa', '{"action":"token_refreshed","actor_id":"a1039db5-13fb-4771-8f8e-d5f507512e88","actor_username":"drnam288@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-01-14 00:33:43.585378+00', ''),
	('00000000-0000-0000-0000-000000000000', '70707a6a-0821-4b80-85de-da5a52b47449', '{"action":"token_revoked","actor_id":"a1039db5-13fb-4771-8f8e-d5f507512e88","actor_username":"drnam288@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-01-14 00:33:43.588619+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b5d11e17-209b-430c-a898-e4ee41a81ce8', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"chau@example.com","user_id":"af5560c9-7438-4af4-8964-9c661e140e6e","user_phone":""}}', '2025-01-14 00:36:18.201964+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ac60004b-cc63-4fef-a05c-c68f7527b878', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"long@example.com","user_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","user_phone":""}}', '2025-01-14 00:36:37.764423+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd0dcc686-0805-45a0-8129-9a80b4359bea', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"ben@example.com","user_id":"eab9f72a-0bf2-4984-9119-42ed603245be","user_phone":""}}', '2025-01-14 00:36:50.597077+00', ''),
	('00000000-0000-0000-0000-000000000000', 'de95f80d-070e-45eb-9596-fd47c9486c51', '{"action":"logout","actor_id":"a1039db5-13fb-4771-8f8e-d5f507512e88","actor_username":"drnam288@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-01-14 01:03:56.932806+00', ''),
	('00000000-0000-0000-0000-000000000000', '979c14f2-14bb-4d1d-b2ae-84c1c86128f1', '{"action":"login","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-14 01:04:11.91646+00', ''),
	('00000000-0000-0000-0000-000000000000', '0be75dfd-ec41-41f4-b269-174896893901', '{"action":"logout","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"account"}', '2025-01-14 01:05:37.270185+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd24c09bf-4ee5-494b-bcd0-d13b78e1322a', '{"action":"login","actor_id":"a1039db5-13fb-4771-8f8e-d5f507512e88","actor_username":"drnam288@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-14 01:06:23.517901+00', ''),
	('00000000-0000-0000-0000-000000000000', '799b47ac-a477-4fbc-b22f-d20a380b97ae', '{"action":"token_refreshed","actor_id":"a1039db5-13fb-4771-8f8e-d5f507512e88","actor_username":"drnam288@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-01-14 02:48:20.705437+00', ''),
	('00000000-0000-0000-0000-000000000000', 'da9ab1d2-6055-4145-9ed0-2ea6fd166b59', '{"action":"token_revoked","actor_id":"a1039db5-13fb-4771-8f8e-d5f507512e88","actor_username":"drnam288@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-01-14 02:48:20.711194+00', ''),
	('00000000-0000-0000-0000-000000000000', '63b5223f-f13d-42e2-998d-100a6699a882', '{"action":"token_refreshed","actor_id":"a1039db5-13fb-4771-8f8e-d5f507512e88","actor_username":"drnam288@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-01-14 14:12:08.20947+00', ''),
	('00000000-0000-0000-0000-000000000000', '24d8ef90-abaa-4e83-84ed-ddaf85247607', '{"action":"token_revoked","actor_id":"a1039db5-13fb-4771-8f8e-d5f507512e88","actor_username":"drnam288@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-01-14 14:12:08.234334+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b2cb7955-8d05-477b-ad7f-924d52db91c5', '{"action":"token_refreshed","actor_id":"a1039db5-13fb-4771-8f8e-d5f507512e88","actor_username":"drnam288@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-01-14 14:12:18.260667+00', ''),
	('00000000-0000-0000-0000-000000000000', '4486bb04-79d6-4a8e-bc3e-094cc8ff906a', '{"action":"token_refreshed","actor_id":"a1039db5-13fb-4771-8f8e-d5f507512e88","actor_username":"drnam288@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-01-14 14:12:25.363784+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cea4e51f-af91-4c9e-bb36-4c5a0695d1cd', '{"action":"token_refreshed","actor_id":"a1039db5-13fb-4771-8f8e-d5f507512e88","actor_username":"drnam288@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-01-14 14:12:25.806113+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bba90f6b-e1c8-469c-8bcb-70f76e890210', '{"action":"token_refreshed","actor_id":"a1039db5-13fb-4771-8f8e-d5f507512e88","actor_username":"drnam288@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-01-14 15:10:46.371168+00', ''),
	('00000000-0000-0000-0000-000000000000', '2f29e5b9-7f1a-4e3d-9c49-7db47aea808f', '{"action":"token_revoked","actor_id":"a1039db5-13fb-4771-8f8e-d5f507512e88","actor_username":"drnam288@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-01-14 15:10:46.373433+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c1d150e0-8e4b-432d-b7a2-32cbfa174770', '{"action":"login","actor_id":"af5560c9-7438-4af4-8964-9c661e140e6e","actor_username":"chau@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-14 15:14:14.558835+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd1011cc3-c548-41f0-8c8b-92ad56e7c10a', '{"action":"token_refreshed","actor_id":"a1039db5-13fb-4771-8f8e-d5f507512e88","actor_username":"drnam288@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-01-15 00:45:00.945819+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e427f5e9-d217-45ef-ba0e-731024ef2f50', '{"action":"token_revoked","actor_id":"a1039db5-13fb-4771-8f8e-d5f507512e88","actor_username":"drnam288@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-01-15 00:45:00.957685+00', ''),
	('00000000-0000-0000-0000-000000000000', '68af6948-e509-4dc8-9849-fd64ccbd2a54', '{"action":"token_refreshed","actor_id":"a1039db5-13fb-4771-8f8e-d5f507512e88","actor_username":"drnam288@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-01-15 00:45:02.078935+00', ''),
	('00000000-0000-0000-0000-000000000000', '5c40d0cc-9361-42f4-b385-6893d9cbcfef', '{"action":"token_refreshed","actor_id":"a1039db5-13fb-4771-8f8e-d5f507512e88","actor_username":"drnam288@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-01-15 01:45:17.828776+00', ''),
	('00000000-0000-0000-0000-000000000000', '2b4239a2-8542-4039-ac98-95fa83d8ead9', '{"action":"token_revoked","actor_id":"a1039db5-13fb-4771-8f8e-d5f507512e88","actor_username":"drnam288@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-01-15 01:45:17.83059+00', ''),
	('00000000-0000-0000-0000-000000000000', '50476b78-2437-4eef-b6e9-6aaa70e7b35d', '{"action":"token_refreshed","actor_id":"a1039db5-13fb-4771-8f8e-d5f507512e88","actor_username":"drnam288@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-01-16 00:25:39.2878+00', ''),
	('00000000-0000-0000-0000-000000000000', '94fcd924-1766-475f-a71b-36eb47bdee03', '{"action":"token_revoked","actor_id":"a1039db5-13fb-4771-8f8e-d5f507512e88","actor_username":"drnam288@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-01-16 00:25:39.313529+00', ''),
	('00000000-0000-0000-0000-000000000000', '835fd863-5a0f-4734-a4d7-68b67de5b93b', '{"action":"token_refreshed","actor_id":"a1039db5-13fb-4771-8f8e-d5f507512e88","actor_username":"drnam288@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-01-16 00:25:40.437888+00', ''),
	('00000000-0000-0000-0000-000000000000', '28a4e0e1-d774-4337-9c8a-2da3f2f5ba36', '{"action":"logout","actor_id":"a1039db5-13fb-4771-8f8e-d5f507512e88","actor_username":"drnam288@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-01-16 00:53:57.06816+00', ''),
	('00000000-0000-0000-0000-000000000000', '10f45a9b-b977-423e-b3e0-bc69dbbe2ba7', '{"action":"login","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-16 00:54:43.021328+00', ''),
	('00000000-0000-0000-0000-000000000000', '5747bd4d-9f06-4310-888d-10157243a29c', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-16 02:02:40.796318+00', ''),
	('00000000-0000-0000-0000-000000000000', '54b22065-24ce-4d55-a148-63cc56cec5aa', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-16 02:02:40.797283+00', ''),
	('00000000-0000-0000-0000-000000000000', 'dd083ce8-d9ec-4138-9156-ed287262de7a', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-17 15:18:26.306628+00', ''),
	('00000000-0000-0000-0000-000000000000', '2b944b73-68df-4f31-aa74-ad287226e002', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-17 15:18:26.321393+00', ''),
	('00000000-0000-0000-0000-000000000000', '9226803c-266d-4632-b081-f16daff07317', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-17 15:18:27.89739+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ca14ac93-4a48-44dd-81a6-f915f1c6c7b0', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-17 16:27:44.180769+00', ''),
	('00000000-0000-0000-0000-000000000000', 'addf51dd-0d7c-4c1f-8378-a51651c0e48f', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-17 16:27:44.187005+00', ''),
	('00000000-0000-0000-0000-000000000000', 'acf0ecff-a808-488e-b08a-40c8b51bf965', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-17 17:27:53.988819+00', ''),
	('00000000-0000-0000-0000-000000000000', '9ad1fedd-f90c-41b8-9f2c-cac3cc135653', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-17 17:27:53.991204+00', ''),
	('00000000-0000-0000-0000-000000000000', '29cacb31-f0cc-496b-961c-9a42d134454e', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-17 18:35:33.777028+00', ''),
	('00000000-0000-0000-0000-000000000000', '62153609-3770-471e-8932-a041faca1de4', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-17 18:35:33.78008+00', ''),
	('00000000-0000-0000-0000-000000000000', '3349c653-bc86-4f93-995e-2f69118011d5', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-17 19:35:38.950209+00', ''),
	('00000000-0000-0000-0000-000000000000', '3af3c12b-79a7-4123-9b3e-da9761344b92', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-17 19:35:38.952591+00', ''),
	('00000000-0000-0000-0000-000000000000', '03352726-92f4-4e96-9088-dfd64774a57d', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-17 20:35:48.233161+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ba3a0452-467d-4fef-b8ff-560a7281f32b', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-17 20:35:48.236136+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a1db5d4c-fe1f-4cc8-a74b-532c1ec54412', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-17 21:42:26.248198+00', ''),
	('00000000-0000-0000-0000-000000000000', '4af4d5b9-dd54-4e14-bba7-152a502ec6ca', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-17 21:42:26.251293+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c99064b0-cfd0-4cb2-8ee0-b498a6bf9429', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-17 22:49:37.0113+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f93922b4-11e9-4c16-a0d8-a4990d0361c1', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-17 22:49:37.014266+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c701c8e1-ace2-44c6-a9ac-5c88c303b0ea', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-17 23:49:40.751545+00', ''),
	('00000000-0000-0000-0000-000000000000', '1e63e1fe-2cd8-4087-885c-ce9960617d5f', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-17 23:49:40.757087+00', ''),
	('00000000-0000-0000-0000-000000000000', '708fa225-ebd0-4569-b61d-5080798f169a', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-18 00:49:42.180092+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd651507d-2679-46d7-a596-51be7fe60b0d', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-18 00:49:42.181809+00', ''),
	('00000000-0000-0000-0000-000000000000', '18296843-53f1-4632-a284-b33670ae4430', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-18 01:50:19.871585+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f8f78257-8ead-46da-a1c5-ab52eb738c9f', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-18 01:50:19.873395+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd49154c3-dfd6-4f00-b29c-dfaa6755a0f0', '{"action":"login","actor_id":"eab9f72a-0bf2-4984-9119-42ed603245be","actor_username":"ben@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-18 02:05:02.428083+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a0b39752-026c-4b56-8fb2-204e6188eab0', '{"action":"logout","actor_id":"eab9f72a-0bf2-4984-9119-42ed603245be","actor_username":"ben@example.com","actor_via_sso":false,"log_type":"account"}', '2025-01-18 02:05:16.537195+00', ''),
	('00000000-0000-0000-0000-000000000000', '05ed0847-e999-4843-96c5-13677a104678', '{"action":"login","actor_id":"eab9f72a-0bf2-4984-9119-42ed603245be","actor_username":"ben@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-18 02:05:27.179214+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd68f74bb-04eb-4d67-8e0c-912625cc3d9a', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-18 02:48:32.210678+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd0b70f65-4264-43cb-874c-bdf9c69cb15d', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-18 02:48:32.21374+00', ''),
	('00000000-0000-0000-0000-000000000000', '9c1c4b99-c6d6-4979-83f8-85a751254576', '{"action":"token_refreshed","actor_id":"eab9f72a-0bf2-4984-9119-42ed603245be","actor_username":"ben@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-18 03:03:35.873538+00', ''),
	('00000000-0000-0000-0000-000000000000', '74368e6b-833f-48d4-ab4a-aac80f719277', '{"action":"token_revoked","actor_id":"eab9f72a-0bf2-4984-9119-42ed603245be","actor_username":"ben@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-18 03:03:35.877291+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bdf14ab6-0798-4033-935d-7e1540cf35f0', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-18 03:46:36.655899+00', ''),
	('00000000-0000-0000-0000-000000000000', '0dd9dd9d-01c2-4f73-b6db-ec110dffe8b6', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-18 03:46:36.657534+00', ''),
	('00000000-0000-0000-0000-000000000000', '74ff08a5-1027-46c9-b0af-047f30636d4e', '{"action":"token_refreshed","actor_id":"eab9f72a-0bf2-4984-9119-42ed603245be","actor_username":"ben@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-18 04:01:55.299982+00', ''),
	('00000000-0000-0000-0000-000000000000', '5cb8b9d9-3f57-4dd3-a319-18cc5e18c69c', '{"action":"token_revoked","actor_id":"eab9f72a-0bf2-4984-9119-42ed603245be","actor_username":"ben@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-18 04:01:55.302253+00', ''),
	('00000000-0000-0000-0000-000000000000', '5f95f560-3be8-422a-8c6e-f00e63db8811', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-18 05:12:32.585222+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f4e5da34-dba7-4ca7-8d85-93458e21ba8a', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-18 05:12:32.606743+00', ''),
	('00000000-0000-0000-0000-000000000000', '5a811eb3-73b1-4ee7-9d14-b2aeefcfc765', '{"action":"token_refreshed","actor_id":"eab9f72a-0bf2-4984-9119-42ed603245be","actor_username":"ben@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-18 05:12:34.0073+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b684ca00-a242-4a73-b193-e2a869395a53', '{"action":"token_revoked","actor_id":"eab9f72a-0bf2-4984-9119-42ed603245be","actor_username":"ben@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-18 05:12:34.009352+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd96fad0f-3636-4bd6-9545-a38bf57531dc', '{"action":"token_refreshed","actor_id":"eab9f72a-0bf2-4984-9119-42ed603245be","actor_username":"ben@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-18 06:54:17.782728+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c81ce765-9887-4517-a820-0715b118930d', '{"action":"token_revoked","actor_id":"eab9f72a-0bf2-4984-9119-42ed603245be","actor_username":"ben@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-18 06:54:17.792923+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd5f65c44-faea-420c-b693-4242be4e3288', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-18 06:54:17.82304+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fc290755-46f5-4658-9bf6-a3b3d855c8f3', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-18 06:54:17.824079+00', ''),
	('00000000-0000-0000-0000-000000000000', '8bfc13bc-19c9-4dc9-a449-1d05817834ac', '{"action":"token_refreshed","actor_id":"eab9f72a-0bf2-4984-9119-42ed603245be","actor_username":"ben@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-18 07:52:45.781662+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd0e7e088-634b-495d-ae3e-fcf875dfa39e', '{"action":"token_revoked","actor_id":"eab9f72a-0bf2-4984-9119-42ed603245be","actor_username":"ben@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-18 07:52:45.785371+00', ''),
	('00000000-0000-0000-0000-000000000000', '62872e94-d80f-4318-8ace-269959e33f8f', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-18 07:53:23.423838+00', ''),
	('00000000-0000-0000-0000-000000000000', '7106e4e8-2969-4ecc-809d-e644dec0fc89', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-18 07:53:23.424545+00', ''),
	('00000000-0000-0000-0000-000000000000', '4935d8ff-5f47-4bdb-b2fd-9b8f69fdbbad', '{"action":"token_refreshed","actor_id":"eab9f72a-0bf2-4984-9119-42ed603245be","actor_username":"ben@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-18 09:14:41.375427+00', ''),
	('00000000-0000-0000-0000-000000000000', '7058a530-c7eb-4ab6-b54b-da7c7d444899', '{"action":"token_revoked","actor_id":"eab9f72a-0bf2-4984-9119-42ed603245be","actor_username":"ben@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-18 09:14:41.379275+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e8399c34-b40b-43ae-8a9b-3ef4a3b7e49b', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-18 10:04:35.021666+00', ''),
	('00000000-0000-0000-0000-000000000000', 'dd24e87f-e01d-4703-b8fc-4118829d67e5', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-18 10:04:35.023493+00', ''),
	('00000000-0000-0000-0000-000000000000', '193b72b2-c982-43c2-a2dc-57d0f145a65e', '{"action":"token_refreshed","actor_id":"eab9f72a-0bf2-4984-9119-42ed603245be","actor_username":"ben@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-18 10:24:20.953617+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd92e8f52-8fb7-475b-9681-b9294a84359d', '{"action":"token_revoked","actor_id":"eab9f72a-0bf2-4984-9119-42ed603245be","actor_username":"ben@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-18 10:24:20.956806+00', ''),
	('00000000-0000-0000-0000-000000000000', '5603dbbd-756d-4a38-ad79-518acd7c31cf', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-18 11:19:46.041111+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cc6fb32a-1e65-4b1a-8998-7e7dc355721a', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-18 11:19:46.049594+00', ''),
	('00000000-0000-0000-0000-000000000000', '3e96c073-c530-4124-af35-ad26b9c93a4e', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-18 12:35:53.166727+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e84b06e5-b237-4eeb-bc6e-84b0e19ad7f4', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-18 12:35:53.168377+00', ''),
	('00000000-0000-0000-0000-000000000000', '4a70460c-afd2-43d9-87f6-a9e491644b3b', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-18 13:40:43.661413+00', ''),
	('00000000-0000-0000-0000-000000000000', '473a7aa7-4f0b-4ad8-bbeb-425804f864e0', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-18 13:40:43.663224+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e9d298a6-be4a-4ab6-b0a4-41c6def84bf3', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-18 14:48:20.321921+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bddeb02f-9651-4ace-afc1-ef2e78fc4e51', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-18 14:48:20.331085+00', ''),
	('00000000-0000-0000-0000-000000000000', '639d14fb-a817-4976-8a41-25209e0a8342', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-18 15:48:24.703785+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e24d6760-d5b4-4e7b-9597-ff82ee673ecb', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-18 15:48:24.706103+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd018484b-fb98-4ea9-8bab-b90664b9255b', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-18 16:48:47.670297+00', ''),
	('00000000-0000-0000-0000-000000000000', '12e58d4d-cde8-4757-9acb-b42da74a6c23', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-18 16:48:47.672735+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e9596adf-93d6-4363-9db7-b07742a3024b', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-18 17:48:50.139571+00', ''),
	('00000000-0000-0000-0000-000000000000', '787086c2-559f-4837-902d-fa3ca4fbe8e7', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-18 17:48:50.143077+00', ''),
	('00000000-0000-0000-0000-000000000000', '7f745d7c-5c44-4a0f-9d2e-882317b3a47b', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-18 18:53:35.820998+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c61bb685-7954-440a-931d-a08b14af95d4', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-18 18:53:35.824071+00', ''),
	('00000000-0000-0000-0000-000000000000', 'dae14e9d-0ce2-4447-9aef-91943f65f04a', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-18 19:53:52.711975+00', ''),
	('00000000-0000-0000-0000-000000000000', '8c2ac182-f1e5-4974-a2f8-675208c4005f', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-18 19:53:52.714746+00', ''),
	('00000000-0000-0000-0000-000000000000', '16e799ac-06dc-43a7-b8b3-b1c379d08b2e', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-18 20:54:00.8433+00', ''),
	('00000000-0000-0000-0000-000000000000', '442f915b-3a77-44a1-8185-1e0f13d8c998', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-18 20:54:00.846062+00', ''),
	('00000000-0000-0000-0000-000000000000', '0ef60897-dc59-4620-9d68-07d042646cae', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-18 22:08:35.636938+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ed1a0ede-f619-43f6-bdbf-dec9943b4f42', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-18 22:08:35.641305+00', ''),
	('00000000-0000-0000-0000-000000000000', '7cfd4058-dc66-42e3-a4de-8aa1ffb75e3b', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-18 23:08:34.055685+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c0d08297-d686-4ee5-a3b3-915b2d8e44f7', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-18 23:08:34.058914+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a140f5cd-483a-4a1b-9707-c4cffdd855ee', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-19 00:08:46.212097+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c6ec7d81-af67-4fef-980c-bae17fc4bd36', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-19 00:08:46.214663+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e9ef0c74-a327-4c0c-90c8-11b14c7e4336', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-19 01:09:00.569536+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f8469a89-b707-4f8e-b5be-20273049f8a0', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-19 01:09:00.571268+00', ''),
	('00000000-0000-0000-0000-000000000000', '39307362-3649-4455-824f-2c6f9fd06d46', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-19 02:17:26.343123+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c05e8324-1ff8-46d9-a23f-7decf0a7ce20', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-19 02:17:26.352247+00', ''),
	('00000000-0000-0000-0000-000000000000', 'aa2311ff-ddd2-4fba-9508-1b2222f195fb', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-19 03:44:37.087216+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f07843fc-c4a0-4f3f-aa50-9d593d59c907', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-19 03:44:37.091074+00', ''),
	('00000000-0000-0000-0000-000000000000', 'af82612e-861b-4f82-8251-194272b653fc', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-19 06:04:45.273781+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cf611cef-651b-46ba-9fc7-eea93bd41c98', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-19 06:04:45.276946+00', ''),
	('00000000-0000-0000-0000-000000000000', 'faf0ad59-be01-4bc1-8daf-b246211aeccb', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-19 07:04:59.752516+00', ''),
	('00000000-0000-0000-0000-000000000000', '3257ad9d-3d9c-4012-b491-8b051956ca63', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-19 07:04:59.757034+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e3f9fdba-f31b-4cca-8897-b91acd3ffe9b', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-19 08:05:06.523263+00', ''),
	('00000000-0000-0000-0000-000000000000', '536999c8-2f33-4712-99e8-1229ae587408', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-19 08:05:06.527566+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cfa2cfc7-6ec4-4236-9b88-8e7e3a37731f', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-19 09:05:17.036826+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c984c2c4-51ab-476f-a049-cda94acb8f33', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-19 09:05:17.04006+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f101caf9-a377-480c-af3e-4474172e8a04', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-19 10:10:17.551514+00', ''),
	('00000000-0000-0000-0000-000000000000', '037bd8e8-fd67-4780-ae69-fec39222a038', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-19 10:10:17.553923+00', ''),
	('00000000-0000-0000-0000-000000000000', '830afbbf-dc37-49da-834a-e8588b9cf6db', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-19 11:13:13.949702+00', ''),
	('00000000-0000-0000-0000-000000000000', '1fc576c2-381f-424c-8700-49148ebe2f2f', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-19 11:13:13.952651+00', ''),
	('00000000-0000-0000-0000-000000000000', '3c7d30a2-3289-41c6-a65d-aee39e0cce9e', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-19 12:29:44.268389+00', ''),
	('00000000-0000-0000-0000-000000000000', '69743cf2-8800-4537-99ed-a7c97458cc2c', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-19 12:29:44.271487+00', ''),
	('00000000-0000-0000-0000-000000000000', '1cd785b2-8268-40a8-89e5-08b52be63fee', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-19 13:35:59.735845+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cedb30c2-0d2d-4a31-b62d-d88b137f189f', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-19 13:35:59.738068+00', ''),
	('00000000-0000-0000-0000-000000000000', '9d5b2c12-2fc2-4104-a567-33a3362ca413', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-19 14:34:01.514895+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bf482658-e642-4ad2-b48e-67c3876b7c9f', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-19 14:34:01.516134+00', ''),
	('00000000-0000-0000-0000-000000000000', '675d2996-77ab-414a-a581-e0350beb49a0', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-19 15:34:17.806693+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e32f1e0d-95fa-4999-ae2d-9d14ac99d4eb', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-19 15:34:17.809194+00', ''),
	('00000000-0000-0000-0000-000000000000', '8283c094-4b64-43a2-9442-ac88f3178f4d', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-19 16:35:29.326812+00', ''),
	('00000000-0000-0000-0000-000000000000', '47778ef8-06bf-42f8-91db-6310851c71a3', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-19 16:35:29.329677+00', ''),
	('00000000-0000-0000-0000-000000000000', 'be96e029-3d4e-415e-b9fd-449cf167a540', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-19 17:52:34.068833+00', ''),
	('00000000-0000-0000-0000-000000000000', '8662bd18-2cd7-43ae-a3b7-44677238b5b3', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-19 17:52:34.071376+00', ''),
	('00000000-0000-0000-0000-000000000000', '4b3cf698-5df7-42c9-8341-ff6b98788722', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-19 19:01:51.637869+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f15dcdcc-4d61-42a3-9c32-0e6710a8ff24', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-19 19:01:51.641699+00', ''),
	('00000000-0000-0000-0000-000000000000', '442d17f5-2619-4a00-8b48-3efc25eca6b9', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-19 20:02:26.739351+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd093bd0b-5c22-417c-921b-277d33fc79c1', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-19 20:02:26.742972+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a728fa22-dcc5-4d14-9bf6-0cf5c8aad8e9', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-19 21:02:47.310563+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ed247f5c-bbde-4508-8041-b73bf4def7bb', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-19 21:02:47.313993+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a2a8240b-f53f-45d7-924c-f621bd99f64a', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-19 22:02:49.279484+00', ''),
	('00000000-0000-0000-0000-000000000000', '9b1635bc-ced0-4e02-aaad-ae9868704ec9', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-19 22:02:49.282689+00', ''),
	('00000000-0000-0000-0000-000000000000', '09755624-201d-4528-9a27-bb5f99dad856', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-19 23:10:34.334816+00', ''),
	('00000000-0000-0000-0000-000000000000', '582d0de9-2ea3-4fe6-8ed2-69dc1c5ca509', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-19 23:10:34.337891+00', ''),
	('00000000-0000-0000-0000-000000000000', '17bcfb02-338b-4134-aca3-eca7d73140f9', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-20 00:10:43.544412+00', ''),
	('00000000-0000-0000-0000-000000000000', '08d855b5-bb33-46a9-9cd1-755169f5bcb0', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-20 00:10:43.548054+00', ''),
	('00000000-0000-0000-0000-000000000000', '866da423-91db-4adf-867d-60414d3d0619', '{"action":"logout","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"account"}', '2025-01-20 00:58:01.377952+00', ''),
	('00000000-0000-0000-0000-000000000000', '85226de5-6404-4e65-8b9c-d9e2ad40df68', '{"action":"login","actor_id":"af5560c9-7438-4af4-8964-9c661e140e6e","actor_username":"chau@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-20 00:58:11.490393+00', ''),
	('00000000-0000-0000-0000-000000000000', '4cd6103e-8da5-4500-a82b-5540ea5a6998', '{"action":"login","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-20 01:19:00.659645+00', ''),
	('00000000-0000-0000-0000-000000000000', '892e9aa3-13d9-4286-bcf5-1863f2e05a89', '{"action":"token_refreshed","actor_id":"af5560c9-7438-4af4-8964-9c661e140e6e","actor_username":"chau@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-20 02:29:53.70018+00', ''),
	('00000000-0000-0000-0000-000000000000', '3ae82efd-fbbb-4605-a293-235ba62e333c', '{"action":"token_revoked","actor_id":"af5560c9-7438-4af4-8964-9c661e140e6e","actor_username":"chau@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-20 02:29:53.702678+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bfdd6cce-5743-4434-8714-695b89bd791e', '{"action":"token_refreshed","actor_id":"af5560c9-7438-4af4-8964-9c661e140e6e","actor_username":"chau@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-20 10:27:27.027132+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd0eb8ad2-84c1-4f6f-b00d-dda7ff2c8167', '{"action":"token_revoked","actor_id":"af5560c9-7438-4af4-8964-9c661e140e6e","actor_username":"chau@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-20 10:27:27.038453+00', ''),
	('00000000-0000-0000-0000-000000000000', 'adc9b97d-9f40-47af-94ad-d42adde03370', '{"action":"token_refreshed","actor_id":"af5560c9-7438-4af4-8964-9c661e140e6e","actor_username":"chau@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-20 10:27:27.067238+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c9decc77-f7af-4ac1-9756-0aecb43aa500', '{"action":"token_refreshed","actor_id":"af5560c9-7438-4af4-8964-9c661e140e6e","actor_username":"chau@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-20 10:27:38.02118+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fc51a41b-8d99-4888-8b1a-1078bb5395b3', '{"action":"token_refreshed","actor_id":"af5560c9-7438-4af4-8964-9c661e140e6e","actor_username":"chau@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-20 10:27:38.046612+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a4e4bc9a-5281-4c1a-9ab0-664c2fed7094', '{"action":"token_refreshed","actor_id":"af5560c9-7438-4af4-8964-9c661e140e6e","actor_username":"chau@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-20 10:27:40.41746+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ba6334a4-080b-4a1f-b578-2dfe859688b8', '{"action":"logout","actor_id":"af5560c9-7438-4af4-8964-9c661e140e6e","actor_username":"chau@example.com","actor_via_sso":false,"log_type":"account"}', '2025-01-20 10:36:25.650621+00', ''),
	('00000000-0000-0000-0000-000000000000', '50b3dd54-fe01-4cf4-8a77-fe9de60ad1a4', '{"action":"login","actor_id":"af5560c9-7438-4af4-8964-9c661e140e6e","actor_username":"chau@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-20 10:38:06.846823+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ce730607-67ef-430a-8f1b-edcd86ae3d17', '{"action":"logout","actor_id":"af5560c9-7438-4af4-8964-9c661e140e6e","actor_username":"chau@example.com","actor_via_sso":false,"log_type":"account"}', '2025-01-20 10:39:19.21972+00', ''),
	('00000000-0000-0000-0000-000000000000', '45b48768-184a-4d53-9c7a-19bed9c01e69', '{"action":"login","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-20 10:40:26.085343+00', ''),
	('00000000-0000-0000-0000-000000000000', 'abdba507-7a25-4a36-91d1-91d826ff372f', '{"action":"logout","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"account"}', '2025-01-20 10:40:52.114024+00', ''),
	('00000000-0000-0000-0000-000000000000', '95c86a30-c9c7-4610-9cd9-49d2933ba296', '{"action":"login","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-20 10:40:56.511041+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c3a08cbb-9f15-4cd7-b164-39da726488d1', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-20 12:54:17.685963+00', ''),
	('00000000-0000-0000-0000-000000000000', '2e777bfd-7448-4526-8c55-e87e4e0c0d46', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-20 12:54:17.688448+00', ''),
	('00000000-0000-0000-0000-000000000000', '9d979cfe-e11e-49b2-88ef-80f6bff9766e', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-20 13:54:23.991231+00', ''),
	('00000000-0000-0000-0000-000000000000', '9904f842-f54d-463e-b885-e1c2265fb47e', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-20 13:54:23.994934+00', ''),
	('00000000-0000-0000-0000-000000000000', '872ea8a2-f336-4006-9853-a942e5d6683a', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-20 14:54:24.883799+00', ''),
	('00000000-0000-0000-0000-000000000000', '43cb9258-e085-4c37-a75e-2773dbd4ec1f', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-20 14:54:24.885597+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b6dad80e-cf5f-498d-bc60-019f7c216292', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-20 14:54:31.77055+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ca358c2d-5714-4bbe-9c27-ae9f4c6b117c', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-20 14:54:31.786796+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e1dd189d-72b8-48e0-8954-229ade63c9e2', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-20 15:52:32.066556+00', ''),
	('00000000-0000-0000-0000-000000000000', '9a8fcaeb-1c79-421e-b1a1-1d61d9bdef23', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-20 15:52:32.074212+00', ''),
	('00000000-0000-0000-0000-000000000000', '38646de0-abb8-498b-b352-bd689e1893f4', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-20 17:04:27.068605+00', ''),
	('00000000-0000-0000-0000-000000000000', '95dd8a97-d711-413b-8085-447861976fdb', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-20 17:04:27.072251+00', ''),
	('00000000-0000-0000-0000-000000000000', '13802a48-697a-4d3a-a377-9bae31b51d54', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-20 18:04:29.020013+00', ''),
	('00000000-0000-0000-0000-000000000000', 'debe5dc4-2c24-4ec4-908a-e79bc0eb4b82', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-20 18:04:29.022683+00', ''),
	('00000000-0000-0000-0000-000000000000', 'df2d0b42-94ae-44b3-b495-c6efeb309c0c', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-20 19:12:13.765609+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e2ccd2fe-94ba-483e-9f1c-fce94e9ff772', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-20 19:12:13.769639+00', ''),
	('00000000-0000-0000-0000-000000000000', '380d8949-64fc-4a6f-a20b-9eec805099b5', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-20 20:12:23.491532+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c80827b0-d95a-483f-a911-71bf175182b2', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-20 20:12:23.49675+00', ''),
	('00000000-0000-0000-0000-000000000000', '74fa9025-21d6-451a-adaa-8cc4b87b93ab', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-20 21:12:30.317514+00', ''),
	('00000000-0000-0000-0000-000000000000', '1af3a3f2-62d6-41ea-a8b1-7c688d487f10', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-20 21:12:30.320641+00', ''),
	('00000000-0000-0000-0000-000000000000', '8ce21a72-5cf1-4ea1-9925-58e1a5a2c8fc', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-20 22:21:00.818686+00', ''),
	('00000000-0000-0000-0000-000000000000', '5b6eab66-9840-417f-a80d-31402d01a809', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-20 22:21:00.820979+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f9a257ec-8e2c-42e0-84fb-9e1dfc674e4f', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-20 23:21:07.558727+00', ''),
	('00000000-0000-0000-0000-000000000000', '7f0dff33-9056-4cef-ad36-391d203f339d', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-20 23:21:07.561706+00', ''),
	('00000000-0000-0000-0000-000000000000', '390cc85d-355b-473f-90dd-c089b87f0d78', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-21 00:29:59.662601+00', ''),
	('00000000-0000-0000-0000-000000000000', '0a208347-2897-4400-8cc3-cde9aa11650a', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-21 00:29:59.664929+00', ''),
	('00000000-0000-0000-0000-000000000000', '93d8fc77-13a8-42d3-91cb-e162dc032ee3', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-21 00:30:02.14848+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bbbee0c8-be58-47d4-a042-8e85448a875c', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-21 01:28:20.497064+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c0bfc90e-42ea-425c-b062-3a5856edb232', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-21 01:28:20.49965+00', ''),
	('00000000-0000-0000-0000-000000000000', '45ca054f-cc45-43cd-9602-f06d50c85393', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-21 02:31:22.155223+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a9bdaabf-f719-4158-b1fd-bcb3ae900ff4', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-21 02:31:22.157403+00', ''),
	('00000000-0000-0000-0000-000000000000', '9c8a1d87-8608-4fdd-8639-52eddbe5e62e', '{"action":"login","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-21 04:42:29.632278+00', ''),
	('00000000-0000-0000-0000-000000000000', '6ae67087-fd61-4c0c-a11a-7ca7df1c3473', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-21 13:56:01.67237+00', ''),
	('00000000-0000-0000-0000-000000000000', '8d38c4b5-5556-4f6c-89d3-500f283a140d', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-21 13:56:01.692478+00', ''),
	('00000000-0000-0000-0000-000000000000', '533e6b2d-3d1c-4988-a4ca-a407e00d06d3', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-21 13:56:01.729892+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c1a54bb1-3734-4db2-a0ed-7695596a5073', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-21 13:56:01.766253+00', ''),
	('00000000-0000-0000-0000-000000000000', '41d5a402-207a-41e6-9f73-48c16f95361d', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-21 13:56:01.798114+00', ''),
	('00000000-0000-0000-0000-000000000000', '9287a6b4-ae7a-41e3-ace4-b3dca36317b9', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-21 13:56:04.077755+00', ''),
	('00000000-0000-0000-0000-000000000000', '05069690-14d5-4609-b53b-c415e850a0a4', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-21 14:54:16.255858+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c006427f-4d6f-4cb8-9d95-3586d71b1d64', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-21 14:54:16.259641+00', ''),
	('00000000-0000-0000-0000-000000000000', '14b7c365-ea78-4479-b1d9-ee26bffd1464', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-21 15:52:37.676039+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e1ab8162-a12c-4c41-a790-93fcfa24798d', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-21 15:52:37.683589+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c352fb27-51d1-4d03-9188-8c5dd1969256', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-21 16:52:44.279054+00', ''),
	('00000000-0000-0000-0000-000000000000', '6f3a7086-5c35-4160-9bf0-dda7ed85ccba', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-21 16:52:44.280063+00', ''),
	('00000000-0000-0000-0000-000000000000', '75a700dc-7cae-4893-bfbc-ee3c996bb214', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-21 17:54:21.697519+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b44f5d9d-8b93-4765-8e51-988d46b2a678', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-21 17:54:21.70904+00', ''),
	('00000000-0000-0000-0000-000000000000', '1d743c34-8132-4c57-90bc-9913516b5b5e', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-21 18:54:21.716362+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e2021b38-29cc-4ec0-926d-424ed8cb6486', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-21 18:54:21.719331+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a0b6041a-3592-4e56-b729-5be5404a64b3', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-21 19:59:53.265631+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ec0bc096-82d1-47e3-b738-6e9e7c6361f9', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-21 19:59:53.26868+00', ''),
	('00000000-0000-0000-0000-000000000000', '75560a17-5dc4-4791-bf60-6544d8e98c02', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-21 20:59:58.772567+00', ''),
	('00000000-0000-0000-0000-000000000000', '35082cac-4b2e-4421-947a-f18b3c8e9490', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-21 20:59:58.777732+00', ''),
	('00000000-0000-0000-0000-000000000000', 'dd7108c8-b1c9-4102-90b8-dffb5c492dc4', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-21 22:07:25.367621+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b696ffa4-4468-412c-b507-428eb8cc6288', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-21 22:07:25.370153+00', ''),
	('00000000-0000-0000-0000-000000000000', '8c28459d-1d02-4bb4-bd40-b25a8342470c', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-21 23:07:32.319296+00', ''),
	('00000000-0000-0000-0000-000000000000', '484c23ed-6f7a-4161-ae24-ae419e183972', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-21 23:07:32.322937+00', ''),
	('00000000-0000-0000-0000-000000000000', '1f6ccf6b-0d16-4c11-bc04-f93cd78ca193', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-22 00:17:51.688359+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b179ce86-368c-45b5-a366-a51b1692cb4d', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-22 00:17:51.691614+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a7b3d723-49d2-431d-95db-cb01077a9ba9', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-22 01:17:52.813507+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bfe4d694-8d85-4ac4-80fc-f06f1b5613bd', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-22 01:17:52.815827+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ef3421a8-253b-41e4-9b48-295be0b25192', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-22 02:17:52.6262+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ec380f47-de8f-4400-915b-c2ab05a6aca1', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-22 02:17:52.630009+00', ''),
	('00000000-0000-0000-0000-000000000000', '2a23bbb7-2d14-4de8-afab-8781e243b607', '{"action":"login","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-01-22 02:21:02.130858+00', ''),
	('00000000-0000-0000-0000-000000000000', '4820db08-78b8-4581-b8b0-b6b21f39304f', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-22 14:19:23.220721+00', ''),
	('00000000-0000-0000-0000-000000000000', '3d09cba3-690c-4440-bec8-327cb8894e15', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-22 14:19:23.241126+00', ''),
	('00000000-0000-0000-0000-000000000000', '97fdd8b0-7338-49a6-9f90-8dab86054976', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-22 14:19:23.297075+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c90c332f-ae0d-4242-9a7f-d550f04a96c8', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-22 14:19:26.743845+00', ''),
	('00000000-0000-0000-0000-000000000000', '98e52add-2919-452d-a4b8-4b41253ac251', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-22 15:19:24.116252+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f84d9d9f-ba83-43fc-b1dd-5bc4dbbed9f5', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-22 15:19:24.119743+00', ''),
	('00000000-0000-0000-0000-000000000000', '4baadf45-5fff-40fd-90ec-fc2ae59a93ac', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-22 16:19:29.106742+00', ''),
	('00000000-0000-0000-0000-000000000000', '5d38abd7-a9da-4bc7-886d-4938a8627aa3', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-22 16:19:29.119534+00', ''),
	('00000000-0000-0000-0000-000000000000', '585bf00d-99a0-41a4-9546-cd6eaac4571d', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-22 17:55:18.431646+00', ''),
	('00000000-0000-0000-0000-000000000000', '3638e5ae-d82f-4714-a307-b564037cae6c', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-22 17:55:18.433551+00', ''),
	('00000000-0000-0000-0000-000000000000', '09ff4a2a-7069-4a91-b5b4-70048e918833', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-22 18:55:22.038814+00', ''),
	('00000000-0000-0000-0000-000000000000', '255c11e4-ea11-49ac-b59c-520faee8f6d1', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-22 18:55:22.04624+00', ''),
	('00000000-0000-0000-0000-000000000000', '27bf4b0d-2a76-47c9-aee9-cd27b868bbfc', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-22 19:58:02.835016+00', ''),
	('00000000-0000-0000-0000-000000000000', '465a9cc7-148e-4aee-8337-3d4ba3e6b533', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-22 19:58:02.838895+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c88ac06b-4be4-4ce4-a12e-a9aedaf99d55', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-22 20:58:11.661438+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ca758559-f8ec-4951-b1fa-93f90d1503b2', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-22 20:58:11.664801+00', ''),
	('00000000-0000-0000-0000-000000000000', '79edb445-e49e-4e30-9b7e-9267251b0415', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-22 22:03:53.139551+00', ''),
	('00000000-0000-0000-0000-000000000000', '0bbf7a36-272f-4bcd-b821-ae3a7c3963d1', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-22 22:03:53.14079+00', ''),
	('00000000-0000-0000-0000-000000000000', '1ee07c79-27e3-4a30-9dfe-466463966055', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-22 23:03:59.239683+00', ''),
	('00000000-0000-0000-0000-000000000000', '40a4e93f-7fec-4560-9aed-07843efb6129', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-22 23:03:59.2407+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cb2c1b49-339f-458a-8d0d-92a7fc0bb6fe', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-23 00:04:09.098873+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ac37572f-f381-4741-a4ba-47ff6f4d210b', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-23 00:04:09.100793+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a8f84db7-5791-44f7-9d65-3e336cbc320a', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-23 01:02:32.091618+00', ''),
	('00000000-0000-0000-0000-000000000000', '075c2628-4bbe-4efa-9510-cf029b522b33', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-23 01:02:32.097397+00', ''),
	('00000000-0000-0000-0000-000000000000', '27991361-ca82-485a-b7bc-372e24c22a49', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-23 02:08:53.196774+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f0410d19-53ad-4f98-8c07-cf21cf431db3', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-23 02:08:53.201569+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ede283b1-acbe-41c4-8a00-1457d6a8ba07', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-23 13:40:05.029509+00', ''),
	('00000000-0000-0000-0000-000000000000', '9e9317ba-1ab1-4f5c-bac3-c000af4b9608', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-23 13:40:05.0453+00', ''),
	('00000000-0000-0000-0000-000000000000', '497814f1-3ba5-410b-a472-5383084b0012', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-23 13:40:05.092061+00', ''),
	('00000000-0000-0000-0000-000000000000', '14717d03-06bd-4925-862b-f430274d9260', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-23 13:40:07.591982+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ea469f39-bb0e-4f42-b1bb-cfe28c97645c', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-23 14:40:17.769621+00', ''),
	('00000000-0000-0000-0000-000000000000', '1f051654-e74b-4e8a-b09e-720767426168', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-23 14:40:17.772334+00', ''),
	('00000000-0000-0000-0000-000000000000', '508ef904-476e-4e06-ac2e-161a7ee0eb47', '{"action":"token_refreshed","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-23 15:40:23.256791+00', ''),
	('00000000-0000-0000-0000-000000000000', '9496f629-e1c2-4aff-833c-d1efdd93139c', '{"action":"token_revoked","actor_id":"140cac15-d22a-46d8-9de9-fbc01aa84c94","actor_username":"long@example.com","actor_via_sso":false,"log_type":"token"}', '2025-01-23 15:40:23.259749+00', '');


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."flow_state" ("id", "user_id", "auth_code", "code_challenge_method", "code_challenge", "provider_type", "provider_access_token", "provider_refresh_token", "created_at", "updated_at", "authentication_method", "auth_code_issued_at") VALUES
	('32750649-a2d3-4dc4-acd6-d10f945731c5', 'a1039db5-13fb-4771-8f8e-d5f507512e88', '7c7d659c-6f09-42c3-b710-476ed41d7edd', 's256', 'McRheHYZ5ZiftLOFFZR2v742RnYh0TqnD5JvFwu5bKU', 'email', '', '', '2025-01-13 14:01:38.783817+00', '2025-01-13 14:01:38.783817+00', 'email/signup', NULL);


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', 'a1039db5-13fb-4771-8f8e-d5f507512e88', 'authenticated', 'authenticated', 'drnam288@gmail.com', '$2a$10$ac/lWYZe2Dm/V5zYYJKCxeCM1l8HYJIXRof5YusHSmxT9Am.fh7w.', '2025-01-13 14:02:42.621062+00', NULL, '', '2025-01-13 14:01:38.787771+00', '', NULL, '', '', NULL, '2025-01-14 01:06:23.518767+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "a1039db5-13fb-4771-8f8e-d5f507512e88", "email": "drnam288@gmail.com", "email_verified": true, "phone_verified": false}', NULL, '2025-01-13 14:01:38.752286+00', '2025-01-16 00:25:39.336101+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'af5560c9-7438-4af4-8964-9c661e140e6e', 'authenticated', 'authenticated', 'chau@example.com', '$2a$10$hGbGYN9KIWzalp936qisk.wtA4zfVd78pk.ipqaWgngqUU9NuwY6u', '2025-01-14 00:36:18.203839+00', NULL, '', NULL, '', NULL, '', '', NULL, '2025-01-20 10:38:06.847913+00', '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2025-01-14 00:36:18.188162+00', '2025-01-20 10:38:06.852786+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '8fe422fe-ac2d-484d-8274-6faf27efcf09', 'authenticated', 'authenticated', 'user1@example.com', '$2a$10$01IKogjBkLZ7kOUFermFlezh247AMxa/Oe.iMYkkbp49u6ttnWEaC', '2025-01-13 15:16:11.883054+00', NULL, '', NULL, '', NULL, '', '', NULL, '2025-01-13 15:16:55.891438+00', '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2025-01-13 15:16:11.871518+00', '2025-01-13 15:16:55.895831+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'eab9f72a-0bf2-4984-9119-42ed603245be', 'authenticated', 'authenticated', 'ben@example.com', '$2a$10$z9lDHadwLKBgNUCl2EhfOuS3hCuneSjKnnYpP2hUTxxgkNcpUQIRO', '2025-01-14 00:36:50.598916+00', NULL, '', NULL, '', NULL, '', '', NULL, '2025-01-18 02:05:27.180022+00', '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2025-01-14 00:36:50.594844+00', '2025-01-18 10:24:20.966301+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '140cac15-d22a-46d8-9de9-fbc01aa84c94', 'authenticated', 'authenticated', 'long@example.com', '$2a$10$ZPOpm36FI5wd0JVXRiZZD.k4r12Ri0ZZvCIrMIpFj354cT32aQScq', '2025-01-14 00:36:37.765556+00', NULL, '', NULL, '', NULL, '', '', NULL, '2025-01-22 02:21:02.133421+00', '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2025-01-14 00:36:37.761239+00', '2025-01-23 15:40:23.26657+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('a1039db5-13fb-4771-8f8e-d5f507512e88', 'a1039db5-13fb-4771-8f8e-d5f507512e88', '{"sub": "a1039db5-13fb-4771-8f8e-d5f507512e88", "email": "drnam288@gmail.com", "email_verified": true, "phone_verified": false}', 'email', '2025-01-13 14:01:38.777241+00', '2025-01-13 14:01:38.777303+00', '2025-01-13 14:01:38.777303+00', '403293c9-faa1-42a6-8d1e-3c8983f44d16'),
	('8fe422fe-ac2d-484d-8274-6faf27efcf09', '8fe422fe-ac2d-484d-8274-6faf27efcf09', '{"sub": "8fe422fe-ac2d-484d-8274-6faf27efcf09", "email": "user1@example.com", "email_verified": false, "phone_verified": false}', 'email', '2025-01-13 15:16:11.879681+00', '2025-01-13 15:16:11.879739+00', '2025-01-13 15:16:11.879739+00', 'cef68d7c-8fa9-4b0b-8a30-9654f81d2e5c'),
	('af5560c9-7438-4af4-8964-9c661e140e6e', 'af5560c9-7438-4af4-8964-9c661e140e6e', '{"sub": "af5560c9-7438-4af4-8964-9c661e140e6e", "email": "chau@example.com", "email_verified": false, "phone_verified": false}', 'email', '2025-01-14 00:36:18.199816+00', '2025-01-14 00:36:18.199879+00', '2025-01-14 00:36:18.199879+00', '0239e7e0-4d9e-412e-96c5-33dee49bf09d'),
	('140cac15-d22a-46d8-9de9-fbc01aa84c94', '140cac15-d22a-46d8-9de9-fbc01aa84c94', '{"sub": "140cac15-d22a-46d8-9de9-fbc01aa84c94", "email": "long@example.com", "email_verified": false, "phone_verified": false}', 'email', '2025-01-14 00:36:37.762638+00', '2025-01-14 00:36:37.762693+00', '2025-01-14 00:36:37.762693+00', 'a8a23c23-b416-4542-a1f8-95962cf384e2'),
	('eab9f72a-0bf2-4984-9119-42ed603245be', 'eab9f72a-0bf2-4984-9119-42ed603245be', '{"sub": "eab9f72a-0bf2-4984-9119-42ed603245be", "email": "ben@example.com", "email_verified": false, "phone_verified": false}', 'email', '2025-01-14 00:36:50.596192+00', '2025-01-14 00:36:50.596249+00', '2025-01-14 00:36:50.596249+00', '2b4e2f1b-c003-4873-b026-0c2b28a44a21');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag") VALUES
	('799a26a8-a7f5-4cbe-b43d-5ed9513f9e8e', '8fe422fe-ac2d-484d-8274-6faf27efcf09', '2025-01-13 15:16:55.891517+00', '2025-01-13 15:16:55.891517+00', NULL, 'aal1', NULL, NULL, 'node', '113.22.54.182', NULL),
	('d96b8e38-a2c3-4c62-8331-5fce1a922ead', '140cac15-d22a-46d8-9de9-fbc01aa84c94', '2025-01-20 10:40:56.511915+00', '2025-01-22 02:17:52.637185+00', NULL, 'aal1', NULL, '2025-01-22 02:17:52.637109', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:134.0) Gecko/20100101 Firefox/134.0', '123.19.160.247', NULL),
	('0221114e-8afb-48f4-8766-92ed772ae9de', 'eab9f72a-0bf2-4984-9119-42ed603245be', '2025-01-18 02:05:27.180959+00', '2025-01-18 10:24:20.969493+00', NULL, 'aal1', NULL, '2025-01-18 10:24:20.969421', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:134.0) Gecko/20100101 Firefox/134.0', '118.71.187.100', NULL),
	('8267a1df-3d32-4539-9755-5f041248f68c', '140cac15-d22a-46d8-9de9-fbc01aa84c94', '2025-01-22 02:21:02.134164+00', '2025-01-23 15:40:23.269233+00', NULL, 'aal1', NULL, '2025-01-23 15:40:23.269157', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:134.0) Gecko/20100101 Firefox/134.0', '118.71.187.36', NULL),
	('d7b9ea06-a006-4a37-bf8d-65e1682d1c77', '140cac15-d22a-46d8-9de9-fbc01aa84c94', '2025-01-21 04:42:29.634272+00', '2025-01-21 04:42:29.634272+00', NULL, 'aal1', NULL, NULL, 'node', '3.239.86.209', NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('799a26a8-a7f5-4cbe-b43d-5ed9513f9e8e', '2025-01-13 15:16:55.896399+00', '2025-01-13 15:16:55.896399+00', 'password', '82eff1a4-9e3d-45b7-9610-f4eea5a1d6c8'),
	('0221114e-8afb-48f4-8766-92ed772ae9de', '2025-01-18 02:05:27.184017+00', '2025-01-18 02:05:27.184017+00', 'password', '885c791e-2cfe-4911-abcd-bf515b26cae7'),
	('d96b8e38-a2c3-4c62-8331-5fce1a922ead', '2025-01-20 10:40:56.514105+00', '2025-01-20 10:40:56.514105+00', 'password', '60946ca7-b9fb-45e3-a924-8703df6d1764'),
	('d7b9ea06-a006-4a37-bf8d-65e1682d1c77', '2025-01-21 04:42:29.641277+00', '2025-01-21 04:42:29.641277+00', 'password', '90417fb0-e9fb-404d-b119-e8fd73851a54'),
	('8267a1df-3d32-4539-9755-5f041248f68c', '2025-01-22 02:21:02.142328+00', '2025-01-22 02:21:02.142328+00', 'password', '58f7c9c6-5104-428d-bb0a-67b9e62f4cdd');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 7, 'bNW7MqOOQ7DoMORzdyI7Lw', '8fe422fe-ac2d-484d-8274-6faf27efcf09', false, '2025-01-13 15:16:55.893606+00', '2025-01-13 15:16:55.893606+00', NULL, '799a26a8-a7f5-4cbe-b43d-5ed9513f9e8e'),
	('00000000-0000-0000-0000-000000000000', 87, 'dQy5J5cJ7LviQYv_3bHejw', '140cac15-d22a-46d8-9de9-fbc01aa84c94', true, '2025-01-20 10:40:56.5127+00', '2025-01-20 12:54:17.689655+00', NULL, 'd96b8e38-a2c3-4c62-8331-5fce1a922ead'),
	('00000000-0000-0000-0000-000000000000', 88, '0YD3PTbZvu_s-8DHG9FqSg', '140cac15-d22a-46d8-9de9-fbc01aa84c94', true, '2025-01-20 12:54:17.691148+00', '2025-01-20 13:54:23.995732+00', 'dQy5J5cJ7LviQYv_3bHejw', 'd96b8e38-a2c3-4c62-8331-5fce1a922ead'),
	('00000000-0000-0000-0000-000000000000', 89, '9N4uIA8BQFBIt0aq7HRfLg', '140cac15-d22a-46d8-9de9-fbc01aa84c94', true, '2025-01-20 13:54:23.997897+00', '2025-01-20 14:54:24.886301+00', '0YD3PTbZvu_s-8DHG9FqSg', 'd96b8e38-a2c3-4c62-8331-5fce1a922ead'),
	('00000000-0000-0000-0000-000000000000', 90, 'wdUK71Tkj2v5QRwJbNioPQ', '140cac15-d22a-46d8-9de9-fbc01aa84c94', true, '2025-01-20 14:54:24.888335+00', '2025-01-20 15:52:32.074904+00', '9N4uIA8BQFBIt0aq7HRfLg', 'd96b8e38-a2c3-4c62-8331-5fce1a922ead'),
	('00000000-0000-0000-0000-000000000000', 91, 'tGbPtfn1RaA9Lwn0KI3j1Q', '140cac15-d22a-46d8-9de9-fbc01aa84c94', true, '2025-01-20 15:52:32.0795+00', '2025-01-20 17:04:27.073063+00', 'wdUK71Tkj2v5QRwJbNioPQ', 'd96b8e38-a2c3-4c62-8331-5fce1a922ead'),
	('00000000-0000-0000-0000-000000000000', 92, 'ZU3wMocNODXj-X9dXcPbNg', '140cac15-d22a-46d8-9de9-fbc01aa84c94', true, '2025-01-20 17:04:27.07477+00', '2025-01-20 18:04:29.023371+00', 'tGbPtfn1RaA9Lwn0KI3j1Q', 'd96b8e38-a2c3-4c62-8331-5fce1a922ead'),
	('00000000-0000-0000-0000-000000000000', 93, 'aXJ5IfXS4PdVllHCY_CPSQ', '140cac15-d22a-46d8-9de9-fbc01aa84c94', true, '2025-01-20 18:04:29.02662+00', '2025-01-20 19:12:13.770262+00', 'ZU3wMocNODXj-X9dXcPbNg', 'd96b8e38-a2c3-4c62-8331-5fce1a922ead'),
	('00000000-0000-0000-0000-000000000000', 94, 'qza8G-nZtcRv49cIKROGRw', '140cac15-d22a-46d8-9de9-fbc01aa84c94', true, '2025-01-20 19:12:13.77167+00', '2025-01-20 20:12:23.497433+00', 'aXJ5IfXS4PdVllHCY_CPSQ', 'd96b8e38-a2c3-4c62-8331-5fce1a922ead'),
	('00000000-0000-0000-0000-000000000000', 95, '0q3Y7TjQ04su8JkNFzhW2w', '140cac15-d22a-46d8-9de9-fbc01aa84c94', true, '2025-01-20 20:12:23.498284+00', '2025-01-20 21:12:30.321478+00', 'qza8G-nZtcRv49cIKROGRw', 'd96b8e38-a2c3-4c62-8331-5fce1a922ead'),
	('00000000-0000-0000-0000-000000000000', 96, 'pSlhVA6WCGC97L-GspOj5A', '140cac15-d22a-46d8-9de9-fbc01aa84c94', true, '2025-01-20 21:12:30.323481+00', '2025-01-20 22:21:00.82153+00', '0q3Y7TjQ04su8JkNFzhW2w', 'd96b8e38-a2c3-4c62-8331-5fce1a922ead'),
	('00000000-0000-0000-0000-000000000000', 97, '0c4o_X5CdFr88W5uG0eHXQ', '140cac15-d22a-46d8-9de9-fbc01aa84c94', true, '2025-01-20 22:21:00.823048+00', '2025-01-20 23:21:07.562332+00', 'pSlhVA6WCGC97L-GspOj5A', 'd96b8e38-a2c3-4c62-8331-5fce1a922ead'),
	('00000000-0000-0000-0000-000000000000', 98, 'CgkZkjteXTl0b7FaaiSlDA', '140cac15-d22a-46d8-9de9-fbc01aa84c94', true, '2025-01-20 23:21:07.564755+00', '2025-01-21 00:29:59.665454+00', '0c4o_X5CdFr88W5uG0eHXQ', 'd96b8e38-a2c3-4c62-8331-5fce1a922ead'),
	('00000000-0000-0000-0000-000000000000', 99, 'dZcH4gHUnTeBV7LPga2dIg', '140cac15-d22a-46d8-9de9-fbc01aa84c94', true, '2025-01-21 00:29:59.666896+00', '2025-01-21 01:28:20.500308+00', 'CgkZkjteXTl0b7FaaiSlDA', 'd96b8e38-a2c3-4c62-8331-5fce1a922ead'),
	('00000000-0000-0000-0000-000000000000', 100, 'AfHEt6oKbfOvNfzOy0gxxg', '140cac15-d22a-46d8-9de9-fbc01aa84c94', true, '2025-01-21 01:28:20.501672+00', '2025-01-21 02:31:22.158124+00', 'dZcH4gHUnTeBV7LPga2dIg', 'd96b8e38-a2c3-4c62-8331-5fce1a922ead'),
	('00000000-0000-0000-0000-000000000000', 102, 'UHHXZ8lfPS5L_FmRM2Fv5g', '140cac15-d22a-46d8-9de9-fbc01aa84c94', false, '2025-01-21 04:42:29.63634+00', '2025-01-21 04:42:29.63634+00', NULL, 'd7b9ea06-a006-4a37-bf8d-65e1682d1c77'),
	('00000000-0000-0000-0000-000000000000', 101, 'pnaNBYsuTlsXoKHojJsnBw', '140cac15-d22a-46d8-9de9-fbc01aa84c94', true, '2025-01-21 02:31:22.160317+00', '2025-01-21 13:56:01.693251+00', 'AfHEt6oKbfOvNfzOy0gxxg', 'd96b8e38-a2c3-4c62-8331-5fce1a922ead'),
	('00000000-0000-0000-0000-000000000000', 103, 'gbRFAy6o6VVgw563dzFbEg', '140cac15-d22a-46d8-9de9-fbc01aa84c94', true, '2025-01-21 13:56:01.698851+00', '2025-01-21 14:54:16.260274+00', 'pnaNBYsuTlsXoKHojJsnBw', 'd96b8e38-a2c3-4c62-8331-5fce1a922ead'),
	('00000000-0000-0000-0000-000000000000', 104, 'QmqcGWM1N3NDWZYjQRvZHw', '140cac15-d22a-46d8-9de9-fbc01aa84c94', true, '2025-01-21 14:54:16.263906+00', '2025-01-21 15:52:37.684292+00', 'gbRFAy6o6VVgw563dzFbEg', 'd96b8e38-a2c3-4c62-8331-5fce1a922ead'),
	('00000000-0000-0000-0000-000000000000', 105, 'IOF84gRZDN1N3f9mn7QoYQ', '140cac15-d22a-46d8-9de9-fbc01aa84c94', true, '2025-01-21 15:52:37.69114+00', '2025-01-21 16:52:44.28059+00', 'QmqcGWM1N3NDWZYjQRvZHw', 'd96b8e38-a2c3-4c62-8331-5fce1a922ead'),
	('00000000-0000-0000-0000-000000000000', 106, 'oEhzUtD05uaVVOWaQOLSWg', '140cac15-d22a-46d8-9de9-fbc01aa84c94', true, '2025-01-21 16:52:44.28198+00', '2025-01-21 17:54:21.709759+00', 'IOF84gRZDN1N3f9mn7QoYQ', 'd96b8e38-a2c3-4c62-8331-5fce1a922ead'),
	('00000000-0000-0000-0000-000000000000', 107, 'HuYAmG3XRrkBV8pZjWg6Sg', '140cac15-d22a-46d8-9de9-fbc01aa84c94', true, '2025-01-21 17:54:21.715987+00', '2025-01-21 18:54:21.720642+00', 'oEhzUtD05uaVVOWaQOLSWg', 'd96b8e38-a2c3-4c62-8331-5fce1a922ead'),
	('00000000-0000-0000-0000-000000000000', 108, 'YBjCPHSonEdyA4F3mBdDAw', '140cac15-d22a-46d8-9de9-fbc01aa84c94', true, '2025-01-21 18:54:21.722076+00', '2025-01-21 19:59:53.269398+00', 'HuYAmG3XRrkBV8pZjWg6Sg', 'd96b8e38-a2c3-4c62-8331-5fce1a922ead'),
	('00000000-0000-0000-0000-000000000000', 33, 'rqD6GiGy47ZV_QFTjwASfw', 'eab9f72a-0bf2-4984-9119-42ed603245be', true, '2025-01-18 02:05:27.181816+00', '2025-01-18 03:03:35.877926+00', NULL, '0221114e-8afb-48f4-8766-92ed772ae9de'),
	('00000000-0000-0000-0000-000000000000', 109, 'jFRDF5wMTUPhG7J0iHnlwQ', '140cac15-d22a-46d8-9de9-fbc01aa84c94', true, '2025-01-21 19:59:53.272644+00', '2025-01-21 20:59:58.77832+00', 'YBjCPHSonEdyA4F3mBdDAw', 'd96b8e38-a2c3-4c62-8331-5fce1a922ead'),
	('00000000-0000-0000-0000-000000000000', 110, 'xNxwMymwq5_oBSiTnJ9l0g', '140cac15-d22a-46d8-9de9-fbc01aa84c94', true, '2025-01-21 20:59:58.780417+00', '2025-01-21 22:07:25.37148+00', 'jFRDF5wMTUPhG7J0iHnlwQ', 'd96b8e38-a2c3-4c62-8331-5fce1a922ead'),
	('00000000-0000-0000-0000-000000000000', 35, 'jALgcLpNqxHEsR0iXGiJLg', 'eab9f72a-0bf2-4984-9119-42ed603245be', true, '2025-01-18 03:03:35.881113+00', '2025-01-18 04:01:55.302804+00', 'rqD6GiGy47ZV_QFTjwASfw', '0221114e-8afb-48f4-8766-92ed772ae9de'),
	('00000000-0000-0000-0000-000000000000', 111, 'Ac3Hq8tjFFa8g2hU3EildQ', '140cac15-d22a-46d8-9de9-fbc01aa84c94', true, '2025-01-21 22:07:25.375001+00', '2025-01-21 23:07:32.32362+00', 'xNxwMymwq5_oBSiTnJ9l0g', 'd96b8e38-a2c3-4c62-8331-5fce1a922ead'),
	('00000000-0000-0000-0000-000000000000', 37, '50f-1qho-FktpQPa8slmTw', 'eab9f72a-0bf2-4984-9119-42ed603245be', true, '2025-01-18 04:01:55.305309+00', '2025-01-18 05:12:34.00991+00', 'jALgcLpNqxHEsR0iXGiJLg', '0221114e-8afb-48f4-8766-92ed772ae9de'),
	('00000000-0000-0000-0000-000000000000', 112, 'C2g2AaZ5rvjfqcYP8QFa2w', '140cac15-d22a-46d8-9de9-fbc01aa84c94', true, '2025-01-21 23:07:32.327027+00', '2025-01-22 00:17:51.692293+00', 'Ac3Hq8tjFFa8g2hU3EildQ', 'd96b8e38-a2c3-4c62-8331-5fce1a922ead'),
	('00000000-0000-0000-0000-000000000000', 39, 'xgG9Xo8YkAAUFrM9roZwLw', 'eab9f72a-0bf2-4984-9119-42ed603245be', true, '2025-01-18 05:12:34.010273+00', '2025-01-18 06:54:17.794295+00', '50f-1qho-FktpQPa8slmTw', '0221114e-8afb-48f4-8766-92ed772ae9de'),
	('00000000-0000-0000-0000-000000000000', 113, 'DK6nAkLuLd4q26MdRFi-3g', '140cac15-d22a-46d8-9de9-fbc01aa84c94', true, '2025-01-22 00:17:51.695179+00', '2025-01-22 01:17:52.816485+00', 'C2g2AaZ5rvjfqcYP8QFa2w', 'd96b8e38-a2c3-4c62-8331-5fce1a922ead'),
	('00000000-0000-0000-0000-000000000000', 40, 'n2XJzvTWQo64wA0vxddiSg', 'eab9f72a-0bf2-4984-9119-42ed603245be', true, '2025-01-18 06:54:17.801294+00', '2025-01-18 07:52:45.786152+00', 'xgG9Xo8YkAAUFrM9roZwLw', '0221114e-8afb-48f4-8766-92ed772ae9de'),
	('00000000-0000-0000-0000-000000000000', 114, 'nm7tvyDgMh0-lF5MtoniRg', '140cac15-d22a-46d8-9de9-fbc01aa84c94', true, '2025-01-22 01:17:52.818497+00', '2025-01-22 02:17:52.630643+00', 'DK6nAkLuLd4q26MdRFi-3g', 'd96b8e38-a2c3-4c62-8331-5fce1a922ead'),
	('00000000-0000-0000-0000-000000000000', 115, 'TfaEYh-mEuq1vjBM-Trg8Q', '140cac15-d22a-46d8-9de9-fbc01aa84c94', false, '2025-01-22 02:17:52.633005+00', '2025-01-22 02:17:52.633005+00', 'nm7tvyDgMh0-lF5MtoniRg', 'd96b8e38-a2c3-4c62-8331-5fce1a922ead'),
	('00000000-0000-0000-0000-000000000000', 42, 'ublBzh3ZBFP6hfP21ljJHg', 'eab9f72a-0bf2-4984-9119-42ed603245be', true, '2025-01-18 07:52:45.789503+00', '2025-01-18 09:14:41.379877+00', 'n2XJzvTWQo64wA0vxddiSg', '0221114e-8afb-48f4-8766-92ed772ae9de'),
	('00000000-0000-0000-0000-000000000000', 116, 'ng_i65SprNXeMONY1lXNDA', '140cac15-d22a-46d8-9de9-fbc01aa84c94', true, '2025-01-22 02:21:02.138852+00', '2025-01-22 14:19:23.241826+00', NULL, '8267a1df-3d32-4539-9755-5f041248f68c'),
	('00000000-0000-0000-0000-000000000000', 117, '1Ed92iYVjyYaETF0QAlOxQ', '140cac15-d22a-46d8-9de9-fbc01aa84c94', true, '2025-01-22 14:19:23.259528+00', '2025-01-22 15:19:24.120408+00', 'ng_i65SprNXeMONY1lXNDA', '8267a1df-3d32-4539-9755-5f041248f68c'),
	('00000000-0000-0000-0000-000000000000', 44, 'GDkwQdOxdbC6ZgmFqCMSUg', 'eab9f72a-0bf2-4984-9119-42ed603245be', true, '2025-01-18 09:14:41.383726+00', '2025-01-18 10:24:20.960195+00', 'ublBzh3ZBFP6hfP21ljJHg', '0221114e-8afb-48f4-8766-92ed772ae9de'),
	('00000000-0000-0000-0000-000000000000', 46, '3gHekVgH_T3wjwCtVnKwJA', 'eab9f72a-0bf2-4984-9119-42ed603245be', false, '2025-01-18 10:24:20.965031+00', '2025-01-18 10:24:20.965031+00', 'GDkwQdOxdbC6ZgmFqCMSUg', '0221114e-8afb-48f4-8766-92ed772ae9de'),
	('00000000-0000-0000-0000-000000000000', 118, 'iHVZwVK5if661u7JuUnklg', '140cac15-d22a-46d8-9de9-fbc01aa84c94', true, '2025-01-22 15:19:24.12393+00', '2025-01-22 16:19:29.120205+00', '1Ed92iYVjyYaETF0QAlOxQ', '8267a1df-3d32-4539-9755-5f041248f68c'),
	('00000000-0000-0000-0000-000000000000', 119, 'uN4tvHH-AmaXAKgEq0u2ZQ', '140cac15-d22a-46d8-9de9-fbc01aa84c94', true, '2025-01-22 16:19:29.12283+00', '2025-01-22 17:55:18.434235+00', 'iHVZwVK5if661u7JuUnklg', '8267a1df-3d32-4539-9755-5f041248f68c'),
	('00000000-0000-0000-0000-000000000000', 120, '_zw_ENVijB63AkNRlQlGjg', '140cac15-d22a-46d8-9de9-fbc01aa84c94', true, '2025-01-22 17:55:18.435719+00', '2025-01-22 18:55:22.046985+00', 'uN4tvHH-AmaXAKgEq0u2ZQ', '8267a1df-3d32-4539-9755-5f041248f68c'),
	('00000000-0000-0000-0000-000000000000', 121, 'ZUyZ8fy3MroGA1aHGzSYCg', '140cac15-d22a-46d8-9de9-fbc01aa84c94', true, '2025-01-22 18:55:22.049861+00', '2025-01-22 19:58:02.839538+00', '_zw_ENVijB63AkNRlQlGjg', '8267a1df-3d32-4539-9755-5f041248f68c'),
	('00000000-0000-0000-0000-000000000000', 122, 'jlsH9dPX0RCnUYLAH7eTVw', '140cac15-d22a-46d8-9de9-fbc01aa84c94', true, '2025-01-22 19:58:02.844425+00', '2025-01-22 20:58:11.665387+00', 'ZUyZ8fy3MroGA1aHGzSYCg', '8267a1df-3d32-4539-9755-5f041248f68c'),
	('00000000-0000-0000-0000-000000000000', 123, 'iaOv2vjDXHpbX324Nx73uA', '140cac15-d22a-46d8-9de9-fbc01aa84c94', true, '2025-01-22 20:58:11.668706+00', '2025-01-22 22:03:53.142164+00', 'jlsH9dPX0RCnUYLAH7eTVw', '8267a1df-3d32-4539-9755-5f041248f68c'),
	('00000000-0000-0000-0000-000000000000', 124, 'sAuBqgCG57R74BLHJ5GEdA', '140cac15-d22a-46d8-9de9-fbc01aa84c94', true, '2025-01-22 22:03:53.143688+00', '2025-01-22 23:03:59.2414+00', 'iaOv2vjDXHpbX324Nx73uA', '8267a1df-3d32-4539-9755-5f041248f68c'),
	('00000000-0000-0000-0000-000000000000', 125, 'hr6FhyLtBZ4cV5JbWNbguQ', '140cac15-d22a-46d8-9de9-fbc01aa84c94', true, '2025-01-22 23:03:59.243028+00', '2025-01-23 00:04:09.105623+00', 'sAuBqgCG57R74BLHJ5GEdA', '8267a1df-3d32-4539-9755-5f041248f68c'),
	('00000000-0000-0000-0000-000000000000', 126, '4g1gjEaoa3havrO6R8_HXw', '140cac15-d22a-46d8-9de9-fbc01aa84c94', true, '2025-01-23 00:04:09.106482+00', '2025-01-23 01:02:32.098161+00', 'hr6FhyLtBZ4cV5JbWNbguQ', '8267a1df-3d32-4539-9755-5f041248f68c'),
	('00000000-0000-0000-0000-000000000000', 127, 'gAE5SnMN6VkseizaHmkHKg', '140cac15-d22a-46d8-9de9-fbc01aa84c94', true, '2025-01-23 01:02:32.104829+00', '2025-01-23 02:08:53.205286+00', '4g1gjEaoa3havrO6R8_HXw', '8267a1df-3d32-4539-9755-5f041248f68c'),
	('00000000-0000-0000-0000-000000000000', 128, 'BnJU9A2gry4rySG5S6NNZw', '140cac15-d22a-46d8-9de9-fbc01aa84c94', true, '2025-01-23 02:08:53.210719+00', '2025-01-23 13:40:05.045984+00', 'gAE5SnMN6VkseizaHmkHKg', '8267a1df-3d32-4539-9755-5f041248f68c'),
	('00000000-0000-0000-0000-000000000000', 129, 'aM8BXJ_qX3B-kljGpofyxQ', '140cac15-d22a-46d8-9de9-fbc01aa84c94', true, '2025-01-23 13:40:05.052282+00', '2025-01-23 14:40:17.77311+00', 'BnJU9A2gry4rySG5S6NNZw', '8267a1df-3d32-4539-9755-5f041248f68c'),
	('00000000-0000-0000-0000-000000000000', 130, 'AwuUwJoDcJAH0wKJ0JYiOg', '140cac15-d22a-46d8-9de9-fbc01aa84c94', true, '2025-01-23 14:40:17.777344+00', '2025-01-23 15:40:23.260465+00', 'aM8BXJ_qX3B-kljGpofyxQ', '8267a1df-3d32-4539-9755-5f041248f68c'),
	('00000000-0000-0000-0000-000000000000', 131, 'swg-HiCETd_vQw_i2DMYPw', '140cac15-d22a-46d8-9de9-fbc01aa84c94', false, '2025-01-23 15:40:23.265218+00', '2025-01-23 15:40:23.265218+00', 'AwuUwJoDcJAH0wKJ0JYiOg', '8267a1df-3d32-4539-9755-5f041248f68c');


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: key; Type: TABLE DATA; Schema: pgsodium; Owner: supabase_admin
--



--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."profiles" ("id", "updatedAt", "username", "fullName", "avatar_url", "website") VALUES
	('8fe422fe-ac2d-484d-8274-6faf27efcf09', '2025-01-13 15:17:20.467+00', 'lvluu', 'Loi Van Luu', NULL, NULL),
	('a1039db5-13fb-4771-8f8e-d5f507512e88', '2025-01-13 14:03:36.129+00', 'nhle', 'Nam Hoang Le', NULL, NULL),
	('eab9f72a-0bf2-4984-9119-42ed603245be', NULL, 'bvphan', 'Ben Van Phan', NULL, NULL),
	('af5560c9-7438-4af4-8964-9c661e140e6e', NULL, 'ctbtran', 'Chau Thi Bang Tran', NULL, NULL),
	('140cac15-d22a-46d8-9de9-fbc01aa84c94', NULL, 'lhpham', 'Long Hoang Pham', NULL, NULL);


--
-- Data for Name: bills; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."bills" ("id", "createdAt", "description", "issuedAt", "creatorId", "updated_at", "updaterId") VALUES
	('39c0ec0f-94d6-40f7-baa7-e87a535e6b5d', '2025-01-11 03:18:13.571127+00', 'Thachy', '2025-01-12', 'a1039db5-13fb-4771-8f8e-d5f507512e88', '2025-01-18 02:47:55.975669+00', NULL),
	('c9e09dbd-a918-4ade-8abc-ad359ff71c26', '2025-01-11 03:38:05.820491+00', 'Thurday Lunch', '2025-01-12', '140cac15-d22a-46d8-9de9-fbc01aa84c94', '2025-01-18 02:47:55.975669+00', NULL),
	('fd73637a-ddca-4edb-bf64-1f7b2b5c5e28', '2024-12-24 03:29:15.822269+00', 'Monday Lunch', '2025-01-12', '8fe422fe-ac2d-484d-8274-6faf27efcf09', '2025-01-18 02:47:55.975669+00', NULL),
	('5a4d9cb2-db83-4355-89d0-3c2f164a746b', '2025-01-20 13:36:31.408416+00', 'Birthday Gift', '2025-01-20', '8fe422fe-ac2d-484d-8274-6faf27efcf09', '2025-01-20 13:36:31.408416+00', NULL),
	('26f95b13-1c9d-4a0a-92d1-0adf505cadcf', '2025-01-20 13:37:16.840595+00', 'Camping Trip', '2025-01-20', '140cac15-d22a-46d8-9de9-fbc01aa84c94', '2025-01-20 13:37:16.840595+00', NULL),
	('f5539c9c-d964-4085-b8b2-27ae49cd0459', '2025-01-20 13:38:22.916599+00', 'Home Repairs', '2025-01-20', '140cac15-d22a-46d8-9de9-fbc01aa84c94', '2025-01-20 13:38:22.916599+00', NULL),
	('219a8295-44ea-4e40-b5c6-31fe74dbb574', '2024-01-11 03:31:07.147586+00', 'Dinner', '2024-01-12', '8fe422fe-ac2d-484d-8274-6faf27efcf09', '2025-01-18 02:47:55.975669+00', NULL),
	('9f4891dc-fa7d-4096-afa1-6f5c56b3921a', '2025-01-12 08:29:58.563509+00', 'Wednesday Lunch', '2025-01-12', 'af5560c9-7438-4af4-8964-9c661e140e6e', '2025-01-23 01:22:17.00684+00', '140cac15-d22a-46d8-9de9-fbc01aa84c94'),
	('03a98d72-01d4-4aeb-8bb0-5b0473baff2e', '2025-01-20 13:35:59.822501+00', 'Team lunch', '2024-01-22', 'eab9f72a-0bf2-4984-9119-42ed603245be', '2025-01-23 14:03:00.018134+00', '140cac15-d22a-46d8-9de9-fbc01aa84c94'),
	('c420f241-5493-454a-8f4f-50159cf45767', '2025-01-23 14:05:31.96471+00', 'aaa', '2025-01-23', '140cac15-d22a-46d8-9de9-fbc01aa84c94', '2025-01-23 14:05:31.96471+00', NULL),
	('ebff2db0-8c66-43d6-b572-74d9c5325783', '2025-01-23 14:15:45.257977+00', 'a1', '2025-01-23', '140cac15-d22a-46d8-9de9-fbc01aa84c94', '2025-01-23 15:23:44.506548+00', '140cac15-d22a-46d8-9de9-fbc01aa84c94');


--
-- Data for Name: bill_members; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."bill_members" ("id", "createdAt", "amount", "updatedAt", "billId", "role", "userId") VALUES
	('7f50f18c-dabf-4838-86e1-105c5538fe71', '2025-01-11 03:38:06.007318+00', 85, NULL, 'c9e09dbd-a918-4ade-8abc-ad359ff71c26', 'Debtor', '140cac15-d22a-46d8-9de9-fbc01aa84c94'),
	('4aea80ec-bbb5-49d5-96fe-b099bfae7a8e', '2025-01-12 08:29:58.761565+00', 30, NULL, '9f4891dc-fa7d-4096-afa1-6f5c56b3921a', 'Debtor', '140cac15-d22a-46d8-9de9-fbc01aa84c94'),
	('f3f9ed7c-cc78-41bb-8939-9eb09a94476a', '2025-01-12 08:29:58.761565+00', 20, NULL, '9f4891dc-fa7d-4096-afa1-6f5c56b3921a', 'Debtor', 'eab9f72a-0bf2-4984-9119-42ed603245be'),
	('8136e1d1-97a2-4a42-8706-7f84f0daddbc', '2025-01-12 08:29:58.761565+00', 40, NULL, '9f4891dc-fa7d-4096-afa1-6f5c56b3921a', 'Debtor', 'af5560c9-7438-4af4-8964-9c661e140e6e'),
	('194c2abc-a494-47d8-a1f5-fcc934058351', '2025-01-12 08:29:58.761565+00', 90, NULL, '9f4891dc-fa7d-4096-afa1-6f5c56b3921a', 'Creditor', 'a1039db5-13fb-4771-8f8e-d5f507512e88'),
	('3f75b7d6-9dbb-4ab4-89cc-0ade4e8a9666', '2025-01-20 13:38:23.044926+00', 50, NULL, 'f5539c9c-d964-4085-b8b2-27ae49cd0459', 'Debtor', 'eab9f72a-0bf2-4984-9119-42ed603245be'),
	('074be8b1-f443-4459-bb52-721a9a953e3d', '2025-01-20 13:38:23.044926+00', 50, NULL, 'f5539c9c-d964-4085-b8b2-27ae49cd0459', 'Debtor', '8fe422fe-ac2d-484d-8274-6faf27efcf09'),
	('49109ca7-1841-471b-8279-75f787bdc2bb', '2025-01-11 03:38:06.007318+00', 40, NULL, 'c9e09dbd-a918-4ade-8abc-ad359ff71c26', 'Debtor', 'a1039db5-13fb-4771-8f8e-d5f507512e88'),
	('507d2f45-56aa-4fa4-b1ab-87d8ced38cf5', '2025-01-13 13:49:18.612852+00', 30, NULL, 'fd73637a-ddca-4edb-bf64-1f7b2b5c5e28', 'Debtor', 'a1039db5-13fb-4771-8f8e-d5f507512e88'),
	('07b2c274-e89f-4183-a632-27915b9560d6', '2025-01-20 14:08:34.079783+00', 35, NULL, 'f5539c9c-d964-4085-b8b2-27ae49cd0459', 'Debtor', '140cac15-d22a-46d8-9de9-fbc01aa84c94'),
	('73db7828-379a-4a0e-b950-382cc602aaf6', '2025-01-20 13:38:23.044926+00', 260, NULL, 'f5539c9c-d964-4085-b8b2-27ae49cd0459', 'Creditor', '140cac15-d22a-46d8-9de9-fbc01aa84c94'),
	('20179d5c-8fdc-4b7f-9aae-f7c7bb3e6453', '2025-01-20 13:36:00.036862+00', 76, NULL, '03a98d72-01d4-4aeb-8bb0-5b0473baff2e', 'Debtor', 'af5560c9-7438-4af4-8964-9c661e140e6e'),
	('808c69c4-9e9a-43f0-b44e-2b47a4e08b11', '2025-01-20 13:36:00.036862+00', 127, NULL, '03a98d72-01d4-4aeb-8bb0-5b0473baff2e', 'Creditor', 'eab9f72a-0bf2-4984-9119-42ed603245be'),
	('78fe0fe4-0590-42bf-94e8-d2f0dff89fe8', '2025-01-12 07:54:13.745803+00', 55, NULL, 'fd73637a-ddca-4edb-bf64-1f7b2b5c5e28', 'Creditor', 'eab9f72a-0bf2-4984-9119-42ed603245be'),
	('3280541c-d4a5-4a5f-add8-07d63764dac6', '2025-01-20 13:36:00.036862+00', 51, NULL, '03a98d72-01d4-4aeb-8bb0-5b0473baff2e', 'Debtor', '140cac15-d22a-46d8-9de9-fbc01aa84c94'),
	('0e3db956-8d14-48e4-91ac-84f1787e5780', '2025-01-23 14:05:32.185677+00', 200, NULL, 'c420f241-5493-454a-8f4f-50159cf45767', 'Debtor', '8fe422fe-ac2d-484d-8274-6faf27efcf09'),
	('bcbd4eb9-ff7d-4623-95ca-6b0b97f7aad6', '2025-01-11 03:29:16.003857+00', 25, NULL, 'fd73637a-ddca-4edb-bf64-1f7b2b5c5e28', 'Debtor', '140cac15-d22a-46d8-9de9-fbc01aa84c94'),
	('d61373e5-8ed1-46c9-ba98-a41d83f34a00', '2025-01-11 03:18:13.788169+00', 23, NULL, '39c0ec0f-94d6-40f7-baa7-e87a535e6b5d', 'Debtor', 'eab9f72a-0bf2-4984-9119-42ed603245be'),
	('2e01f631-5eca-4831-ae4a-0c8cc9954f1c', '2025-01-23 14:05:32.185677+00', 100, NULL, 'c420f241-5493-454a-8f4f-50159cf45767', 'Creditor', 'a1039db5-13fb-4771-8f8e-d5f507512e88'),
	('f22358a9-1224-4d19-bf65-41eb898b38ed', '2025-01-12 07:55:25.066162+00', 50, NULL, '39c0ec0f-94d6-40f7-baa7-e87a535e6b5d', 'Creditor', 'a1039db5-13fb-4771-8f8e-d5f507512e88'),
	('f2d8c702-3c71-4d24-b8c3-9c00fe6ac5df', '2025-01-11 03:18:13.788169+00', 27, NULL, '39c0ec0f-94d6-40f7-baa7-e87a535e6b5d', 'Debtor', 'af5560c9-7438-4af4-8964-9c661e140e6e'),
	('c7708621-ed79-431f-8d4c-24831b19e404', '2025-01-23 14:15:45.448894+00', 200, NULL, 'ebff2db0-8c66-43d6-b572-74d9c5325783', 'Creditor', '8fe422fe-ac2d-484d-8274-6faf27efcf09'),
	('55b61384-76d1-41b5-abe5-4bf5712266ea', '2025-01-23 14:15:45.448894+00', 2, NULL, 'ebff2db0-8c66-43d6-b572-74d9c5325783', 'Debtor', 'a1039db5-13fb-4771-8f8e-d5f507512e88'),
	('570cd0a6-7cc1-4874-956d-eab7821b0912', '2025-01-11 03:31:07.501176+00', 45, NULL, '219a8295-44ea-4e40-b5c6-31fe74dbb574', 'Debtor', 'af5560c9-7438-4af4-8964-9c661e140e6e'),
	('97eacbf6-76cb-4a65-9cd5-1d07ae4ba296', '2025-01-18 10:38:45.454984+00', 45, NULL, '219a8295-44ea-4e40-b5c6-31fe74dbb574', 'Debtor', 'eab9f72a-0bf2-4984-9119-42ed603245be'),
	('68c84e61-1165-459b-b590-eacd87278755', '2025-01-19 14:13:27.154222+00', 125, NULL, 'c9e09dbd-a918-4ade-8abc-ad359ff71c26', 'Creditor', '140cac15-d22a-46d8-9de9-fbc01aa84c94'),
	('5b311a3e-61da-438e-8508-ff8de64447e1', '2025-01-20 13:36:31.520168+00', 200, NULL, '5a4d9cb2-db83-4355-89d0-3c2f164a746b', 'Debtor', '8fe422fe-ac2d-484d-8274-6faf27efcf09'),
	('026bbd88-e9b8-4f7e-b588-b979a7232a16', '2025-01-20 13:36:31.520168+00', 40, NULL, '5a4d9cb2-db83-4355-89d0-3c2f164a746b', 'Debtor', 'a1039db5-13fb-4771-8f8e-d5f507512e88'),
	('5199e672-e33e-4b95-8339-a0b40f7812cc', '2025-01-20 13:36:31.520168+00', 240, NULL, '5a4d9cb2-db83-4355-89d0-3c2f164a746b', 'Creditor', '8fe422fe-ac2d-484d-8274-6faf27efcf09'),
	('4a7cdaa5-b80e-4ade-a7e9-d9e19623f3b7', '2025-01-20 13:37:16.977212+00', 200, NULL, '26f95b13-1c9d-4a0a-92d1-0adf505cadcf', 'Debtor', 'af5560c9-7438-4af4-8964-9c661e140e6e'),
	('557b0e40-5f51-43c5-bbf9-208c097e89af', '2025-01-20 13:37:16.977212+00', 300, NULL, '26f95b13-1c9d-4a0a-92d1-0adf505cadcf', 'Debtor', '8fe422fe-ac2d-484d-8274-6faf27efcf09'),
	('44572d8c-7d4a-4c26-bc0a-a762b05efd38', '2025-01-20 13:37:16.977212+00', 300, NULL, '26f95b13-1c9d-4a0a-92d1-0adf505cadcf', 'Debtor', 'a1039db5-13fb-4771-8f8e-d5f507512e88'),
	('d5a50156-991a-4ed7-a1b9-b57907efe164', '2025-01-20 13:37:16.977212+00', 200, NULL, '26f95b13-1c9d-4a0a-92d1-0adf505cadcf', 'Debtor', '140cac15-d22a-46d8-9de9-fbc01aa84c94'),
	('fbd6775e-a5c4-457a-8bac-9832d9908d41', '2025-01-20 13:37:16.977212+00', 1000, NULL, '26f95b13-1c9d-4a0a-92d1-0adf505cadcf', 'Creditor', '140cac15-d22a-46d8-9de9-fbc01aa84c94'),
	('07643225-2e44-45cf-a7d7-bc06c9121d0c', '2025-01-20 13:38:23.044926+00', 25, NULL, 'f5539c9c-d964-4085-b8b2-27ae49cd0459', 'Debtor', 'a1039db5-13fb-4771-8f8e-d5f507512e88'),
	('f7ea398b-2cd8-4156-9c17-642deb2342e0', '2025-01-12 07:55:56.27286+00', 85, NULL, '219a8295-44ea-4e40-b5c6-31fe74dbb574', 'Creditor', '140cac15-d22a-46d8-9de9-fbc01aa84c94'),
	('07d9bda9-7ab6-43c9-8d77-14b1f7fecc6f', '2025-01-20 13:38:23.044926+00', 100, NULL, 'f5539c9c-d964-4085-b8b2-27ae49cd0459', 'Debtor', 'af5560c9-7438-4af4-8964-9c661e140e6e');


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."notifications" ("id", "userId", "readStatus", "type", "metadata", "createdAt", "billId", "triggerId") VALUES
	('d7488487-0dd5-4e57-9b7f-9a3c53b88714', 'af5560c9-7438-4af4-8964-9c661e140e6e', false, 'BillCreated', NULL, '2025-01-20 13:36:00.169017+00', '03a98d72-01d4-4aeb-8bb0-5b0473baff2e', '140cac15-d22a-46d8-9de9-fbc01aa84c94'),
	('b0c209bb-341c-4887-a281-b5d098a32f6c', '140cac15-d22a-46d8-9de9-fbc01aa84c94', false, 'BillCreated', NULL, '2025-01-20 13:36:00.169017+00', '03a98d72-01d4-4aeb-8bb0-5b0473baff2e', '140cac15-d22a-46d8-9de9-fbc01aa84c94'),
	('15687f89-a963-4b0a-8df2-6bbfcbc31e0d', '8fe422fe-ac2d-484d-8274-6faf27efcf09', false, 'BillCreated', NULL, '2025-01-20 13:36:31.805709+00', '5a4d9cb2-db83-4355-89d0-3c2f164a746b', '140cac15-d22a-46d8-9de9-fbc01aa84c94'),
	('3e2d6aaa-ea79-493e-a7de-994f44265c0f', 'a1039db5-13fb-4771-8f8e-d5f507512e88', false, 'BillCreated', NULL, '2025-01-20 13:36:31.805709+00', '5a4d9cb2-db83-4355-89d0-3c2f164a746b', '140cac15-d22a-46d8-9de9-fbc01aa84c94'),
	('ccdb8b4e-2da9-4b26-9639-951cd7896ad4', 'af5560c9-7438-4af4-8964-9c661e140e6e', false, 'BillCreated', NULL, '2025-01-20 13:37:17.128636+00', '26f95b13-1c9d-4a0a-92d1-0adf505cadcf', '140cac15-d22a-46d8-9de9-fbc01aa84c94'),
	('35d6fba0-4cc6-492a-9a7b-a93b126a8987', '8fe422fe-ac2d-484d-8274-6faf27efcf09', false, 'BillCreated', NULL, '2025-01-20 13:37:17.128636+00', '26f95b13-1c9d-4a0a-92d1-0adf505cadcf', '140cac15-d22a-46d8-9de9-fbc01aa84c94'),
	('a22583ce-9c98-4d07-9208-8c153c34a31f', 'a1039db5-13fb-4771-8f8e-d5f507512e88', false, 'BillCreated', NULL, '2025-01-20 13:37:17.128636+00', '26f95b13-1c9d-4a0a-92d1-0adf505cadcf', '140cac15-d22a-46d8-9de9-fbc01aa84c94'),
	('5587629c-f0d1-4f54-9f30-d98ce7dbe8d1', '140cac15-d22a-46d8-9de9-fbc01aa84c94', false, 'BillCreated', NULL, '2025-01-20 13:37:17.128636+00', '26f95b13-1c9d-4a0a-92d1-0adf505cadcf', '140cac15-d22a-46d8-9de9-fbc01aa84c94'),
	('19a8400c-ee01-4f89-942e-eb74cf606fc5', 'a1039db5-13fb-4771-8f8e-d5f507512e88', false, 'BillCreated', NULL, '2025-01-20 13:38:23.168225+00', 'f5539c9c-d964-4085-b8b2-27ae49cd0459', '140cac15-d22a-46d8-9de9-fbc01aa84c94'),
	('dca427bd-1c86-4832-9c51-13fec1010e62', 'eab9f72a-0bf2-4984-9119-42ed603245be', false, 'BillCreated', NULL, '2025-01-20 13:38:23.168225+00', 'f5539c9c-d964-4085-b8b2-27ae49cd0459', '140cac15-d22a-46d8-9de9-fbc01aa84c94'),
	('e72cb6b4-0f17-407e-a3aa-68b5699835b9', 'af5560c9-7438-4af4-8964-9c661e140e6e', false, 'BillCreated', NULL, '2025-01-20 13:38:23.168225+00', 'f5539c9c-d964-4085-b8b2-27ae49cd0459', '140cac15-d22a-46d8-9de9-fbc01aa84c94'),
	('ebbc9fae-cc00-44f1-87ba-ee0db87bb821', 'eab9f72a-0bf2-4984-9119-42ed603245be', false, 'BillCreated', NULL, '2025-01-20 13:38:23.168225+00', 'f5539c9c-d964-4085-b8b2-27ae49cd0459', '140cac15-d22a-46d8-9de9-fbc01aa84c94'),
	('af54f376-309e-440b-9d4b-00f6f551f792', 'eab9f72a-0bf2-4984-9119-42ed603245be', false, 'BillUpdated', '{"previous":{"amount":35},"current":{"amount":50}}', '2025-01-20 14:08:34.224694+00', 'f5539c9c-d964-4085-b8b2-27ae49cd0459', '140cac15-d22a-46d8-9de9-fbc01aa84c94'),
	('d771753b-259b-4164-85a2-3d3861b4c886', '140cac15-d22a-46d8-9de9-fbc01aa84c94', false, 'BillUpdated', '{"current":{"amount":260},"previous":{"amount":210}}', '2025-01-21 14:44:40.545699+00', 'f5539c9c-d964-4085-b8b2-27ae49cd0459', '140cac15-d22a-46d8-9de9-fbc01aa84c94'),
	('1aa3b2a1-971c-442e-9e60-fe03bb9db110', 'eab9f72a-0bf2-4984-9119-42ed603245be', false, 'BillUpdated', '{"current":{"amount":127},"previous":{"amount":125}}', '2025-01-22 14:28:17.647993+00', '03a98d72-01d4-4aeb-8bb0-5b0473baff2e', '140cac15-d22a-46d8-9de9-fbc01aa84c94'),
	('64498da8-985d-4533-bb51-751bce8ba983', 'af5560c9-7438-4af4-8964-9c661e140e6e', false, 'BillUpdated', '{"current":{"amount":76},"previous":{"amount":75}}', '2025-01-22 14:28:17.669488+00', '03a98d72-01d4-4aeb-8bb0-5b0473baff2e', '140cac15-d22a-46d8-9de9-fbc01aa84c94'),
	('6f59115c-649b-4975-8d9d-6a6b715f7be6', '140cac15-d22a-46d8-9de9-fbc01aa84c94', false, 'BillUpdated', '{"current":{"amount":51},"previous":{"amount":50}}', '2025-01-22 14:28:17.675578+00', '03a98d72-01d4-4aeb-8bb0-5b0473baff2e', '140cac15-d22a-46d8-9de9-fbc01aa84c94'),
	('91e0d76b-342c-48da-a358-f36ad4af6fe3', '8fe422fe-ac2d-484d-8274-6faf27efcf09', false, 'BillCreated', NULL, '2025-01-23 14:05:32.392474+00', 'c420f241-5493-454a-8f4f-50159cf45767', '140cac15-d22a-46d8-9de9-fbc01aa84c94'),
	('2b77277e-e336-4d00-89ee-db1598b5d50c', 'a1039db5-13fb-4771-8f8e-d5f507512e88', false, 'BillCreated', NULL, '2025-01-23 14:15:45.653496+00', 'ebff2db0-8c66-43d6-b572-74d9c5325783', '140cac15-d22a-46d8-9de9-fbc01aa84c94'),
	('ef63637b-0089-4d21-9491-b7bd5ccc6f07', 'a1039db5-13fb-4771-8f8e-d5f507512e88', false, 'BillUpdated', '{"current":{"amount":2},"previous":{"amount":150}}', '2025-01-23 15:20:37.388015+00', 'ebff2db0-8c66-43d6-b572-74d9c5325783', '140cac15-d22a-46d8-9de9-fbc01aa84c94');


--
-- Data for Name: transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id") VALUES
	('avatars', 'avatars', NULL, '2025-01-13 13:51:07.604807+00', '2025-01-13 13:51:07.604807+00', false, false, NULL, NULL, NULL);


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 131, true);


--
-- Name: key_key_id_seq; Type: SEQUENCE SET; Schema: pgsodium; Owner: supabase_admin
--

SELECT pg_catalog.setval('"pgsodium"."key_key_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

RESET ALL;
