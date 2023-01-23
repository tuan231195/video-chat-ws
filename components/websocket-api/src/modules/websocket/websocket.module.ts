import { Module } from '@nestjs/common';
import { CoreModule } from '@vdtn359/nestjs-bootstrap';
import { DynamoModule } from '@vdtn359/dynamodb-nestjs-module';
import { ConnectionRepository } from 'src/modules/websocket/repositories/connection-repository.service';
import { CommandDispatcher, AuthenticateHandler } from 'src/modules/websocket/services';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
	imports: [DynamoModule, CoreModule, CqrsModule],
	controllers: [ConnectionRepository],
	providers: [CommandDispatcher, AuthenticateHandler],
	exports: [CommandDispatcher],
})
export class WebsocketModule {}
