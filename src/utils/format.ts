export const formatCurrency = (amount: number) => {
	return new Intl.NumberFormat("vi-VN", { currency: "VND", style: "currency" }).format(amount * 1000);
};

export const formatDate = (dateString: string) => {
	return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric" });
};
