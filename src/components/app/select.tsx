"use client";

import React from "react";
import { createListCollection } from "@chakra-ui/react";

import { SelectItem, SelectRoot, SelectContent, SelectTrigger, SelectValueText } from "@/components/ui/select";

export const Select: React.FC<{
	width?: string;
	readonly?: boolean;
	value: string | undefined;
	onValueChange: (value: string) => void;
	items: { value: string; label: string }[];
}> = (props) => {
	const collection = createListCollection(props);

	return (
		<SelectRoot
			size="md"
			width={props.width}
			collection={collection}
			readOnly={props.readonly}
			value={props.value ? [props.value] : []}
			onValueChange={(e) => {
				if (e.value.length !== 1) {
					throw new Error("Expected exactly one value");
				}

				props.onValueChange(e.value[0]);
			}}>
			<SelectTrigger>
				<SelectValueText placeholder="Select one" />
			</SelectTrigger>
			<SelectContent>
				{collection.items.map(({ value, label }) => (
					<SelectItem key={value} item={value}>
						{label}
					</SelectItem>
				))}
			</SelectContent>
		</SelectRoot>
	);
};
