import * as React from "react";
import { HiOutlineInformationCircle } from "react-icons/hi";
import { Portal, IconButton, Popover as ChakraPopover } from "@chakra-ui/react";

export interface ToggleTipProps extends ChakraPopover.RootProps {
	showArrow?: boolean;
	portalled?: boolean;
	content?: React.ReactNode;
	portalRef?: React.RefObject<HTMLElement>;
}

export const ToggleTip = React.forwardRef<HTMLDivElement, ToggleTipProps>(function ToggleTip(props, ref) {
	const { showArrow, children, portalled = true, content, portalRef, ...rest } = props;

	return (
		<ChakraPopover.Root {...rest} positioning={{ ...rest.positioning, gutter: 4 }}>
			<ChakraPopover.Trigger asChild>{children}</ChakraPopover.Trigger>
			<Portal disabled={!portalled} container={portalRef}>
				<ChakraPopover.Positioner>
					<ChakraPopover.Content px="2" py="1" ref={ref} width="auto" rounded="sm" textStyle="xs">
						{showArrow && (
							<ChakraPopover.Arrow>
								<ChakraPopover.ArrowTip />
							</ChakraPopover.Arrow>
						)}
						{content}
					</ChakraPopover.Content>
				</ChakraPopover.Positioner>
			</Portal>
		</ChakraPopover.Root>
	);
});

export const InfoTip = React.forwardRef<HTMLDivElement, Partial<ToggleTipProps>>(function InfoTip(props, ref) {
	const { children, ...rest } = props;

	return (
		<ToggleTip content={children} {...rest} ref={ref}>
			<IconButton size="2xs" variant="ghost" aria-label="info" colorPalette="gray">
				<HiOutlineInformationCircle />
			</IconButton>
		</ToggleTip>
	);
});
