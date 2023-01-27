import { Module } from '@nestjs/common';
import { CoreModule } from '@vdtn359/nestjs-bootstrap';
import { DynamoModule } from '@vdtn359/dynamodb-nestjs-module';
import { ConnectionRepository } from './repositories';

@Module({
	imports: [DynamoModule, CoreModule],
	providers: [ConnectionRepository],
	exports: [ConnectionRepository],
})
export class ConnectionModule {}
