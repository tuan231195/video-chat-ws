import { Injectable } from '@nestjs/common';
import { GroupRepository } from 'src/modules/groups/services/group.repository';
import { ConnectionService } from 'src/modules/connections/repositories/connection.service';
import { MessageEntity } from 'src/modules/messages/entities';
import { chunk, uniq } from 'lodash';
import { UserRepository } from 'src/modules/users/repositories';

@Injectable()
export class MessageService {
	constructor(
		private readonly groupRepository: GroupRepository,
		private readonly userRepository: UserRepository,
		private readonly connectionService: ConnectionService
	) {}

	async broadcastMessage(message: MessageEntity) {
		const groupUsers = await this.groupRepository.getGroupUsers(message.groupId);
		const userConnections = uniq(
			(
				await Promise.all(
					groupUsers.map(async (groupUser) => {
						const user = await this.userRepository.load({ id: groupUser.userId });
						return user.connections ?? [];
					})
				)
			).flat()
		);

		const batches = chunk(userConnections, 10);
		for (const batch of batches) {
			// eslint-disable-next-line no-await-in-loop
			await Promise.all(
				batch.map(async (connectionId) =>
					this.connectionService.postToConnection(connectionId, {
						action: 'message:created',
						result: {
							message,
						},
					})
				)
			);
		}
	}
}
