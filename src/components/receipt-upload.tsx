import React, { useState } from "react";
import { HiUpload } from "react-icons/hi";
import { BsReceipt } from "react-icons/bs";
import { Image, Stack, Center } from "@chakra-ui/react";
import { Controller, useFormContext } from "react-hook-form";
import { useQuery, useMutation } from "@tanstack/react-query";

import { Button } from "@/chakra/button";
import { toaster } from "@/chakra/toaster";
import { EmptyState } from "@/chakra/empty-state";
import type { NewFormState } from "@/schemas/form.schema";
import { DialogRoot, DialogContent } from "@/chakra/dialog";
import { uploadImage, downloadImage } from "@/components/profile-avatar";
import { FileUploadRoot, FileUploadTrigger, FileUploadDropzone } from "@/chakra/file-upload";

export const ReceiptUpload: React.FC<{ editing: boolean; billId: string | undefined }> = (props) => {
	const { billId, editing } = props;
	const [openDialog, setOpenDialog] = useState(false);

	const { watch, control, setValue } = useFormContext<NewFormState>();
	const receiptFile = watch("receiptFile");

	const { data: receiptUrl } = useQuery({
		queryKey: ["receipts", receiptFile],
		queryFn: () => downloadImage("receipts", receiptFile ?? undefined)
	});

	const mutation = useMutation({
		mutationFn: uploadImage,
		onError: () => {
			toaster.create({
				type: "error",
				title: "Failed to upload receipt",
				description: "An error occurred while uploading the receipt. Please try again."
			});
		},
		onSuccess: (filePath) => {
			toaster.create({ type: "success", title: "Receipt uploaded", description: "The receipt has been uploaded successfully." });
			setValue("receiptFile", filePath);
		}
	});

	console.log({ editing, receiptUrl, receiptFile });

	if (!editing && !receiptUrl?.url) {
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
						<Center>{receiptUrl?.url && <Image alt="receipt" src={receiptUrl.url} />}</Center>
					</DialogContent>
				</DialogRoot>
			)}
			<Stack width="100%" height="100%" alignItems="center" justifyContent="center">
				{receiptUrl?.url && <Image alt="receipt" cursor="pointer" maxHeight="100px" src={receiptUrl.url} onClick={() => setOpenDialog(true)} />}
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
								onFileAccept={(details) => mutation.mutate({ objectId: billId, bucketName: "receipts", image: details.files[0] })}>
								{!receiptUrl?.url && <FileUploadDropzone width="100%" height="100%" minHeight="120px" label="Upload the receipt" />}
								{receiptUrl?.url && (
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
