import { parse, format, isValid, formatDistanceToNow } from "date-fns";

export function noop() {}

export function formatDate(date?: string | null) {
	return format(date ?? new Date(), "dd/MM/yy");
}

export function isValidDate(dateString: string | null) {
	if (dateString === null) {
		return false;
	}

	return isValid(parse(dateString, "dd/MM/yy", new Date()));
}

export function formatTime(time: string | undefined | null) {
	if (time === undefined || time === null) {
		return "";
	}

	return format(new Date(time), "PPpp");
}

export function formatDistanceTime(time: string | undefined | null) {
	if (time === undefined || time === null) {
		return "";
	}

	return formatDistanceToNow(new Date(time), { addSuffix: true });
}

export function capitalize(text: string) {
	return text[0].toUpperCase() + text.slice(1);
}
