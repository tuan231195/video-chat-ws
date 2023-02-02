export class ResponseError extends Error {
	errors: any[];

	status: number;

	constructor(errorResponse: any = {}) {
		super('Response error');
		this.errors = errorResponse.errors ?? [];
		this.status = errorResponse.status ?? 500;
	}
}
