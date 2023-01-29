import { BadRequestException, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { CommandBus } from '@nestjs/cqrs';
import { ErrorCodes } from 'src/utils/error-codes';
import { allCommands } from 'src/modules/command/domains/commands/decorator';
import { AsyncContext } from '@vdtn359/nestjs-bootstrap';
import { BaseCommand } from 'src/modules/command/domains';

interface CommandObject {
	action: string;
}

@Injectable()
export class CommandDispatcher {
	constructor(private readonly commandBus: CommandBus, private asyncContext: AsyncContext<string, any>) {}

	async dispatch(command: CommandObject) {
		const commandClass = this.getCommandClass(command);
		const context = this.asyncContext.get('context');
		const transformedCommand: BaseCommand = plainToClass(commandClass, {
			...command,
			context,
		});
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

	private getCommandClass(baseCommand: CommandObject) {
		const commandClass = allCommands[baseCommand.action];
		if (!commandClass) {
			throw new BadRequestException({
				code: ErrorCodes.UNKNOWN_COMMAND,
				metadata: {
					action: baseCommand.action,
				},
			});
		}
		return commandClass;
	}
}
