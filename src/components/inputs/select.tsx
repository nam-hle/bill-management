"use client";

import React from "react";

import * as ShadCN from "@/components/shadcn/select";

namespace Select {
	export interface Props {
		name?: string;
		disabled?: boolean;
		readonly?: boolean;
		value: string | undefined;
		onValueChange: (value: string) => void;
		items: { value: string; label: string }[];
	}
}

export const Select: React.FC<Select.Props> = (props) => {
	return (
		<ShadCN.Select value={props.value} onValueChange={props.onValueChange} disabled={props.disabled || props.readonly || props.items.length === 0}>
			<ShadCN.SelectTrigger className="w-full">
				<ShadCN.SelectValue placeholder="Select one" />
			</ShadCN.SelectTrigger>
			<ShadCN.SelectContent>
				<ShadCN.SelectGroup>
					{props.items.map(({ value, label }) => (
						<ShadCN.SelectItem key={value} value={value}>
							{label}
						</ShadCN.SelectItem>
					))}
				</ShadCN.SelectGroup>
			</ShadCN.SelectContent>
		</ShadCN.Select>
	);
};
