import React, { useState } from "react";
import { HiUpload } from "react-icons/hi";
import { BsReceipt } from "react-icons/bs";
import { useQuery } from "@tanstack/react-query";
import { Image, Stack, Center } from "@chakra-ui/react";
import { Controller, useFormContext } from "react-hook-form";

import { Button } from "@/chakra/button";
import { EmptyState } from "@/chakra/empty-state";
import type { NewFormState } from "@/schemas/form.schema";
import { DialogRoot, DialogContent } from "@/chakra/dialog";
import { downloadImage, useFileUploader } from "@/services/file-uploader";
import { FileUploadRoot, FileUploadTrigger, FileUploadDropzone } from "@/chakra/file-upload";

namespace ReceiptUpload {
	export interface Props {
		readonly editing: boolean;
		readonly billId: string | undefined;
	}
}

export const ReceiptUpload: React.FC<ReceiptUpload.Props> = (props) => {
	const { billId, editing } = props;
	const [openDialog, setOpenDialog] = useState(false);

	const { watch, control, setValue } = useFormContext<NewFormState>();
	const receiptFile = watch("receiptFile");

	const { data: receiptUrl } = useQuery({
		queryKey: ["receipts", receiptFile],
		queryFn: () => downloadImage("receipts", receiptFile ?? undefined)
	});

	const { uploadFile } = useFileUploader((filePath) => setValue("receiptFile", filePath));

	if (!editing && !receiptUrl) {
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
						<Center>{receiptUrl && <Image alt="receipt" src={receiptUrl} />}</Center>
					</DialogContent>
				</DialogRoot>
			)}
			<Stack width="100%" height="100%" alignItems="center" justifyContent="center">
				{receiptUrl && <Image alt="receipt" cursor="pointer" src={receiptUrl} maxHeight="100px" onClick={() => setOpenDialog(true)} />}
				{editing && (
					<Controller
						control={control}
						name="receiptFile"
						render={() => (
							<FileUploadRoot
								maxFiles={1}
								height="100%"
								alignItems="center"
								paddingInline="{spacing.4}"
								accept={["image/png", "image/jpeg"]}
								onFileAccept={(details) => uploadFile({ objectId: billId, bucketName: "receipts", image: details.files[0] })}>
								{!receiptUrl && <FileUploadDropzone width="100%" height="100%" minHeight="120px" label="Upload the receipt" />}
								{receiptUrl && (
									<FileUploadTrigger asChild>
										<Button size="sm" variant="outline">
											<HiUpload /> Change receipt
										</Button>
									</FileUploadTrigger>
								)}
							</FileUploadRoot>
						)}
					/>
				)}
			</Stack>
		</>
	);
};
