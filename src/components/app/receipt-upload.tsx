import { HiUpload } from "react-icons/hi";
import { BsReceipt } from "react-icons/bs";
import React, { useState, useEffect } from "react";
import { Image, Stack, Center } from "@chakra-ui/react";

import { Button } from "@/components/ui/button";
import { generateUid, downloadImage } from "@/utils";
import { createSupabaseClient } from "@/supabase/client";
import { EmptyState } from "@/components/ui/empty-state";
import { DialogRoot, DialogContent } from "@/components/ui/dialog";
import { FileUploadRoot, FileUploadTrigger, FileUploadDropzone } from "@/components/ui/file-upload";

export const ReceiptUpload: React.FC<{ editing: boolean; receiptFile: string | undefined; onReceiptChange(file: string): void }> = (props) => {
	const { editing, receiptFile, onReceiptChange } = props;
	const [receiptUrl, setReceiptUrl] = useState<string | undefined>(undefined);
	const [openDialog, setOpenDialog] = useState(false);

	const supabase = createSupabaseClient();

	useEffect(() => {
		downloadImage("receipts", receiptFile).then(setReceiptUrl);
	}, [supabase, receiptFile]);

	const onUpload = async (file: File) => {
		try {
			const extension = file.name.split(".").pop();
			const receiptFile = `${generateUid()}.${extension}`;

			const { error: uploadError } = await supabase.storage.from("receipts").upload(receiptFile, file);

			if (uploadError) {
				throw uploadError;
			}

			onReceiptChange(receiptFile);
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error("Error uploading file: ", error);
		}
	};

	const Preview = React.useCallback(
		(props: { children?: React.ReactNode }) => {
			return (
				<Stack width="100%" height="100%" alignItems="center" justifyContent="center">
					{receiptUrl && <Image alt="receipt" src={receiptUrl} cursor="pointer" maxHeight="100px" onClick={() => setOpenDialog(true)} />}
					{props.children}
				</Stack>
			);
		},
		[receiptUrl]
	);

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
				{receiptUrl && <Image alt="receipt" src={receiptUrl} cursor="pointer" maxHeight="100px" onClick={() => setOpenDialog(true)} />}
				{editing && (
					<FileUploadRoot
						maxFiles={1}
						height="100%"
						alignItems="center"
						paddingInline="{spacing.4}"
						accept={["image/png", "image/jpeg"]}
						onFileAccept={(details) => onUpload(details.files[0])}>
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
			</Stack>
		</>
	);
};
