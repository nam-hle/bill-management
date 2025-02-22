import { PiggyBank, CreditCard, ArrowUpIcon, ArrowDownIcon } from "lucide-react";

import { Card, CardTitle, CardHeader, CardContent } from "@/components/shadcn/card";

interface FinancialData {
	owedAmount: number;
	paidAmount: number;
	sentAmount: number;
	netBalance: number;
	receivedAmount: number;
}

const formatCurrency = (amount: number) => {
	return new Intl.NumberFormat("en-US", { currency: "USD", style: "currency" }).format(amount);
};

export function FinancialSummary({ data }: { data: FinancialData }) {
	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Owed Amount</CardTitle>
					<ArrowUpIcon className="h-4 w-4 text-red-500" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold text-red-500">{formatCurrency(data.owedAmount)}</div>
					<p className="text-xs text-muted-foreground">Amount you owe to others</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Paid Amount</CardTitle>
					<CreditCard className="h-4 w-4 text-green-500" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold text-green-500">{formatCurrency(data.paidAmount)}</div>
					<p className="text-xs text-muted-foreground">Amount you paid for bills</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Sent Amount</CardTitle>
					<ArrowUpIcon className="h-4 w-4 text-blue-500" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold text-blue-500">{formatCurrency(data.sentAmount)}</div>
					<p className="text-xs text-muted-foreground">Amount sent in transactions</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Received Amount</CardTitle>
					<ArrowDownIcon className="h-4 w-4 text-purple-500" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold text-purple-500">{formatCurrency(data.receivedAmount)}</div>
					<p className="text-xs text-muted-foreground">Amount received in transactions</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Net Balance</CardTitle>
					<PiggyBank className="h-4 w-4 text-gray-500" />
				</CardHeader>
				<CardContent>
					<div className={`text-2xl font-bold ${data.netBalance >= 0 ? "text-green-500" : "text-red-500"}`}>{formatCurrency(data.netBalance)}</div>
					<p className="text-xs text-muted-foreground">Your current balance</p>
				</CardContent>
			</Card>
		</div>
	);
}
