import React from "react";

import { SkeletonText } from "@/components/ui/skeleton";

export default function Loading() {
	return <SkeletonText gap="4" noOfLines={3} />;
}
