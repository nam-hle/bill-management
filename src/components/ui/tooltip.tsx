import * as React from "react";
import { Portal, Tooltip as ChakraTooltip } from "@chakra-ui/react";

export interface TooltipProps extends ChakraTooltip.RootProps {
	disabled?: boolean;
	showArrow?: boolean;
	portalled?: boolean;
	content: React.ReactNode;
	portalRef?: React.RefObject<HTMLElement>;
	contentProps?: ChakraTooltip.ContentProps;
}

export const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(function Tooltip(props, ref) {
	const { content, children, disabled, showArrow, portalled, portalRef, contentProps, ...rest } = props;

	if (disabled) return children;

	return (
		<ChakraTooltip.Root {...rest}>
			<ChakraTooltip.Trigger asChild>{children}</ChakraTooltip.Trigger>
			<Portal disabled={!portalled} container={portalRef}>
				<ChakraTooltip.Positioner>
					<ChakraTooltip.Content ref={ref} {...contentProps}>
						{showArrow && (
							<ChakraTooltip.Arrow>
								<ChakraTooltip.ArrowTip />
							</ChakraTooltip.Arrow>
						)}
						{content}
					</ChakraTooltip.Content>
				</ChakraTooltip.Positioner>
			</Portal>
		</ChakraTooltip.Root>
	);
});
