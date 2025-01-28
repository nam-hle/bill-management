"use client";
import { Stack } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";

import { downloadImage } from "@/utils";
import { Button } from "@/components/ui/button";
import { createSupabaseClient } from "@/supabase/client";
import { Avatar as GenAvatar } from "@/components/ui/avatar";
import { FileUploadRoot, FileUploadTrigger } from "@/components/ui/file-upload";

export default function Avatar(props: { size: number; uid: string | null; url: string | undefined; onUpload: (url: string) => void }) {
	const { uid, url, onUpload } = props;
	const supabase = createSupabaseClient();
	const [avatarUrl, setAvatarUrl] = useState<string | undefined>(url);
	const [uploading, setUploading] = useState(false);

	useEffect(() => {
		downloadImage("avatars", url).then(setAvatarUrl);
	}, [url, supabase]);

	const uploadAvatar = async (file: File) => {
		try {
			setUploading(true);

			const fileExt = file.name.split(".").pop();
			const filePath = `${uid}-${Math.random()}.${fileExt}`;

			const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file);

			if (uploadError) {
				throw uploadError;
			}

			onUpload(filePath);
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error("Error uploading file: ", error);
		} finally {
			setUploading(false);
		}
	};

	return (
		<Stack alignItems="center">
			<GenAvatar size="2xl" src={avatarUrl ?? undefined} />
			<FileUploadRoot
				maxFiles={1}
				width="fit-content"
				accept={["image/png", "image/jpeg"]}
				onFileAccept={(details) => uploadAvatar(details.files[0])}>
				<FileUploadTrigger asChild>
					<Button size="sm" loading={uploading}>
						{avatarUrl ? "Change" : "Upload"}
					</Button>
				</FileUploadTrigger>
			</FileUploadRoot>
		</Stack>
	);
}
