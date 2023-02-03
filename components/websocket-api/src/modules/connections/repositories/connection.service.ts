import { Injectable } from '@nestjs/common';
import { AsyncContext, RequestLogger } from '@vdtn359/nestjs-bootstrap';
import { getApiGateway } from 'src/utils/response';
import { ConnectionRepository } from 'src/modules/connections/repositories/connection.repository';
import { GoneException } from '@aws-sdk/client-apigatewaymanagementapi';

@Injectable()
export class ConnectionService {
	constructor(
		private readonly logger: RequestLogger,
		private readonly asyncContext: AsyncContext<string, any>,
		private readonly connectionRepository: ConnectionRepository
	) {}

	async postToConnection(connectionId: string, data: Record<string, any>) {
		this.logger.info(`Posting to connection ${connectionId}`, data);
		const { stage, domainName } = this.asyncContext.get('context');
		const apiGatewayService = getApiGateway(stage, domainName);
		try {
			await apiGatewayService.postToConnection({
				ConnectionId: connectionId,
				Data: Buffer.from(JSON.stringify(data)),
			});
		} catch (err: any) {
			if (err instanceof GoneException) {
				await this.connectionRepository.destroyConnection(connectionId);
				return;
			}
			throw err;
		}
	}
}
