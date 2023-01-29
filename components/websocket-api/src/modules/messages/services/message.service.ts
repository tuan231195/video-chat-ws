import { Injectable } from '@nestjs/common';
import { GroupRepository } from 'src/modules/groups/services/group.repository';
import { ConnectionService } from 'src/modules/connections/repositories/connection.service';
import { MessageEntity } from 'src/modules/messages/entities';

interface BroadcastMessageOptions {
	exclude?: string;
}

@Injectable()
export class MessageService {
	constructor(
		private readonly groupRepository: GroupRepository,
		private readonly connectionService: ConnectionService
	) {}

	async broadcastMessage(message: MessageEntity, { exclude }: BroadcastMessageOptions = {}) {
		const users = await this.groupRepository.getGroupUsers(message.groupId);
		const broadcastUsers = users.filter((user) => user.userId !== exclude);
		await Promise.all(
			broadcastUsers.map(async (user) =>
				this.connectionService.postToConnection(user.connectionId, {
					action: 'message:created',
					message,
				})
			)
		);
	}
}
