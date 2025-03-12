import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { trpc } from "@/services";

export function useSwitchGroup() {
	const utils = trpc.useUtils();
	const router = useRouter();

	return trpc.user.selectGroup.useMutation({
		onSuccess: () => {
			utils.invalidate().then(() => {
				toast.success("You have successfully changed the group");
				router.refresh();
			});
		}
	});
}
