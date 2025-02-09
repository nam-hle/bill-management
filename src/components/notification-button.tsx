import React from "react";
import { FaRegBell } from "react-icons/fa";
import { Box, IconButton } from "@chakra-ui/react";

import { type ButtonProps } from "@/chakra/button";

namespace NotificationButton {
	export interface Props extends ButtonProps {
		count: number;
	}
}

export const NotificationButton = React.forwardRef<HTMLButtonElement, NotificationButton.Props>(function NotificationButton({ count, onClick }, ref) {
	return (
		<IconButton ref={ref} rounded="full" variant="ghost" onClick={onClick}>
			<FaRegBell />
			{count > 0 && (
				<Box
					top="0"
					right="0"
					bg="red.500"
					color="white"
					fontSize="2xs"
					display="flex"
					position="absolute"
					borderRadius="full"
					width="{spacing.4}"
					alignItems="center"
					height="{spacing.4}"
					justifyContent="center"
					transform="translate(20%, -20%)">
					{count}
				</Box>
			)}
		</IconButton>
	);
});
