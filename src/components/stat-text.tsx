import { Info } from "lucide-react";

import { Show } from "@/components/show";
import { Skeleton } from "@/components/shadcn/skeleton";
import { Card, CardContent } from "@/components/shadcn/card";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/shadcn/tooltip";

import { cn } from "@/utils/cn";

interface StatTextProps {
	info: string;
	label: string;
	className?: string;
	value: number | undefined;
}

export function StatText({ info, label, value, className }: StatTextProps) {
	const getIconClass = () => {
		return "bg-gray-100 text-gray-600";
	};

	return (
		<Card className={cn("overflow-hidden", className)}>
			<CardContent className="p-6">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-2">
						<span className="text-sm font-medium text-muted-foreground">{label}</span>
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Info className="h-4 w-4 text-muted-foreground" />
								</TooltipTrigger>
								<TooltipContent>
									<p>{info}</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>
					<div className={cn("rounded-full p-2", getIconClass())}>{/* You can add an icon here based on the type */}</div>
				</div>
				<Show when={value} fallback={<Skeleton className="h-4 w-full" />}>
					{(value) => <p className="mt-4 text-2xl font-bold text-black dark:text-white">{value}</p>}
				</Show>
			</CardContent>
		</Card>
	);
}
