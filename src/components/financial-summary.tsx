"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Frown, InfoIcon, PiggyBank, CreditCard, ArrowUpRight, ArrowDownLeft, type LucideIcon } from "lucide-react";

import { Show } from "@/components/show";
import { Skeleton } from "@/components/shadcn/skeleton";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/shadcn/card";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/shadcn/tooltip";

import { cn } from "@/utils/cn";
import type { Balance } from "@/types";
import { axiosInstance } from "@/services";

const formatCurrency = (amount: number) => {
	return new Intl.NumberFormat("vi-VN", { currency: "VND", style: "currency" }).format(amount * 1000);
};

const StatText: React.FC<{ label: string; color: string; amount?: number; Icon: LucideIcon; description: string }> = (props) => {
	const { Icon, label, color, amount, description } = props;

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">
					{label}
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger>
								<InfoIcon className="ml-1 h-4 w-4 text-muted-foreground" />
							</TooltipTrigger>
							<TooltipContent>
								<p>{description}</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</CardTitle>
				<Icon className={cn("h-4 w-4", color)} />
			</CardHeader>
			<CardContent>
				<Show when={amount} fallback={<Skeleton className="h-8 w-32" />}>
					{(amount) => <div className={cn("text-2xl font-bold", color)}>{formatCurrency(amount)}</div>}
				</Show>
			</CardContent>
		</Card>
	);
};

export function FinancialSummary() {
	const { data } = useQuery<{ data: Balance }>({
		queryKey: ["balance-report"],
		queryFn: () => axiosInstance.get("/profile/balance")
	});

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
			<StatText label="Owed" Icon={Frown} color="text-red-500" amount={data?.data.owed} description="Amount you owe to others" />
			<StatText label="Paid" Icon={CreditCard} color="text-green-500" amount={data?.data.paid} description="Amount you paid for bills" />
			<StatText label="Sent" Icon={ArrowUpRight} color="text-blue-500" amount={data?.data.sent} description="Amount sent in transactions" />
			<StatText
				label="Received"
				Icon={ArrowDownLeft}
				color="text-purple-500"
				amount={data?.data.received}
				description="Amount received in transactions"
			/>
			<StatText
				Icon={PiggyBank}
				label="Net Balance"
				amount={data?.data.net}
				description="Your current balance"
				color={(data?.data.net ?? 0) >= 0 ? "text-green-500" : "text-red-500"}
			/>
		</div>
	);
}
