import { Module } from '@nestjs/common';
import { CoreModule } from '@vdtn359/nestjs-bootstrap';
import { DynamoModule } from '@vdtn359/dynamodb-nestjs-module';
import { ConnectionService } from 'src/modules/connections/repositories/connection.service';
import { UserModule } from 'src/modules/users/user.module';
import { ConnectionRepository } from './repositories';

@Module({
	imports: [DynamoModule, CoreModule, UserModule],
	providers: [ConnectionRepository, ConnectionService],
	exports: [ConnectionRepository, ConnectionService],
})
export class ConnectionModule {}
