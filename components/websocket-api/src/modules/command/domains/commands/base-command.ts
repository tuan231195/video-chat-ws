export abstract class BaseCommand {
	context!: {
		userId: string;
		connectionId: string;
		stage: string;
		domainName: string;
	};

	action!: string;
}
