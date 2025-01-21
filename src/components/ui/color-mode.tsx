"use client";

import * as React from "react";
import { LuSun, LuMoon } from "react-icons/lu";
import { useTheme, ThemeProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";
import type { IconButtonProps } from "@chakra-ui/react";
import { Skeleton, ClientOnly, IconButton } from "@chakra-ui/react";

export type ColorModeProviderProps = ThemeProviderProps;

export function ColorModeProvider(props: ColorModeProviderProps) {
	return <ThemeProvider attribute="class" disableTransitionOnChange {...props} />;
}

export function useColorMode() {
	const { setTheme, resolvedTheme } = useTheme();
	const toggleColorMode = () => {
		setTheme(resolvedTheme === "light" ? "dark" : "light");
	};

	return {
		toggleColorMode,
		setColorMode: setTheme,
		colorMode: resolvedTheme
	};
}

export function useColorModeValue<T>(light: T, dark: T) {
	const { colorMode } = useColorMode();

	return colorMode === "light" ? light : dark;
}

export function ColorModeIcon() {
	const { colorMode } = useColorMode();

	return colorMode === "light" ? <LuSun /> : <LuMoon />;
}

type ColorModeButtonProps = Omit<IconButtonProps, "aria-label">;

export const ColorModeButton = React.forwardRef<HTMLButtonElement, ColorModeButtonProps>(function ColorModeButton(props, ref) {
	const { toggleColorMode } = useColorMode();

	return (
		<ClientOnly fallback={<Skeleton boxSize="8" />}>
			<IconButton
				size="sm"
				ref={ref}
				variant="ghost"
				onClick={toggleColorMode}
				aria-label="Toggle color mode"
				{...props}
				css={{
					_icon: {
						width: "5",
						height: "5"
					}
				}}>
				<ColorModeIcon />
			</IconButton>
		</ClientOnly>
	);
});
