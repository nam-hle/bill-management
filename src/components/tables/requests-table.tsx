"use client";

import React from "react";

import { RequestDialog } from "@/components/request-dialog";
import { DataTable } from "@/components/data-table/data-table";

import { trpc } from "@/services";

export const RequestsTable = () => {
	const { data } = trpc.users.requests.useQuery();

	return (
		<DataTable
			title="Requests"
			action={<RequestDialog />}
			pagination={{ fullSize: data?.length }}
			data={data?.map((row) => ({ ...row }))}
			columns={[
				{ key: "id", label: "Group ID", dataGetter: ({ row }) => row.displayId },
				{ key: "name", label: "Group Name", dataGetter: ({ row }) => row.name }
			]}
		/>
	);
};
