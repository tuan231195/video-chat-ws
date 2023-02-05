import { Avatar, List, Typography } from 'antd';
import React from 'react';
import { useAppDispatch, useAppSelector } from 'src/store/store';
import { UserGroup } from 'src/types/group';
import { selectGroup } from 'src/store/actions/group';
import { CenterSpin } from 'src/components/common/CenterSpin';
import { generateAvatar } from 'src/lib/common/avatar';
import classnames from 'classnames';
import { timeAgo } from 'src/lib/common/date';
import styles from './GroupList.module.css';

const { Text } = Typography;

export const GroupList = () => {
	const { loading, items, selectedGroupId } = useAppSelector((store) => store.groups);
	const dispatch = useAppDispatch();
	if (loading) {
		return <CenterSpin size="large" />;
	}
	const onSelectGroup = (group: UserGroup) => {
		dispatch(selectGroup(group));
	};
	return (
		<List
			size="large"
			itemLayout="horizontal"
			dataSource={items}
			renderItem={(item) => {
				const isSelected = item.groupId === selectedGroupId;
				const isUnread =
					!item.lastAccess ||
					(item.group.lastMessage && new Date(item.group.lastMessage.createdAt) > new Date(item.lastAccess));
				return (
					<List.Item
						className={classnames(styles.group_item, {
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
	);
};
