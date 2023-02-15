import { Injectable } from '@nestjs/common';
import { AsyncContext, RequestLogger } from '@vdtn359/nestjs-bootstrap';
import { getApiGateway } from 'src/utils/response';
import { ConnectionRepository } from 'src/modules/connections/repositories/connection.repository';
import { GoneException } from '@aws-sdk/client-apigatewaymanagementapi';
import { chunk, uniq } from 'lodash';
import { UserRepository } from 'src/modules/users/repositories';

@Injectable()
export class ConnectionService {
	constructor(
		private readonly logger: RequestLogger,
		private readonly asyncContext: AsyncContext<string, any>,
		private readonly connectionRepository: ConnectionRepository,
		private readonly userRepository: UserRepository
	) {}

	async postToConnection(connectionId: string, userId: string, data: Record<string, any>) {
		this.logger.info(`Posting to connection ${connectionId}`, data);
		const { stage, domainName } = this.asyncContext.get('context');
		const apiGatewayService = getApiGateway(stage, domainName);
		try {
			await apiGatewayService.postToConnection({
				ConnectionId: connectionId,
				Data: Buffer.from(JSON.stringify(data)),
			});
			return true;
		} catch (err: any) {
			if (err instanceof GoneException) {
				await this.connectionRepository.destroyConnection(connectionId, userId);
				return false;
			}
			throw err;
		}
	}

	async postToUsers(userIds: string[], data: Record<string, any>) {
		const userConnections = uniq(
			(
				await Promise.all(
					userIds.map(async (userId) => {
						const user = await this.userRepository.load({ id: userId });
						return (user.connections ?? []).map((connectionId: string) => ({
							connectionId,
							userId,
						}));
					})
				)
			).flat()
		);

		const batches = chunk(userConnections, 10);
		for (const batch of batches) {
			// eslint-disable-next-line no-await-in-loop
			await Promise.all(
				batch.map(async ({ connectionId, userId }) => this.postToConnection(connectionId, userId, data))
			);
		}
	}
}
