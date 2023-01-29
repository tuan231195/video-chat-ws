import { IsDefined, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Command } from 'src/modules/command/domains/commands/decorator';
import { BaseCommand } from 'src/modules/command/domains';
import { Message } from 'src/modules/messages/domains/message';
import { Type } from 'class-transformer';

@Command('message:create')
export class CreateMessageCommand extends BaseCommand {
	@IsNotEmpty()
	@IsString()
	groupId!: string;

	@IsDefined()
	@ValidateNested()
	@Type(() => Message)
	message!: Message;
}
