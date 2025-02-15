"use client";
import React from "react";
import { Stack } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/chakra/button";
import { Avatar } from "@/chakra/avatar";
import { FileUploadRoot, FileUploadTrigger } from "@/chakra/file-upload";
import { downloadImage, useFileUploader } from "@/services/file-uploader";

namespace ProfileAvatar {
	export interface Props {
		readonly ownerId: string;
		readonly fileId: string | undefined;
		readonly onChange: (fileId: string) => void;
	}
}

export const ProfileAvatar: React.FC<ProfileAvatar.Props> = (props) => {
	const { fileId, ownerId, onChange } = props;

	const { data: url } = useQuery({
		enabled: !!fileId,
		queryKey: ["profileAvatar", fileId],
		queryFn: () => downloadImage("avatars", fileId)
	});

	const { uploadFile, isUploading } = useFileUploader(onChange);

	return (
		<Stack alignItems="center">
			<Avatar src={url} size="2xl" />
			<FileUploadRoot
				maxFiles={1}
				width="fit-content"
				accept={["image/png", "image/jpeg"]}
				onFileAccept={(details) => uploadFile({ objectId: ownerId, bucketName: "avatars", image: details.files[0] })}>
				<FileUploadTrigger asChild>
					<Button size="xs" variant="outline" loading={isUploading} loadingText="Uploading...">
						{url ? "Change" : "Upload"}
					</Button>
				</FileUploadTrigger>
			</FileUploadRoot>
		</Stack>
	);
};
