import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthenticateCommand, Commands } from 'src/modules/command/domains';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { CommandBus } from '@nestjs/cqrs';
import { ErrorCodes } from 'src/utils/error-codes';

@Injectable()
export class CommandDispatcher {
	constructor(private readonly commandBus: CommandBus) {}

	async dispatch(command: any) {
		const commandClass = this.getCommandClass(command);
		const transformedCommand = plainToClass(commandClass, command);
		const validateErrors = await validate(transformedCommand);
		if (validateErrors.length) {
			throw new BadRequestException(
				validateErrors
					.flat()
					.filter((item) => !!item.constraints)
					.map((item) =>
						Object.entries(item.constraints || {}).map(([, message]) => ({
							message,
							path: item.property,
							code: ErrorCodes.INVALID_VALUE,
						}))
					)
					.flat()
			);
		}
		return this.commandBus.execute(transformedCommand);
	}

	private getCommandClass(baseCommand: Commands) {
		// eslint-disable-next-line sonarjs/no-small-switch
		switch (baseCommand.action) {
			case 'authenticate':
				return AuthenticateCommand;
			default:
				throw new Error('Unknown command');
		}
	}
}
