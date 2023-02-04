import { Avatar, Empty, Input, Space } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'src/store/store';
import { CenterSpin } from 'src/components/common/CenterSpin';
import { useSession } from 'src/context/session';
import Text from 'antd/es/typography/Text';
import { generateAvatar } from 'src/lib/common/avatar';
import { timeAgo } from 'src/lib/common/date';
import { SendOutlined } from '@ant-design/icons';
import { sendMessage } from 'src/store/actions/message';
import styles from './Messages.module.css';

export const Messages = () => {
	const { loading, items } = useAppSelector((store) => store.messages);
	const { selectedGroupId } = useAppSelector((store) => store.groups);
	const { user } = useSession();
	const listRef = useRef<HTMLDivElement>(null as any);
	const [message, setMessage] = useState('');
	const dispatch = useAppDispatch();

	useEffect(() => {
		if (!loading && listRef.current) {
			listRef.current.scrollTop = listRef.current.scrollHeight;
		}
	}, [loading]);

	const onSendMessage = () => {
		if (!message) {
			return;
		}
		dispatch(
			sendMessage({
				message,
				groupId: selectedGroupId!,
			})
		);
		setMessage('');
	};

	function messageList() {
		return (
			<div className={styles['message-list']} ref={listRef}>
				{!items.length && <Empty className={styles['empty-state']} />}
				{items.map((item) => {
					const isCurrentUser = item.user.id === user.id;
					return (
						<div
							key={item.id}
							className={`${styles['message-item']} ${
								isCurrentUser ? styles['message-item--current'] : ''
							}`}>
							<Avatar src={generateAvatar(item.userId)} />
							<div className={styles['message-item-text']}>
								<Space direction={'vertical'} size={2}>
									<Text strong>{item.user.name}</Text>
									<Text>{item.body}</Text>
								</Space>
								<Text italic className={styles['message-item-time']}>
									{timeAgo(item.createdAt)}
								</Text>
							</div>
						</div>
					);
				})}
			</div>
		);
	}

	function messageBox() {
		return (
			<Input
				className={styles['input-box']}
				value={message}
				onChange={(e) => {
					setMessage(e.target.value);
				}}
				autoFocus
				onPressEnter={onSendMessage}
				size="large"
				addonAfter={<SendOutlined onClick={onSendMessage} />}
				placeholder={'Enter your message...'}
			/>
		);
	}

	return (
		<div className={styles['message-container']}>
			{loading && <CenterSpin />}
			{!loading && (
				<>
					{messageList()}
					{messageBox()}
				</>
			)}
		</div>
	);
};
