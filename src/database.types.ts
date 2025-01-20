export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
	public: {
		Tables: {
			bill_members: {
				Row: {
					amount: number;
					billId: string;
					createdAt: string;
					id: string;
					role: Database["public"]["Enums"]["BillMemberRole"];
					updatedAt: string | null;
					userId: string;
				};
				Insert: {
					amount: number;
					billId?: string;
					createdAt?: string;
					id?: string;
					role?: Database["public"]["Enums"]["BillMemberRole"];
					updatedAt?: string | null;
					userId: string;
				};
				Update: {
					amount?: number;
					billId?: string;
					createdAt?: string;
					id?: string;
					role?: Database["public"]["Enums"]["BillMemberRole"];
					updatedAt?: string | null;
					userId?: string;
				};
				Relationships: [
					{
						foreignKeyName: "bill_members_bill_id_fkey";
						columns: ["billId"];
						isOneToOne: false;
						referencedRelation: "bills";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "bill_members_userId_fkey";
						columns: ["userId"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["id"];
					}
				];
			};
			bills: {
				Row: {
					createdAt: string;
					creatorId: string;
					description: string;
					id: string;
					issuesAt: string;
					updatedAt: string | null;
				};
				Insert: {
					createdAt?: string;
					creatorId: string;
					description: string;
					id?: string;
					issuesAt?: string;
					updatedAt?: string | null;
				};
				Update: {
					createdAt?: string;
					creatorId?: string;
					description?: string;
					id?: string;
					issuesAt?: string;
					updatedAt?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "bills_creatorId_fkey";
						columns: ["creatorId"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["id"];
					}
				];
			};
			notifications: {
				Row: {
					billId: string | null;
					createdAt: string;
					id: string;
					metadata: Json | null;
					readStatus: boolean;
					triggerId: string;
					type: Database["public"]["Enums"]["NotificationType"];
					userId: string;
				};
				Insert: {
					billId?: string | null;
					createdAt?: string;
					id?: string;
					metadata?: Json | null;
					readStatus?: boolean;
					triggerId: string;
					type: Database["public"]["Enums"]["NotificationType"];
					userId?: string;
				};
				Update: {
					billId?: string | null;
					createdAt?: string;
					id?: string;
					metadata?: Json | null;
					readStatus?: boolean;
					triggerId?: string;
					type?: Database["public"]["Enums"]["NotificationType"];
					userId?: string;
				};
				Relationships: [
					{
						foreignKeyName: "notifications_billId_fkey";
						columns: ["billId"];
						isOneToOne: false;
						referencedRelation: "bills";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "notifications_triggerId_fkey";
						columns: ["triggerId"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "notifications_userId_fkey";
						columns: ["userId"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["id"];
					}
				];
			};
			profiles: {
				Row: {
					avatar_url: string | null;
					fullName: string;
					id: string;
					updatedAt: string | null;
					username: string;
					website: string | null;
				};
				Insert: {
					avatar_url?: string | null;
					fullName?: string;
					id: string;
					updatedAt?: string | null;
					username?: string;
					website?: string | null;
				};
				Update: {
					avatar_url?: string | null;
					fullName?: string;
					id?: string;
					updatedAt?: string | null;
					username?: string;
					website?: string | null;
				};
				Relationships: [];
			};
			transactions: {
				Row: {
					id: string;
					receiverId: string;
					senderId: string;
					status: Database["public"]["Enums"]["TransactionStatus"];
				};
				Insert: {
					id?: string;
					receiverId?: string;
					senderId?: string;
					status?: Database["public"]["Enums"]["TransactionStatus"];
				};
				Update: {
					id?: string;
					receiverId?: string;
					senderId?: string;
					status?: Database["public"]["Enums"]["TransactionStatus"];
				};
				Relationships: [
					{
						foreignKeyName: "transactions_receiverId_fkey";
						columns: ["receiverId"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "transactions_senderId_fkey";
						columns: ["senderId"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["id"];
					}
				];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			calculate_balances: {
				Args: Record<PropertyKey, never>;
				Returns: {
					user_id: string;
					balance: number;
				}[];
			};
		};
		Enums: {
			BillMemberRole: "Creditor" | "Debtor";
			NotificationType: "BillCreated" | "BillUpdated";
			TransactionStatus: "pending" | "confirmed" | "rejected";
		};
		CompositeTypes: {
			[_ in never]: never;
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
