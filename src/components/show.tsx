import React from "react";

export interface ShowProps<T> {
	/**
	 * If `true`, it'll render the `children` prop
	 */
	when: T | null | undefined;
	/**
	 * The fallback content to render if `when` is `false`
	 */
	fallback?: React.ReactNode;
	/**
	 * The children to render if `when` is `true`
	 */
	children: React.ReactNode | ((props: T) => React.ReactNode);
}

export const Show = <T extends unknown>(props: ShowProps<T>) => {
	const { when, fallback, children } = props;
	let result: React.ReactNode;

	if (when === undefined || when === null) {
		result = fallback;
	} else {
		result = typeof children === "function" ? children(when) : children;
	}

	return React.isValidElement(result) ? result : <>{result}</>;
};
