import * as React from "react";
import { Portal, Dialog as ChakraDialog } from "@chakra-ui/react";

import { CloseButton } from "./close-button";

interface DialogContentProps extends ChakraDialog.ContentProps {
	backdrop?: boolean;
	portalled?: boolean;
	portalRef?: React.RefObject<HTMLElement>;
}

export const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(function DialogContent(props, ref) {
	const { children, portalRef, backdrop = true, portalled = true, ...rest } = props;

	return (
		<Portal disabled={!portalled} container={portalRef}>
			{backdrop && <ChakraDialog.Backdrop />}
			<ChakraDialog.Positioner>
				<ChakraDialog.Content ref={ref} {...rest} asChild={false}>
					{children}
				</ChakraDialog.Content>
			</ChakraDialog.Positioner>
		</Portal>
	);
});

export const DialogCloseTrigger = React.forwardRef<HTMLButtonElement, ChakraDialog.CloseTriggerProps>(function DialogCloseTrigger(props, ref) {
	return (
		<ChakraDialog.CloseTrigger top="2" insetEnd="2" position="absolute" {...props} asChild>
			<CloseButton size="sm" ref={ref}>
				{props.children}
			</CloseButton>
		</ChakraDialog.CloseTrigger>
	);
});

export const DialogRoot = ChakraDialog.Root;
export const DialogFooter = ChakraDialog.Footer;
export const DialogHeader = ChakraDialog.Header;
export const DialogBody = ChakraDialog.Body;
export const DialogBackdrop = ChakraDialog.Backdrop;
export const DialogTitle = ChakraDialog.Title;
export const DialogDescription = ChakraDialog.Description;
export const DialogTrigger = ChakraDialog.Trigger;
export const DialogActionTrigger = ChakraDialog.ActionTrigger;
