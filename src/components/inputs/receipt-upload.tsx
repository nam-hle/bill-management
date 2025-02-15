import React from "react";
import { HiUpload } from "react-icons/hi";
import { BsReceipt } from "react-icons/bs";
import { useQuery } from "@tanstack/react-query";
import { Image, Stack, Center } from "@chakra-ui/react";

import { API } from "@/api";
import { useBoolean } from "@/hooks";
import { Button } from "@/chakra/button";
import { Skeleton } from "@/chakra/skeleton";
import { EmptyState } from "@/chakra/empty-state";
import { useFileUploader } from "@/services/file-uploader";
import { DialogRoot, DialogContent } from "@/chakra/dialog";
import { SkeletonWrapper } from "@/components/skeleton-wrapper";
import { FileUploadRoot, FileUploadTrigger, FileUploadDropzone } from "@/chakra/file-upload";

namespace ReceiptUpload {
	export interface Props {
		readonly editing: boolean;
		readonly loading: boolean;
		readonly fileId: string | undefined;
		readonly ownerId: string | undefined;
		readonly onChange: (fileId: string) => void;
	}
}

export const ReceiptUpload: React.FC<ReceiptUpload.Props> = (props) => {
	const { fileId, ownerId, editing, loading, onChange } = props;
	const [dialog, { setValue: setDialog, setTrue: openDialog }] = useBoolean(false);

	const { data: url, isPending: loadingImage } = useQuery({
		enabled: !!fileId,
		queryKey: ["receipts", fileId],
		queryFn: () => API.Storage.downloadFile("receipts", fileId)
	});

	const { uploadFile } = useFileUploader(onChange);

	if (!editing && !fileId && !loading) {
		return (
			<EmptyState
				height="100%"
				display="flex"
				paddingBlock={0}
				alignItems="center"
				icon={<BsReceipt />}
				justifyContent="center"
				title="No receipt uploaded"
			/>
		);
	}

	return (
		<>
			<DialogRoot lazyMount open={dialog} onOpenChange={(e) => setDialog(e.open)}>
				<DialogContent margin={0} width="100vw" height="100vh" boxShadow="none" justifyContent="center" backgroundColor="transparent">
					<Center>{url && <Image src={url} alt="receipt" />}</Center>
				</DialogContent>
			</DialogRoot>
			<Stack width="100%" height="100%" alignItems="center" justifyContent="center">
				<SkeletonWrapper loading={loading || loadingImage} skeleton={<Skeleton width="full" height="full" />}>
					{url && <Image src={url} alt="receipt" cursor="pointer" maxHeight="100px" onClick={openDialog} />}
				</SkeletonWrapper>
				{editing && (
					<FileUploadRoot
						maxFiles={1}
						height="100%"
						alignItems="center"
						paddingInline="{spacing.4}"
						accept={["image/png", "image/jpeg"]}
						onFileAccept={(details) => uploadFile({ ownerId, bucketName: "receipts", file: details.files[0] })}>
						{url ? (
							<FileUploadTrigger asChild>
								<Button size="sm" variant="outline">
									<HiUpload /> Change receipt
								</Button>
							</FileUploadTrigger>
						) : (
							<FileUploadDropzone width="100%" height="100%" minHeight="120px" label="Upload the receipt" />
						)}
					</FileUploadRoot>
				)}
			</Stack>
		</>
	);
};
