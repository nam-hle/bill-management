"use client";
import React from "react";
import { Stack } from "@chakra-ui/react";
import { useQuery, useMutation } from "@tanstack/react-query";

import { generateUid } from "@/utils";
import { Button } from "@/chakra/button";
import { Avatar } from "@/chakra/avatar";
import { toaster } from "@/chakra/toaster";
import { axiosInstance } from "@/services";
import { createSupabaseClient } from "@/services/supabase/client";
import { FileUploadRoot, FileUploadTrigger } from "@/chakra/file-upload";

namespace ProfileAvatar {
	export interface Props {
		readonly size: number;
		readonly userId: string;
		readonly url: string | undefined;
		onAvatarChange: (url: string) => void;
	}
}

interface UploadAvatarPayload {
	file: File;
	userId: string;
}

export const ProfileAvatar: React.FC<ProfileAvatar.Props> = (props) => {
	const { url, userId, onAvatarChange } = props;

	const { data: avatarUrl } = useQuery({
		enabled: !!url,
		queryKey: ["profileAvatar", url],
		queryFn: () => downloadImage("avatars", url)
	});

	const mutation = useMutation({
		mutationFn: uploadAvatar,
		onSuccess: (filePath) => {
			toaster.create({ type: "success", title: "Image uploaded", description: "The image has been uploaded successfully." });
			onAvatarChange(filePath);
		},
		onError: () => {
			toaster.create({
				type: "error",
				title: "Failed to upload avatar",
				description: "An error occurred while uploading the avatar. Please try again."
			});
		}
	});

	return (
		<Stack alignItems="center">
			<Avatar size="2xl" src={avatarUrl?.url} />
			<FileUploadRoot
				maxFiles={1}
				width="fit-content"
				accept={["image/png", "image/jpeg"]}
				onFileAccept={(details) => mutation.mutate({ userId, file: details.files[0] })}>
				<FileUploadTrigger asChild>
					<Button size="xs" variant="outline" loadingText="Uploading..." loading={mutation.isPending}>
						{avatarUrl?.url ? "Change" : "Upload"}
					</Button>
				</FileUploadTrigger>
			</FileUploadRoot>
		</Stack>
	);
};

async function uploadAvatar(payload: UploadAvatarPayload) {
	const { file, userId } = payload;
	const filePath = `${userId}-${generateUid()}.${file.name.split(".").pop()}`;
	const { error: uploadError } = await createSupabaseClient().storage.from("avatars").upload(filePath, file);

	if (uploadError) {
		throw uploadError;
	}

	return filePath;
}

export async function downloadImage(bucketName: "avatars" | "receipts", path: string | undefined): Promise<{ url: string | undefined }> {
	if (!path) {
		return { url: undefined };
	}

	try {
		const response = await axiosInstance.get(`/storage`, {
			responseType: "blob",
			params: { path, bucketName }
		});

		return { url: URL.createObjectURL(response.data) };
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error("Error downloading image:", error);
	}

	return { url: undefined };
}
