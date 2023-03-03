import { Module } from '@nestjs/common';
import { CoreModule } from '@vdtn359/nestjs-bootstrap';
import { DynamoDbService } from './services';

@Module({
	imports: [CoreModule],
	providers: [DynamoDbService],
	exports: [DynamoDbService],
})
export class DynamoModule {}
