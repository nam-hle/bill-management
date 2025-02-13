"use client";

import * as React from "react";
import { HiChevronLeft, HiChevronRight, HiMiniEllipsisHorizontal } from "react-icons/hi2";
import {
	Text,
	Button,
	IconButton,
	createContext,
	type TextProps,
	type ButtonProps,
	usePaginationContext,
	Pagination as ChakraPagination
} from "@chakra-ui/react";

import { LinkButton } from "./link-button";

interface ButtonVariantMap {
	current: ButtonProps["variant"];
	default: ButtonProps["variant"];
	ellipsis: ButtonProps["variant"];
}

type PaginationVariant = "outline" | "solid" | "subtle";

interface ButtonVariantContext {
	size: ButtonProps["size"];
	variantMap: ButtonVariantMap;
	getHref?: (page: number) => string;
}

const [RootPropsProvider, useRootProps] = createContext<ButtonVariantContext>({
	name: "RootPropsProvider"
});

export interface PaginationRootProps extends Omit<ChakraPagination.RootProps, "type"> {
	size?: ButtonProps["size"];
	variant?: PaginationVariant;
	getHref?: (page: number) => string;
}

const variantMap: Record<PaginationVariant, ButtonVariantMap> = {
	subtle: { default: "ghost", ellipsis: "plain", current: "subtle" },
	outline: { default: "ghost", ellipsis: "plain", current: "outline" },
	solid: { current: "solid", default: "outline", ellipsis: "outline" }
};

export const PaginationRoot = React.forwardRef<HTMLDivElement, PaginationRootProps>(function PaginationRoot(props, ref) {
	const { getHref, size = "sm", variant = "outline", ...rest } = props;

	return (
		<RootPropsProvider value={{ size, getHref, variantMap: variantMap[variant] }}>
			<ChakraPagination.Root ref={ref} type={getHref ? "link" : "button"} {...rest} />
		</RootPropsProvider>
	);
});

export const PaginationEllipsis = React.forwardRef<HTMLDivElement, ChakraPagination.EllipsisProps>(function PaginationEllipsis(props, ref) {
	const { size, variantMap } = useRootProps();

	return (
		<ChakraPagination.Ellipsis ref={ref} {...props} asChild>
			<Button as="span" size={size} variant={variantMap.ellipsis}>
				<HiMiniEllipsisHorizontal />
			</Button>
		</ChakraPagination.Ellipsis>
	);
});

export const PaginationItem = React.forwardRef<HTMLButtonElement, ChakraPagination.ItemProps>(function PaginationItem(props, ref) {
	const { page } = usePaginationContext();
	const { size, getHref, variantMap } = useRootProps();

	const current = page === props.value;
	const variant = current ? variantMap.current : variantMap.default;

	if (getHref) {
		return (
			<LinkButton size={size} variant={variant} href={getHref(props.value)}>
				{props.value}
			</LinkButton>
		);
	}

	return (
		<ChakraPagination.Item ref={ref} {...props} asChild>
			<Button size={size} variant={variant}>
				{props.value}
			</Button>
		</ChakraPagination.Item>
	);
});

export const PaginationPrevTrigger = React.forwardRef<HTMLButtonElement, ChakraPagination.PrevTriggerProps>(
	function PaginationPrevTrigger(props, ref) {
		const { size, getHref, variantMap } = useRootProps();
		const { previousPage } = usePaginationContext();

		if (getHref) {
			return (
				<LinkButton size={size} variant={variantMap.default} href={previousPage != null ? getHref(previousPage) : undefined}>
					<HiChevronLeft />
				</LinkButton>
			);
		}

		return (
			<ChakraPagination.PrevTrigger asChild ref={ref} {...props}>
				<IconButton size={size} variant={variantMap.default}>
					<HiChevronLeft />
				</IconButton>
			</ChakraPagination.PrevTrigger>
		);
	}
);

export const PaginationNextTrigger = React.forwardRef<HTMLButtonElement, ChakraPagination.NextTriggerProps>(
	function PaginationNextTrigger(props, ref) {
		const { size, getHref, variantMap } = useRootProps();
		const { nextPage } = usePaginationContext();

		if (getHref) {
			return (
				<LinkButton size={size} variant={variantMap.default} href={nextPage != null ? getHref(nextPage) : undefined}>
					<HiChevronRight />
				</LinkButton>
			);
		}

		return (
			<ChakraPagination.NextTrigger asChild ref={ref} {...props}>
				<IconButton size={size} variant={variantMap.default}>
					<HiChevronRight />
				</IconButton>
			</ChakraPagination.NextTrigger>
		);
	}
);

export const PaginationItems = (props: React.HTMLAttributes<HTMLElement>) => {
	return (
		<ChakraPagination.Context>
			{({ pages }) =>
				pages.map((page, index) => {
					return page.type === "ellipsis" ? (
						<PaginationEllipsis key={index} index={index} {...props} />
					) : (
						<PaginationItem key={index} type="page" value={page.value} {...props} />
					);
				})
			}
		</ChakraPagination.Context>
	);
};

interface PageTextProps extends TextProps {
	format?: "short" | "compact" | "long";
}

export const PaginationPageText = React.forwardRef<HTMLParagraphElement, PageTextProps>(function PaginationPageText(props, ref) {
	const { format = "compact", ...rest } = props;
	const { page, count, pageRange, totalPages } = usePaginationContext();
	const content = React.useMemo(() => {
		if (format === "short") {
			return `${page} / ${totalPages}`;
		}

		if (format === "compact") {
			return `${page} of ${totalPages}`;
		}

		return `${pageRange.start + 1} - ${Math.min(pageRange.end, count)} of ${count}`;
	}, [format, page, totalPages, pageRange, count]);

	return (
		<Text ref={ref} fontWeight="medium" {...rest}>
			{content}
		</Text>
	);
});
