import { Module } from '@nestjs/common';
import { CoreModule } from '@vdtn359/nestjs-bootstrap';
import { DynamoModule } from '@vdtn359/dynamodb-nestjs-module';
import { UserRepository } from 'src/modules/users/repositories';

@Module({
	imports: [DynamoModule, CoreModule],
	providers: [UserRepository],
	exports: [UserRepository],
})
export class UserModule {}
