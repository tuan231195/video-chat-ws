import { Injectable } from '@nestjs/common';
import { GroupRepository } from 'src/modules/groups/services/group.repository';
import { getApiGateway } from 'src/utils/response';
import { CreateMessageCommand } from 'src/modules/messages/domains';

interface BroadcastMessageOptions {
	exclude?: string;
}

@Injectable()
export class MessageService {
	constructor(private readonly groupRepository: GroupRepository) {}

	async broadcastMessage(messageCommand: CreateMessageCommand, { exclude }: BroadcastMessageOptions = {}) {
		const users = await this.groupRepository.getGroupUsers(messageCommand.groupId);
		const broadcastUsers = users.filter((user) => user.userId !== exclude);
		const apiGatewayService = getApiGateway(messageCommand.context.stage, messageCommand.context.domainName);

		const data = Buffer.from(
			JSON.stringify({
				action: 'message:created',
				message: messageCommand.message,
				userId: messageCommand.context.userId,
			})
		);
		await Promise.all(
			broadcastUsers.map((user) =>
				apiGatewayService.postToConnection({
					ConnectionId: user.connectionId,
					Data: data,
				})
			)
		);
	}
}
