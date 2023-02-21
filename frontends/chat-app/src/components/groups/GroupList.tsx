import { Avatar, Layout, List, Space, Typography } from 'antd';
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from 'src/store/store';
import { UserGroup } from 'src/types/group';
import { selectGroup } from 'src/store/actions/group';
import { CenterSpin } from 'src/components/common/CenterSpin';
import { generateAvatar } from 'src/lib/common/avatar';
import classnames from 'classnames';
import { timeAgo } from 'src/lib/common/date';
import { LoginOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { GroupAddModal } from 'src/components/groups/GroupAddModal';
import { GroupJoinModal } from 'src/components/groups/GroupJoinModal';
import styles from './GroupList.module.css';

const { Text, Title } = Typography;

const { Header: AppHeader } = Layout;

export const GroupList = () => {
	const { loading, items, selectedGroupId } = useAppSelector((store) => store.groups);
	const [isShowingCreateGroupModal, setShowingCreateGroupModal] = useState(false);
	const [isShowingJoinGroupModal, setShowingJoinGroupModal] = useState(false);
	const dispatch = useAppDispatch();
	if (loading) {
		return <CenterSpin size="large" />;
	}
	const onSelectGroup = (group: UserGroup) => {
		dispatch(selectGroup(group));
	};
	const onShowGroupModal = () => {
		setShowingCreateGroupModal(true);
	};

	const onJoinGroup = () => {
		setShowingJoinGroupModal(true);
	};

	return (
		<>
			<AppHeader className={styles['group-controls-header']}>
				<Title level={5} style={{ margin: 0 }}>
					Chats
				</Title>
				<Space direction={'horizontal'} size={10} align={'end'}>
					<UsergroupAddOutlined style={{ fontSize: 24 }} onClick={onShowGroupModal} />
					<LoginOutlined style={{ fontSize: 24 }} onClick={onJoinGroup} />
				</Space>
			</AppHeader>
			{isShowingCreateGroupModal && <GroupAddModal onClose={() => setShowingCreateGroupModal(false)} />}
			{isShowingJoinGroupModal && <GroupJoinModal onClose={() => setShowingJoinGroupModal(false)} />}
			<List
				size="large"
				itemLayout="horizontal"
				dataSource={items}
				renderItem={(item) => {
					const isSelected = item.groupId === selectedGroupId;
					const isUnread =
						!item.lastAccess ||
						(item.group.lastMessage &&
							new Date(item.group.lastMessage.createdAt) > new Date(item.lastAccess));
					return (
						<List.Item
							className={classnames(styles['group-item'], {
								[styles['group-item--selected']]: isSelected,
								[styles['group-item--unread']]: isUnread,
							})}
							key={item.groupId}
							onClick={() => onSelectGroup(item)}>
							<List.Item.Meta
								avatar={
									<span>
										<i
											className={classnames(styles.group_item_icon, {
												[styles['group-item-icon--unread']]: isUnread,
											})}
										/>
										<Avatar src={generateAvatar(item.groupId)} />
									</span>
								}
								title={<Text ellipsis>{item.group.name}</Text>}
								description={<Text ellipsis>{item.group.lastMessage?.body ?? ''}</Text>}
							/>
							{!!item.group.lastMessage && (
								<div className={styles['group-item-time']}>
									{timeAgo(item.group.lastMessage.createdAt, 'mini')}{' '}
								</div>
							)}
						</List.Item>
					);
				}}
			/>
		</>
	);
};
