import React from "react";
import { useMutation } from "@tanstack/react-query";

import { generateUid } from "@/utils";
import { useToast } from "@/hooks/use-toast";
import { createSupabaseClient } from "@/services/supabase/client";

type BucketName = "avatars" | "receipts";

export function useFileUploader(onSuccess: (filePath: string) => void) {
	const { toast } = useToast();
	const { mutate, isPending } = useMutation({
		mutationFn: uploadFile,
		onSuccess: (filePath) => {
			toast({ title: "Image uploaded", description: "The image has been uploaded successfully." });
			onSuccess(filePath);
		},
		onError: () => {
			toast({
				variant: "destructive",
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
