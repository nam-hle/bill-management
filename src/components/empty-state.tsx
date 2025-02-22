import React from "react";

import { cn } from "@/utils/cn";

export const EmptyState = ({ title, className, description }: { title: string; className?: string; description?: string }) => (
	<div className={cn("flex flex-col items-center justify-center p-6 text-center", className)}>
		<h3 className="text-lg font-semibold text-gray-700">{title}</h3>
		{description && <p className="text-sm text-gray-500">{description}</p>}
	</div>
);
