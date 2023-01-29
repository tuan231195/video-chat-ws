export abstract class BaseCommand {
	context!: {
		userId: string;
		connectionId: string;
	};

	action!: string;
}
