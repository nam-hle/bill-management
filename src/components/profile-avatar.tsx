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
		readonly size: number;
		readonly userId: string;
		readonly url: string | undefined;
		onAvatarChange: (url: string) => void;
	}
}

export const ProfileAvatar: React.FC<ProfileAvatar.Props> = (props) => {
	const { url, userId, onAvatarChange } = props;

	const { data: avatarUrl } = useQuery({
		enabled: !!url,
		queryKey: ["profileAvatar", url],
		queryFn: () => downloadImage("avatars", url)
	});

	const { uploadFile, isUploading } = useFileUploader(onAvatarChange);

	return (
		<Stack alignItems="center">
			<Avatar size="2xl" src={avatarUrl} />
			<FileUploadRoot
				maxFiles={1}
				width="fit-content"
				accept={["image/png", "image/jpeg"]}
				onFileAccept={(details) => uploadFile({ objectId: userId, bucketName: "avatars", image: details.files[0] })}>
				<FileUploadTrigger asChild>
					<Button size="xs" variant="outline" loading={isUploading} loadingText="Uploading...">
						{avatarUrl ? "Change" : "Upload"}
					</Button>
				</FileUploadTrigger>
			</FileUploadRoot>
		</Stack>
	);
};
