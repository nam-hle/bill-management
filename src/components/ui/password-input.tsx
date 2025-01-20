"use client";

import * as React from "react";
import { LuEye, LuEyeOff } from "react-icons/lu";
import type { GroupProps, InputProps, StackProps, ButtonProps } from "@chakra-ui/react";
import { Box, Input, Stack, HStack, mergeRefs, IconButton, useControllableState } from "@chakra-ui/react";

import { InputGroup } from "./input-group";

export interface PasswordVisibilityProps {
	visible?: boolean;
	defaultVisible?: boolean;
	onVisibleChange?: (visible: boolean) => void;
	visibilityIcon?: { on: React.ReactNode; off: React.ReactNode };
}

export interface PasswordInputProps extends InputProps, PasswordVisibilityProps {
	rootProps?: GroupProps;
}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(function PasswordInput(props, ref) {
	const { rootProps, defaultVisible, visible: visibleProp, onVisibleChange, visibilityIcon = { on: <LuEye />, off: <LuEyeOff /> }, ...rest } = props;

	const [visible, setVisible] = useControllableState({
		value: visibleProp,
		defaultValue: defaultVisible || false,
		onChange: onVisibleChange
	});

	const inputRef = React.useRef<HTMLInputElement>(null);

	return (
		<InputGroup
			width="full"
			endElement={
				<VisibilityTrigger
					disabled={rest.disabled}
					onPointerDown={(e) => {
						if (rest.disabled) return;

						if (e.button !== 0) return;
						e.preventDefault();
						setVisible(!visible);
					}}>
					{visible ? visibilityIcon.off : visibilityIcon.on}
				</VisibilityTrigger>
			}
			{...rootProps}>
			<Input {...rest} ref={mergeRefs(ref, inputRef)} type={visible ? "text" : "password"} />
		</InputGroup>
	);
});

const VisibilityTrigger = React.forwardRef<HTMLButtonElement, ButtonProps>(function VisibilityTrigger(props, ref) {
	return (
		<IconButton
			me="-2"
			ref={ref}
			size="sm"
			tabIndex={-1}
			variant="ghost"
			aspectRatio="square"
			height="calc(100% - {spacing.2})"
			aria-label="Toggle password visibility"
			{...props}
		/>
	);
});

interface PasswordStrengthMeterProps extends StackProps {
	max?: number;
	value: number;
}

export const PasswordStrengthMeter = React.forwardRef<HTMLDivElement, PasswordStrengthMeterProps>(function PasswordStrengthMeter(props, ref) {
	const { max = 4, value, ...rest } = props;

	const percent = (value / max) * 100;
	const { label, colorPalette } = getColorPalette(percent);

	return (
		<Stack gap="1" ref={ref} align="flex-end" {...rest}>
			<HStack ref={ref} width="full" {...rest}>
				{Array.from({ length: max }).map((_, index) => (
					<Box
						flex="1"
						height="1"
						key={index}
						rounded="sm"
						colorPalette="gray"
						layerStyle="fill.subtle"
						data-selected={index < value ? "" : undefined}
						_selected={{
							colorPalette,
							layerStyle: "fill.solid"
						}}
					/>
				))}
			</HStack>
			{label && <HStack textStyle="xs">{label}</HStack>}
		</Stack>
	);
});

function getColorPalette(percent: number) {
	switch (true) {
		case percent < 33:
			return { label: "Low", colorPalette: "red" };
		case percent < 66:
			return { label: "Medium", colorPalette: "orange" };
		default:
			return { label: "High", colorPalette: "green" };
	}
}
