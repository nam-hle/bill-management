export const formatCurrency = (amount: number) => {
	return new Intl.NumberFormat("vi-VN", { currency: "VND", style: "currency" }).format(amount * 1000);
};
