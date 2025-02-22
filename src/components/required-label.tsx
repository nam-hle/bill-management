import React from "react";

import { Label } from "@/components/shadcn/label";

export const RequiredLabel = ({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) => (
	<Label htmlFor={htmlFor}>
		{children} <span className="text-red-500">*</span>
	</Label>
);
