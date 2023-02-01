export class Logger {
	static info(...args: any[]) {
		// eslint-disable-next-line no-console
		console.info(...args);
	}

	static error(...args: any[]) {
		// eslint-disable-next-line no-console
		console.error(...args);
	}
}
