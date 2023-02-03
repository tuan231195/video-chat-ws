import { Injectable, UnauthorizedException } from '@nestjs/common';
import { GroupRepository } from 'src/modules/groups/services';
import { MessageRepository } from 'src/modules/messages/services';
import { ErrorCodes } from 'src/utils/error-codes';

@Injectable()
export class GroupHelper {
	constructor(
		private readonly groupRepository: GroupRepository,
		private readonly messageRepository: MessageRepository
	) {}

	async loadDetails(groupId: string) {
		const group = await this.groupRepository.load({
			id: groupId,
		});
		if (!group) {
			return group;
		}

		return {
			...group,
			lastMessage: group.lastMessageId ? await this.messageRepository.load({ id: group.lastMessageId }) : null,
		};
	}

	async checkGroupUser(groupId: string, userId: string) {
		const groupUser = await this.groupRepository.getGroupUser(groupId, userId);

		if (!groupUser) {
			throw new UnauthorizedException({
				message: 'User not in group',
				code: ErrorCodes.USER_NOT_IN_GROUP,
			});
		}
	}
}
