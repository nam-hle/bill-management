import React from "react";
import { Text, Stack, Heading } from "@chakra-ui/react";

import type { ClientBill } from "@/schemas";
import { SkeletonText } from "@/chakra/skeleton";
import { type BillForm } from "@/components/forms";
import { formatTime, formatDistanceTime } from "@/utils";
import { SkeletonWrapper } from "@/components/skeleton-wrapper";

namespace BillFormHeading {
	export interface Props extends BillForm.Props {
		readonly bill: ClientBill | undefined;
	}
}

export const BillFormHeading: React.FC<BillFormHeading.Props> = (props) => {
	const { kind, bill } = props;

	return (
		<Stack gap={0}>
			<Heading>{kind.type === "update" ? "Bill Details" : "New Bill"}</Heading>
			{kind.type === "create" ? null : (
				<SkeletonWrapper loading={!bill} skeleton={<SkeletonText gap="4" width="md" noOfLines={1} />}>
					{bill && (
						<Text color="grey" textStyle="xs" fontStyle="italic">
							Created <span title={formatTime(bill.creator.timestamp)}>{formatDistanceTime(bill.creator.timestamp)}</span> by {bill.creator.fullName}
							{bill.updater?.timestamp && (
								<>
									{" "}
									• Last updated <span title={formatTime(bill.updater?.timestamp)}>{formatDistanceTime(bill.updater?.timestamp)}</span> by{" "}
									{bill.updater?.fullName ?? "someone"}
								</>
							)}
						</Text>
					)}
				</SkeletonWrapper>
			)}
		</Stack>
	);
};
