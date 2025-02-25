"use client";

import React from "react";

import * as ShadCN from "@/components/shadcn/select";
import { FormControl, FormMessage } from "@/components/shadcn/form";

namespace Select {
	export interface Props {
		name?: string;
		disabled?: boolean;
		value: string | undefined;
		onValueChange: (value: string) => void;
		items: { value: string; label: string }[];
	}
}

export const Select: React.FC<Select.Props> = (props) => {
	return (
		<>
			<ShadCN.Select name={props.name} value={props.value} onValueChange={props.onValueChange} disabled={props.disabled || props.items.length === 0}>
				<FormControl>
					<ShadCN.SelectTrigger className="w-full">
						<ShadCN.SelectValue placeholder="Select one" />
					</ShadCN.SelectTrigger>
				</FormControl>
				<ShadCN.SelectContent>
					{props.items.map(({ value, label }) => (
						<ShadCN.SelectItem key={value} value={value}>
							{label}
						</ShadCN.SelectItem>
					))}
				</ShadCN.SelectContent>
			</ShadCN.Select>
			<FormMessage />
		</>
	);
};
