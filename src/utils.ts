import { format, formatDistanceToNow } from "date-fns";

export function noop() {}

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
