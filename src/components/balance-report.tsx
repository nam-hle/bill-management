"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Stack, HStack, Heading } from "@chakra-ui/react";

import { type Balance } from "@/types";
import { Skeleton } from "@/chakra/skeleton";
import { axiosInstance } from "@/services/axios";
import { StatRoot, StatLabel, StatValueText } from "@/chakra/stat";

export function BalanceReport() {
	const { data } = useQuery<{ data: Balance }>({
		queryKey: ["balance-report"],
		queryFn: () => axiosInstance.get("/profile/balance")
	});

	return (
		<Stack gap={2}>
			<Heading as="h1">Balance</Heading>

			<HStack justify="space-between">
				<StatRoot>
					<StatLabel info="The total amount you need to pay back to others">Owed</StatLabel>
					<ReportSkeleton number={data?.data?.owed} />
				</StatRoot>
				<StatRoot>
					<StatLabel info="The total amount you have received by transactions by others">Received</StatLabel>
					<ReportSkeleton number={data?.data?.received} />
				</StatRoot>
				<StatRoot>
					<StatLabel info="The total amount you have paid on behalf of others">Paid</StatLabel>
					<ReportSkeleton number={data?.data?.paid} />
				</StatRoot>
				<StatRoot>
					<StatLabel info="The total amount you sent by transactions to others">Sent</StatLabel>
					<ReportSkeleton number={data?.data?.sent} />
				</StatRoot>
				<StatRoot>
					<StatLabel>Net Balance</StatLabel>
					<ReportSkeleton number={data?.data?.net} />
				</StatRoot>
			</HStack>
		</Stack>
	);
}

const ReportSkeleton: React.FC<{ number: number | undefined }> = ({ number }) => {
	if (number === undefined) {
		return <Skeleton loading height="6" width="60px" />;
	}

	return <StatValueText value={number} />;
};
