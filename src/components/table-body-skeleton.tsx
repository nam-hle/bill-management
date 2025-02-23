import React from "react";

import { Skeleton } from "@/components/shadcn/skeleton";
import { TableRow, TableCell } from "@/components/shadcn/table";

export const TableBodySkeleton: React.FC<{ numberOfCols: number; numberOfRows?: number }> = (props) => {
	const { numberOfCols, numberOfRows = 5 } = props;

	return (
		<>
			{Array.from({ length: numberOfRows }).map((_, rowIndex) => {
				return (
					<TableRow key={rowIndex}>
						{Array.from({ length: numberOfCols }).map((_, colIndex) => {
							return (
								<TableCell key={colIndex}>
									<Skeleton className="h-8 w-full" />
								</TableCell>
							);
						})}
					</TableRow>
				);
			})}
		</>
	);
};
