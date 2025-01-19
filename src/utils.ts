import type { ClientBill } from "@/types";

export function noop() {}

export function calculateMoney(bill: ClientBill, userId: string) {
	const paid = bill.creditor.userId === userId ? bill.creditor.amount : 0;
	const owed = bill.debtors.find((debtor) => debtor.userId === userId)?.amount ?? 0;

	return { net: paid - owed, paid, owed };
}
