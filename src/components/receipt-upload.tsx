import React, { useState } from "react";
import { HiUpload } from "react-icons/hi";
import { BsReceipt } from "react-icons/bs";
import { useQuery } from "@tanstack/react-query";
import { Image, Stack, Center } from "@chakra-ui/react";

import { Button } from "@/chakra/button";
import { EmptyState } from "@/chakra/empty-state";
import { DialogRoot, DialogContent } from "@/chakra/dialog";
import { downloadImage, useFileUploader } from "@/services/file-uploader";
import { FileUploadRoot, FileUploadTrigger, FileUploadDropzone } from "@/chakra/file-upload";

namespace ReceiptUpload {
	export interface Props {
		readonly editing: boolean;
		readonly fileId: string | undefined;
		readonly ownerId: string | undefined;
		readonly onChange: (fileId: string) => void;
	}
}

export const ReceiptUpload: React.FC<ReceiptUpload.Props> = (props) => {
	const { fileId, ownerId, editing, onChange } = props;
	const [openDialog, setOpenDialog] = useState(false);

	const { data: url } = useQuery({
		enabled: !!fileId,
		queryKey: ["receipts", fileId],
		queryFn: () => downloadImage("receipts", fileId)
	});

	const { uploadFile } = useFileUploader(onChange);

	if (!editing && !url) {
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
			{openDialog && (
				<DialogRoot lazyMount open={openDialog} onOpenChange={(e) => setOpenDialog(e.open)}>
					<DialogContent margin={0} width="100vw" height="100vh" boxShadow="none" justifyContent="center" backgroundColor="transparent">
						<Center>{url && <Image src={url} alt="receipt" />}</Center>
					</DialogContent>
				</DialogRoot>
			)}
			<Stack width="100%" height="100%" alignItems="center" justifyContent="center">
				{url && <Image src={url} alt="receipt" cursor="pointer" maxHeight="100px" onClick={() => setOpenDialog(true)} />}
				{editing && (
					<FileUploadRoot
						maxFiles={1}
						height="100%"
						alignItems="center"
						paddingInline="{spacing.4}"
						accept={["image/png", "image/jpeg"]}
						onFileAccept={(details) => uploadFile({ objectId: ownerId, bucketName: "receipts", image: details.files[0] })}>
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
