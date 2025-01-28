import { HiUpload } from "react-icons/hi";
import React, { useState, useEffect } from "react";
import { Image, Stack, Center } from "@chakra-ui/react";

import { Button } from "@/components/ui/button";
import { generateUid, downloadImage } from "@/utils";
import { createSupabaseClient } from "@/supabase/client";
import { DialogRoot, DialogContent } from "@/components/ui/dialog";
import { FileUploadRoot, FileUploadTrigger, FileUploadDropzone } from "@/components/ui/file-upload";

export function ReceiptUpload() {
	const [receiptUrl, setReceiptUrl] = useState<string | undefined>(undefined);
	const [receiptPath, setReceiptPath] = useState<string | undefined>(undefined);

	const supabase = createSupabaseClient();

	useEffect(() => {
		downloadImage("receipts", receiptPath).then(setReceiptUrl);
	}, [supabase, receiptPath]);

	const onUpload = async (file: File) => {
		try {
			// setUploading(true);

			const fileExt = file.name.split(".").pop();
			const filePath = `${generateUid()}.${fileExt}`;

			const { error: uploadError } = await supabase.storage.from("receipts").upload(filePath, file);

			if (uploadError) {
				throw uploadError;
			}

			setReceiptPath(filePath);
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error("Error uploading file: ", error);
		} finally {
			// setUploading(false);
		}
	};

	const [openDialog, setOpenDialog] = useState(false);

	return (
		<>
			{openDialog && (
				<DialogRoot lazyMount open={openDialog} onOpenChange={(e) => setOpenDialog(e.open)}>
					<DialogContent margin={0} width="100vw" height="100vh" boxShadow="none" justifyContent="center" backgroundColor="transparent">
						<Center>{receiptUrl && <Image alt="receipt" src={receiptUrl} />}</Center>
					</DialogContent>
				</DialogRoot>
			)}
			<Stack width="200px" alignItems="center">
				{receiptUrl && <Image alt="receipt" height="200px" src={receiptUrl} cursor="pointer" onClick={() => setOpenDialog(true)} />}
				<FileUploadRoot maxFiles={1} alignItems="center" accept={["image/png", "image/jpeg"]} onFileAccept={(details) => onUpload(details.files[0])}>
					{!receiptUrl && <FileUploadDropzone width="200px" minHeight="120px" label="Upload the receipt" />}
					{receiptPath && (
						<FileUploadTrigger asChild>
							<Button size="sm" variant="outline">
								<HiUpload /> Change receipt
							</Button>
						</FileUploadTrigger>
					)}
				</FileUploadRoot>
			</Stack>
		</>
	);
}
