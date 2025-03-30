import React from "react";

import { Heading } from "@/components/mics/heading";
import { type BillForm } from "@/components/forms/bill-form";

import { formatTime, formatDistanceTime } from "@/utils";

namespace BillFormHeading {
	export interface Props extends BillForm.Props {}
}

export const BillFormHeading: React.FC<BillFormHeading.Props> = (props) => {
	const { kind } = props;
	const bill = React.useMemo(() => (kind.type === "update" ? kind.bill : undefined), [kind]);

	return (
		<div>
			<Heading>{kind.type === "update" ? "Bill Details" : "New Bill"}</Heading>

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
		</div>
	);
};
