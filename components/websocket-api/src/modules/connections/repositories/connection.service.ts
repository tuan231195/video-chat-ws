import { Injectable } from '@nestjs/common';
import { AsyncContext, RequestLogger } from '@vdtn359/nestjs-bootstrap';
import { getApiGateway } from 'src/utils/response';

@Injectable()
export class ConnectionService {
	constructor(private readonly logger: RequestLogger, private readonly asyncContext: AsyncContext<string, any>) {}

	postToConnection(connectionId: string, data: Record<string, any>) {
		this.logger.info(`Posting to connection ${connectionId}`, data);
		const { stage, domainName } = this.asyncContext.get('context');
		const apiGatewayService = getApiGateway(stage, domainName);
		return apiGatewayService.postToConnection({
			ConnectionId: connectionId,
			Data: Buffer.from(JSON.stringify(data)),
		});
	}
}
