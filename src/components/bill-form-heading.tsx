import React from "react";

import { type BillForm } from "@/components/bill-form";
import { TypographyH1 } from "@/components/typography";
import { Skeleton } from "@/components/shadcn/skeleton";
import { SkeletonWrapper } from "@/components/skeleton-wrapper";

import type { ClientBill } from "@/schemas";
import { formatTime, formatDistanceTime } from "@/utils";

namespace BillFormHeading {
	export interface Props extends BillForm.Props {
		readonly bill: ClientBill | undefined;
	}
}

export const BillFormHeading: React.FC<BillFormHeading.Props> = (props) => {
	const { kind, bill } = props;

	return (
		<div>
			<TypographyH1>{kind.type === "update" ? "Bill Details" : "New Bill"}</TypographyH1>
			{kind.type === "create" ? null : (
				<SkeletonWrapper loading={!bill} skeleton={<Skeleton className="h-5 w-3/5" />}>
					{bill && (
						<span className="text-xs italic text-gray-500">
							Created <span title={formatTime(bill.creator.timestamp)}>{formatDistanceTime(bill.creator.timestamp)}</span> by {bill.creator.fullName}
							{bill.updater?.timestamp && (
								<>
									{" "}
									• Last updated <span title={formatTime(bill.updater?.timestamp)}>{formatDistanceTime(bill.updater?.timestamp)}</span> by{" "}
									{bill.updater?.fullName ?? "someone"}
								</>
							)}
						</span>
					)}
				</SkeletonWrapper>
			)}
		</div>
	);
};
