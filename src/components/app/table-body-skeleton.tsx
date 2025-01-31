import React from "react";
import { Table } from "@chakra-ui/react";

import { SkeletonText } from "@/components/ui/skeleton";

export const TableBodySkeleton: React.FC<{ numberOfCols: number; numberOfRows?: number }> = (props) => {
	const { numberOfCols, numberOfRows = 5 } = props;

	return (
		<>
			{Array.from({ length: numberOfRows }).map((_, rowIndex) => {
				return (
					<Table.Row key={rowIndex}>
						{Array.from({ length: numberOfCols }).map((_, colIndex) => {
							return (
								<Table.Cell key={colIndex}>
									<SkeletonText noOfLines={1} />
								</Table.Cell>
							);
						})}
					</Table.Row>
				);
			})}
		</>
	);
};
