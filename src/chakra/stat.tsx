import * as React from "react";
import { Badge, FormatNumber, type BadgeProps, Stat as ChakraStat } from "@chakra-ui/react";

import { InfoTip } from "./toggle-tip";

interface StatLabelProps extends ChakraStat.LabelProps {
	info?: React.ReactNode;
}

export const StatLabel = React.forwardRef<HTMLDivElement, StatLabelProps>(function StatLabel(props, ref) {
	const { info, children, ...rest } = props;

	return (
		<ChakraStat.Label {...rest} ref={ref}>
			{children}
			{info && <InfoTip>{info}</InfoTip>}
		</ChakraStat.Label>
	);
});

interface StatValueTextProps extends ChakraStat.ValueTextProps {
	value?: number;
	formatOptions?: Intl.NumberFormatOptions;
}

export const StatValueText = React.forwardRef<HTMLDivElement, StatValueTextProps>(function StatValueText(props, ref) {
	const { value, children, formatOptions, ...rest } = props;

	return (
		<ChakraStat.ValueText {...rest} ref={ref}>
			{children || (value != null && <FormatNumber value={value} {...formatOptions} />)}
		</ChakraStat.ValueText>
	);
});

export const StatUpTrend = React.forwardRef<HTMLDivElement, BadgeProps>(function StatUpTrend(props, ref) {
	return (
		<Badge gap="0" colorPalette="green" {...props} ref={ref}>
			<ChakraStat.UpIndicator />
			{props.children}
		</Badge>
	);
});

export const StatDownTrend = React.forwardRef<HTMLDivElement, BadgeProps>(function StatDownTrend(props, ref) {
	return (
		<Badge gap="0" colorPalette="red" {...props} ref={ref}>
			<ChakraStat.DownIndicator />
			{props.children}
		</Badge>
	);
});

export const StatRoot = ChakraStat.Root;
export const StatHelpText = ChakraStat.HelpText;
export const StatValueUnit = ChakraStat.ValueUnit;
