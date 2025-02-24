"use client";

import * as React from "react";
import { useDropzone } from "react-dropzone";
import { useQuery } from "@tanstack/react-query";
import { Trash2, UploadCloud } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import { Skeleton } from "@/components/shadcn/skeleton";

import { Show } from "@/components/show";

import { API } from "@/api";
import { cn } from "@/utils/cn";
import { useFileUploader } from "@/services/file-uploader";

interface FileUploadProps {
	fileId?: string;
	ownerId?: string;
	editing?: boolean;
	loading?: boolean;
	buttonSize: "md" | "sm";
	bucketName: API.Storage.BucketName;
	onChange: (fileId: string | null) => void;
	imageRenderer: (src: string) => React.ReactNode;
}

export const FileUpload = ({ fileId, loading, ownerId, editing, onChange, buttonSize, bucketName, imageRenderer }: FileUploadProps) => {
	const { data: url, isLoading: loadingImage } = useQuery({
		enabled: !!fileId,
		queryKey: [bucketName, fileId],
		queryFn: () => API.Storage.downloadFile(bucketName, fileId)
	});
	const [, setPreviewUrl] = React.useState<string | null>(null);

	const { uploadFile } = useFileUploader(onChange);

	const onDrop = React.useCallback(
		(acceptedFiles: File[]) => {
			if (acceptedFiles.length > 0) {
				const file = acceptedFiles[0];
				// TODO: Only upload when saving/creating
				uploadFile({ file, ownerId, bucketName });

				const reader = new FileReader();
				reader.onload = (e) => {
					setPreviewUrl(e.target?.result as string);
				};

				reader.readAsDataURL(file);
			}
		},
		[bucketName, ownerId, uploadFile]
	);

	const { getRootProps, isDragActive, getInputProps } = useDropzone({
		onDrop,
		multiple: false,
		accept: { "image/*": [".png", ".jpg", ".jpeg", ".gif"] }
	});

	const removeFile = () => {
		onChange(null);
		setPreviewUrl(null);
	};

	const renderEmptyState = () => {
		return (
			<div className="flex flex-col items-center justify-center text-muted-foreground">
				<div className="text-center">
					<p>No uploaded receipt yet</p>
				</div>
			</div>
		);
	};

	const renderEditButtons = () => {
		if (!editing) {
			return null;
		}

		return (
			<div className="absolute bottom-0 right-0 flex flex-col justify-between">
				<Button size="icon" type="button" onClick={removeFile} variant="destructive" className={buttonSize === "sm" ? "h-6 w-6" : ""}>
					<Trash2 className="h-4 w-4" />
				</Button>
			</div>
		);
	};

	const renderUploadArea = () => {
		return (
			<div
				{...getRootProps()}
				className={cn(
					"flex flex-col items-center justify-center rounded-lg border border-dashed p-6 transition-colors",
					isDragActive ? "border-primary/50 bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5"
				)}>
				<input {...getInputProps()} />
				<div className="flex flex-col items-center justify-center text-muted-foreground">
					<UploadCloud className="mb-2 h-8 w-8" />
					<div className="text-center">
						<p>Drag & drop an image here, or click to select one</p>
					</div>
				</div>
			</div>
		);
	};

	const renderImagePreview = () => {
		return (
			<Show when={url} fallback={<Skeleton className="h-full w-full" />}>
				{(loadedUrl) => (
					<div className="relative inline-block">
						{imageRenderer(loadedUrl)}
						{renderEditButtons()}
					</div>
				)}
			</Show>
		);
	};

	if (loading || loadingImage || fileId) {
		return renderImagePreview();
	}

	if (editing) {
		return renderUploadArea();
	}

	return renderEmptyState();
};
