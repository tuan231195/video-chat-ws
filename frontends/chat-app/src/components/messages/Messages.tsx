import { Avatar, Empty, Input, Space, Spin } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'src/store/store';
import { CenterSpin } from 'src/components/common/CenterSpin';
import { useSession } from 'src/context/session';
import Text from 'antd/es/typography/Text';
import { generateAvatar } from 'src/lib/common/avatar';
import { timeAgo } from 'src/lib/common/date';
import { SendOutlined } from '@ant-design/icons';
import { loadMoreMessages, sendMessage } from 'src/store/actions/message';
import InfiniteScroll from 'react-infinite-scroll-component';
import styles from './Messages.module.css';

export const Messages = () => {
	const { loading, items, lastKey } = useAppSelector((store) => store.messages);
	const { selectedGroupId } = useAppSelector((store) => store.groups);
	const { user } = useSession();
	const listRef = useRef<HTMLDivElement>(null as any);
	const [message, setMessage] = useState('');
	const dispatch = useAppDispatch();

	const scrollToBottom = () => {
		if (listRef.current) {
			listRef.current.scrollTop = listRef.current.scrollHeight;
		}
	};

	useEffect(() => {
		if (!loading) {
			scrollToBottom();
		}
	}, [loading]);

	const onSendMessage = async () => {
		if (!message) {
			return;
		}
		setMessage('');
		await dispatch(
			sendMessage({
				message,
				groupId: selectedGroupId!,
			})
		);
		scrollToBottom();
	};

	const loadMore = async () => {
		await dispatch(
			loadMoreMessages({
				groupId: selectedGroupId!,
			})
		);
	};

	function messageList() {
		return (
			<div className={styles['message-scroller']} id="message-scroller" ref={listRef}>
				{!items.length && <Empty className={styles['empty-state']} />}
				{!!items.length && (
					<InfiniteScroll
						dataLength={items.length}
						className={styles['message-list']}
						scrollableTarget={'message-scroller'}
						next={loadMore}
						inverse={true}
						hasMore={!!lastKey}
						loader={<Spin className={styles['message-spinner']} />}>
						{items.map((item) => {
							const isCurrentUser = item.user.id === user.id;
							return (
								<div
									key={item.id}
									className={`${styles['message-item']} ${
										isCurrentUser ? styles['message-item--current'] : ''
									}`}>
									<Avatar
										className={styles['message-item-avatar']}
										src={generateAvatar(item.userId)}
									/>
									<div className={styles['message-item-text']}>
										<Space direction={'vertical'} size={2}>
											<Text strong>{item.user.name}</Text>
											<Text>{item.body}</Text>
										</Space>
									</div>
									<Text italic className={styles['message-item-time']}>
										{timeAgo(item.createdAt)}
									</Text>
								</div>
							);
						})}
					</InfiniteScroll>
				)}
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
