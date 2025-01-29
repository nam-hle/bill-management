import * as React from "react";
import { Stack, Circle, Skeleton as ChakraSkeleton } from "@chakra-ui/react";
import type { CircleProps, SkeletonProps as ChakraSkeletonProps } from "@chakra-ui/react";

export interface SkeletonCircleProps extends ChakraSkeletonProps {
	size?: CircleProps["size"];
}

export const SkeletonCircle = React.forwardRef<HTMLDivElement, SkeletonCircleProps>(function SkeletonCircle(props, ref) {
	const { size, ...rest } = props;

	return (
		<Circle asChild ref={ref} size={size}>
			<ChakraSkeleton {...rest} />
		</Circle>
	);
});

export interface SkeletonTextProps extends ChakraSkeletonProps {
	noOfLines?: number;
}

export const SkeletonText = React.forwardRef<HTMLDivElement, SkeletonTextProps>(function SkeletonText(props, ref) {
	const { gap, noOfLines = 3, ...rest } = props;

	return (
		<Stack gap={gap} ref={ref} width="full">
			{Array.from({ length: noOfLines }).map((_, index) => (
				<ChakraSkeleton height="4" key={index} {...props} _last={{ maxW: "80%" }} {...rest} />
			))}
		</Stack>
	);
});

export const Skeleton = ChakraSkeleton;
