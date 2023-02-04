import TimeAgo, { FormatStyleName } from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

TimeAgo.addDefaultLocale(en);

const timeAgoInstance = new TimeAgo('en-US');

export const timeAgo = (val: string | number, format?: FormatStyleName) => {
	const date = new Date(val);
	if (Number.isNaN(date.getTime())) {
		return timeAgoInstance.format(new Date(), format);
	}
	return timeAgoInstance.format(date, format);
};
