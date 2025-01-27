export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
	graphql_public: {
		Views: {
			[_ in never]: never;
		};
		Enums: {
			[_ in never]: never;
		};
		Tables: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
		Functions: {
			graphql: {
				Returns: Json;
				Args: {
					query?: string;
					variables?: Json;
					extensions?: Json;
					operationName?: string;
				};
			};
		};
	};
	public: {
		Views: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
		Functions: {
			report: {
				Args: {
					target_user_id: string;
				};
				Returns: {
					paid: number;
					owed: number;
					sent: number;
					received: number;
					self_paid: number;
				}[];
			};
		};
		Enums: {
			BillMemberRole: "Creditor" | "Debtor";
			TransactionStatus: "Waiting" | "Confirmed" | "Declined";
			NotificationType: "BillCreated" | "BillUpdated" | "BillDeleted" | "TransactionWaiting" | "TransactionConfirmed" | "TransactionDeclined";
		};
		Tables: {
			profiles: {
				Relationships: [];
				Row: {
					id: string;
					username: string;
					full_name: string;
					website: string | null;
					avatar_url: string | null;
					updated_at: string | null;
				};
				Insert: {
					id: string;
					username?: string;
					full_name?: string;
					website?: string | null;
					avatar_url?: string | null;
					updated_at?: string | null;
				};
				Update: {
					id?: string;
					username?: string;
					full_name?: string;
					website?: string | null;
					avatar_url?: string | null;
					updated_at?: string | null;
				};
			};
			bills: {
				Row: {
					id: string;
					issued_at: string;
					created_at: string;
					creator_id: string;
					description: string;
					updated_at: string | null;
					updater_id: string | null;
				};
				Insert: {
					id?: string;
					issued_at: string;
					creator_id: string;
					created_at?: string;
					description: string;
					updated_at?: string | null;
					updater_id?: string | null;
				};
				Update: {
					id?: string;
					issued_at?: string;
					created_at?: string;
					creator_id?: string;
					description?: string;
					updated_at?: string | null;
					updater_id?: string | null;
				};
				Relationships: [
					{
						isOneToOne: false;
						columns: ["creator_id"];
						referencedColumns: ["id"];
						referencedRelation: "profiles";
						foreignKeyName: "bills_creator_id_fkey";
					},
					{
						isOneToOne: false;
						columns: ["updater_id"];
						referencedColumns: ["id"];
						referencedRelation: "profiles";
						foreignKeyName: "bills_updater_id_fkey";
					}
				];
			};
			bill_members: {
				Row: {
					id: string;
					amount: number;
					bill_id: string;
					user_id: string;
					created_at: string;
					updated_at: string | null;
					role: Database["public"]["Enums"]["BillMemberRole"];
				};
				Insert: {
					id?: string;
					amount: number;
					user_id: string;
					bill_id?: string;
					created_at?: string;
					updated_at?: string | null;
					role?: Database["public"]["Enums"]["BillMemberRole"];
				};
				Update: {
					id?: string;
					amount?: number;
					bill_id?: string;
					user_id?: string;
					created_at?: string;
					updated_at?: string | null;
					role?: Database["public"]["Enums"]["BillMemberRole"];
				};
				Relationships: [
					{
						isOneToOne: false;
						columns: ["bill_id"];
						referencedColumns: ["id"];
						referencedRelation: "bills";
						foreignKeyName: "bill_members_bill_id_fkey";
					},
					{
						isOneToOne: false;
						columns: ["user_id"];
						referencedColumns: ["id"];
						referencedRelation: "profiles";
						foreignKeyName: "bill_members_user_id_fkey";
					}
				];
			};
			transactions: {
				Row: {
					id: string;
					amount: number;
					issued_at: string;
					sender_id: string;
					created_at: string;
					receiver_id: string;
					status: Database["public"]["Enums"]["TransactionStatus"];
				};
				Insert: {
					id?: string;
					amount: number;
					issued_at: string;
					sender_id: string;
					created_at?: string;
					receiver_id: string;
					status?: Database["public"]["Enums"]["TransactionStatus"];
				};
				Update: {
					id?: string;
					amount?: number;
					issued_at?: string;
					sender_id?: string;
					created_at?: string;
					receiver_id?: string;
					status?: Database["public"]["Enums"]["TransactionStatus"];
				};
				Relationships: [
					{
						isOneToOne: false;
						columns: ["receiver_id"];
						referencedColumns: ["id"];
						referencedRelation: "profiles";
						foreignKeyName: "transactions_receiver_id_fkey";
					},
					{
						isOneToOne: false;
						columns: ["sender_id"];
						referencedColumns: ["id"];
						referencedRelation: "profiles";
						foreignKeyName: "transactions_sender_id_fkey";
					}
				];
			};
			notifications: {
				Row: {
					id: string;
					user_id: string;
					created_at: string;
					trigger_id: string;
					read_status: boolean;
					metadata: Json | null;
					bill_id: string | null;
					transaction_id: string | null;
					type: Database["public"]["Enums"]["NotificationType"];
				};
				Insert: {
					id?: string;
					user_id?: string;
					trigger_id: string;
					created_at?: string;
					read_status?: boolean;
					metadata?: Json | null;
					bill_id?: string | null;
					transaction_id?: string | null;
					type: Database["public"]["Enums"]["NotificationType"];
				};
				Update: {
					id?: string;
					user_id?: string;
					created_at?: string;
					trigger_id?: string;
					read_status?: boolean;
					metadata?: Json | null;
					bill_id?: string | null;
					transaction_id?: string | null;
					type?: Database["public"]["Enums"]["NotificationType"];
				};
				Relationships: [
					{
						isOneToOne: false;
						columns: ["bill_id"];
						referencedColumns: ["id"];
						referencedRelation: "bills";
						foreignKeyName: "notifications_bill_id_fkey";
					},
					{
						isOneToOne: false;
						referencedColumns: ["id"];
						columns: ["transaction_id"];
						referencedRelation: "transactions";
						foreignKeyName: "notifications_transaction_id_fkey";
					},
					{
						isOneToOne: false;
						columns: ["trigger_id"];
						referencedColumns: ["id"];
						referencedRelation: "profiles";
						foreignKeyName: "notifications_trigger_id_fkey";
					},
					{
						isOneToOne: false;
						columns: ["user_id"];
						referencedColumns: ["id"];
						referencedRelation: "profiles";
						foreignKeyName: "notifications_user_id_fkey";
					}
				];
			};
		};
	};
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
	PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] & PublicSchema["Views"]) | { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] & Database[PublicTableNameOrOptions["schema"]]["Views"])
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? (Database[PublicTableNameOrOptions["schema"]]["Tables"] & Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
			Row: infer R;
		}
		? R
		: never
	: PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] & PublicSchema["Views"])
		? (PublicSchema["Tables"] & PublicSchema["Views"])[PublicTableNameOrOptions] extends {
				Row: infer R;
			}
			? R
			: never
		: never;

export type TablesInsert<
	PublicTableNameOrOptions extends keyof PublicSchema["Tables"] | { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Insert: infer I;
		}
		? I
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
		? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
				Insert: infer I;
			}
			? I
			: never
		: never;

export type TablesUpdate<
	PublicTableNameOrOptions extends keyof PublicSchema["Tables"] | { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Update: infer U;
		}
		? U
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
		? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
				Update: infer U;
			}
			? U
			: never
		: never;

export type Enums<
	PublicEnumNameOrOptions extends keyof PublicSchema["Enums"] | { schema: keyof Database },
	EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
		: never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
	? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
	: PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
		? PublicSchema["Enums"][PublicEnumNameOrOptions]
		: never;

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"] | { schema: keyof Database },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
		: never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
	? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
		? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
		: never;
