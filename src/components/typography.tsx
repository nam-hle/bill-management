import { cn } from "@/utils/cn";
import { type ClassName, type Container } from "@/types";

export const TypographyH1 = (props: Container & ClassName) => {
	return <h1 className={cn("scroll-m-20 text-xl font-semibold tracking-tight", props.className)}>{props.children}</h1>;
};
