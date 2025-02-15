import React from "react";
import { useMutation } from "@tanstack/react-query";

import { generateUid } from "@/utils";
import { toaster } from "@/chakra/toaster";
import { axiosInstance } from "@/services/axios";
import { createSupabaseClient } from "@/services/supabase/client";

type BucketName = "avatars" | "receipts";

export function useFileUploader(onSuccess: (filePath: string) => void) {
	const { mutate, isPending } = useMutation({
		mutationFn: uploadFile,
		onSuccess: (filePath) => {
			toaster.create({ type: "success", title: "Image uploaded", description: "The image has been uploaded successfully." });
			onSuccess(filePath);
		},
		onError: () => {
			toaster.create({
				type: "error",
				title: "Failed to upload avatar",
				description: "An error occurred while uploading the avatar. Please try again."
			});
		}
	});

	return React.useMemo(() => ({ uploadFile: mutate, isUploading: isPending }), [isPending, mutate]);
}

interface UploadImagePayload {
	readonly file: File;
	readonly ownerId?: string;
	readonly bucketName: BucketName;
}

export async function uploadFile(payload: UploadImagePayload) {
	const { file, ownerId, bucketName } = payload;
	const extension = file.name.split(".").pop();
	const filePath = [ownerId, generateUid()].filter(Boolean).join("-") + `.${extension}`;
	const { error: uploadError } = await createSupabaseClient().storage.from(bucketName).upload(filePath, file);

	if (uploadError) {
		throw uploadError;
	}

	return filePath;
}

export async function downloadFile(bucketName: BucketName, path: string | undefined): Promise<string | undefined> {
	if (!path) {
		return undefined;
	}

	try {
		const response = await axiosInstance.get(`/storage`, { responseType: "blob", params: { path, bucketName } });

		return URL.createObjectURL(response.data);
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error("Error downloading image:", error);
	}

	return undefined;
}
