import * as React from "react";
import { Group, InputElement, type BoxProps, type InputElementProps } from "@chakra-ui/react";

export interface InputGroupProps extends BoxProps {
	endElement?: React.ReactNode;
	startElement?: React.ReactNode;
	endElementProps?: InputElementProps;
	startElementProps?: InputElementProps;
	endOffset?: InputElementProps["paddingEnd"];
	children: React.ReactElement<InputElementProps>;
	startOffset?: InputElementProps["paddingStart"];
}

export const InputGroup = React.forwardRef<HTMLDivElement, InputGroupProps>(function InputGroup(props, ref) {
	const { children, endElement, startElement, endElementProps, startElementProps, endOffset = "6px", startOffset = "6px", ...rest } = props;

	const child = React.Children.only<React.ReactElement<InputElementProps>>(children);

	return (
		<Group ref={ref} {...rest}>
			{startElement && (
				<InputElement pointerEvents="none" {...startElementProps}>
					{startElement}
				</InputElement>
			)}
			{React.cloneElement(child, {
				...(startElement && {
					ps: `calc(var(--input-height) - ${startOffset})`
				}),
				...(endElement && { pe: `calc(var(--input-height) - ${endOffset})` }),
				...children.props
			})}
			{endElement && (
				<InputElement placement="end" {...endElementProps}>
					{endElement}
				</InputElement>
			)}
		</Group>
	);
});
