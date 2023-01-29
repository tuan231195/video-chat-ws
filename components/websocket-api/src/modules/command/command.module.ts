import { Module } from '@nestjs/common';
import { CoreModule } from '@vdtn359/nestjs-bootstrap';
import { DynamoModule } from '@vdtn359/dynamodb-nestjs-module';
import { CommandDispatcher } from 'src/modules/command/services';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
	imports: [DynamoModule, CoreModule, CqrsModule],
	providers: [CommandDispatcher],
	exports: [CommandDispatcher],
})
export class CommandModule {}
