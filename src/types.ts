import type React from "react";

import { type Database } from "@/database.types";

export interface Container {
  children: React.ReactNode;
}

export type ClientUser = Pick<
  Database["public"]["Tables"]["users"]["Row"],
  "id" | "username"
>;

export interface BillFormState {
  description: string;
  creditor?: {
    userId?: string;
    amount?: number;
  };
  debtors: Array<{
    userId?: string;
    amount?: number;
  }>;
}

export interface UserFormState {
  username?: string;
}
