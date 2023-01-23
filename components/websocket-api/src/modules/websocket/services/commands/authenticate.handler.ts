import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthenticateCommand } from 'src/modules/websocket/domains';
import { RequestLogger } from '@vdtn359/nestjs-bootstrap';

@CommandHandler(AuthenticateCommand)
export class AuthenticateHandler implements ICommandHandler {
	constructor(private readonly logger: RequestLogger) {}

	async execute(command: AuthenticateCommand) {
		this.logger.info('authenticate', command);
		return {
			message: `Hello ${command.name}`,
		};
	}
}
