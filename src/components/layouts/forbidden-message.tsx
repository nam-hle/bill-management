import React from "react";

import { Message } from "@/components/mics/message";

export const ForbiddenMessage = () => (
	<Message title="Permission Denied" description="You do not have the necessary permissions to access this resource" />
);
