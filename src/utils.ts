import { parse, format, isValid, isToday, isThisWeek, isYesterday, formatDistanceToNow, differenceInCalendarDays } from "date-fns";

export function noop() {}

export const CLIENT_DATE_FORMAT = "dd/MM/yy";
export const SERVER_DATE_FORMAT = "yyyy-MM-dd";

export function formatDate(date?: string | null) {
	const value = date ?? new Date();

	return { server: format(value, SERVER_DATE_FORMAT), client: format(value, CLIENT_DATE_FORMAT) };
}

export function isValidClientDate(dateString: string | null) {
	if (dateString === null) {
		return false;
	}

	return isValid(parse(dateString, CLIENT_DATE_FORMAT, new Date()));
}

export function formatTime(time: string | undefined | null) {
	if (time === undefined || time === null) {
		return "";
	}

	return format(new Date(time), "PPpp");
}

export function displayDateAsTitle(date: string | undefined | null) {
	if (date === undefined || date === null) {
		return "";
	}

	return format(date, "MMMM dd, yyyy");
}

export function displayDate(date: string | undefined | null) {
	if (date === undefined || date === null) {
		return "";
	}

	const daysDifference = differenceInCalendarDays(new Date(), date);

	if (isToday(date)) {
		return "Today";
	} else if (isYesterday(date)) {
		return "Yesterday";
	} else if (isThisWeek(date)) {
		return `This ${format(date, "EEEE")}`;
	} else if (daysDifference < 30) {
		return `${daysDifference} days ago`;
	} else {
		return capitalize(formatDistanceToNow(date, { addSuffix: true }));
	}
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

export function renderError(validating: boolean, error: string | undefined) {
	return {
		errorText: validating ? error : undefined,
		invalid: validating ? !!error : undefined
	};
}
