import { Injectable } from '@nestjs/common';
import { GroupRepository } from 'src/modules/groups/repositories/group.repository';
import { ConnectionService } from 'src/modules/connections/repositories/connection.service';
import { UserRepository } from 'src/modules/users/repositories';
import { MessageRepository } from 'src/modules/messages/repositories/message.repository';
import { chunk, uniq } from 'lodash';
import { MessageDto } from 'src/modules/messages/domains/value-objects';
import { GroupUserRepository } from 'src/modules/groups/repositories';
import { newId } from 'src/utils/id';
import { RequestLogger } from '@vdtn359/nestjs-bootstrap';

@Injectable()
export class MessageService {
	constructor(
		private readonly groupUserRepository: GroupUserRepository,
		private readonly groupRepository: GroupRepository,
		private readonly messageRepository: MessageRepository,
		private readonly userRepository: UserRepository,
		private readonly connectionService: ConnectionService,
		private readonly logger: RequestLogger
	) {}

	async broadcastMessage(message: MessageDto) {
		const groupUsers = await this.groupUserRepository.queryAll({
			key: {
				groupId: message.groupId,
			},
		});
		const userConnections = uniq(
			(
				await Promise.all(
					groupUsers.map(async (groupUser) => {
						const user = await this.userRepository.load({ id: groupUser.userId });
						return (user.connections ?? []).map((connectionId: string) => ({
							connectionId,
							userId: groupUser.userId,
						}));
					})
				)
			).flat()
		);

		const batches = chunk(userConnections, 10);
		for (const batch of batches) {
			// eslint-disable-next-line no-await-in-loop
			await Promise.all(
				batch.map(async ({ connectionId, userId }) =>
					this.connectionService.postToConnection(connectionId, userId, {
						action: 'message:created',
						result: {
							message,
						},
					})
				)
			);
		}
	}

	async createMessage(messageDto: MessageDto) {
		this.logger.info('Creating message for group', {
			groupId: messageDto.groupId,
			userId: messageDto.userId,
		});
		const messageEntity = await this.messageRepository.save({
			...messageDto,
			id: newId(),
			createdAt: new Date().toISOString(),
		});

		await this.groupUserRepository.update(
			{ groupId: messageDto.groupId, userId: messageDto.userId },
			{
				lastAccess: new Date().toISOString(),
			}
		);

		await this.groupRepository.update(
			{ id: messageDto.groupId },
			{
				lastMessageId: messageEntity.id,
			}
		);

		return messageEntity;
	}
}
