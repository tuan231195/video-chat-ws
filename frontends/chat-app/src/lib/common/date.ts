import { format } from 'timeago.js';

export const timeAgo = (val: string | number) => {
	const date = new Date(val);
	if (Number.isNaN(date.getTime())) {
		return format(new Date());
	}
	return format(date);
};
