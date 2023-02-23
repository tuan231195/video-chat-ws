import { Avatar, Layout, List, Space, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'src/store/store';
import { UserGroup } from 'src/types/group';
import { selectGroup } from 'src/store/actions/group';
import { CenterSpin } from 'src/components/common/CenterSpin';
import { generateAvatar } from 'src/lib/common/avatar';
import classnames from 'classnames';
import { timeAgo } from 'src/lib/common/date';
import { EnterOutlined, LogoutOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { GroupAddModal } from 'src/components/groups/GroupAddModal';
import { GroupJoinModal } from 'src/components/groups/GroupJoinModal';
import { useForceUpdate } from 'src/lib/common/hooks';
import { useAuth0 } from '@auth0/auth0-react';
import styles from './GroupList.module.css';

const { Text, Title } = Typography;

const { Header: AppHeader } = Layout;

export const GroupList = () => {
	const { logout } = useAuth0();
	const { loading, items, selectedGroupId } = useAppSelector((store) => store.groups);
	const [isShowingCreateGroupModal, setShowingCreateGroupModal] = useState(false);
	const [isShowingJoinGroupModal, setShowingJoinGroupModal] = useState(false);
	const dispatch = useAppDispatch();
	const update = useForceUpdate();
	useEffect(() => {
		const interval = setInterval(update, 60 * 1000);
		return () => {
			clearInterval(interval);
		};
	}, []);
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

	const onLogout = () => {
		logout({
			logoutParams: {
				returnTo: window.location.origin,
			},
		});
	};

	return (
		<>
			<AppHeader className={styles['group-controls-header']}>
				<Title level={5} style={{ margin: 0 }}>
					Chats
				</Title>
				<Space direction={'horizontal'} size={10} align={'end'}>
					<UsergroupAddOutlined style={{ fontSize: 24 }} onClick={onShowGroupModal} />
					<EnterOutlined style={{ fontSize: 24 }} onClick={onJoinGroup} />
					<LogoutOutlined style={{ fontSize: 24 }} onClick={onLogout} />
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
									{timeAgo(item.group.lastMessage.createdAt, 'mini-minute-now')}{' '}
								</div>
							)}
						</List.Item>
					);
				}}
			/>
		</>
	);
};
