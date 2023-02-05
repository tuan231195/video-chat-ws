import { Injectable } from '@nestjs/common';
import { MessageEntity } from 'src/modules/messages/entities';
import { MessageRepository } from 'src/modules/messages/services';
import { UserRepository } from 'src/modules/users/repositories';

@Injectable()
export class MessageHelper {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly messageRepository: MessageRepository
	) {}

	async loadDetails(idOrMessage: string | MessageEntity) {
		if (!idOrMessage) {
			return null;
		}
		let loadedMessage: MessageEntity;
		if (typeof idOrMessage === 'string') {
			loadedMessage = await this.messageRepository.load({ id: idOrMessage });
		} else {
			loadedMessage = idOrMessage;
		}
		const user = await this.userRepository.load({ id: loadedMessage.userId });
		delete user.connections;
		return {
			...loadedMessage,
			user,
		};
	}
}
