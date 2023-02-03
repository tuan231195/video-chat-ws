import { Avatar, List } from 'antd';
import React from 'react';
import { useAppDispatch, useAppSelector } from 'src/store/store';
import { UserGroup } from 'src/types/group';
import { selectGroup } from 'src/store/actions/group';
import { CenterSpin } from 'src/components/common/CenterSpin';
import { generateAvatar } from 'src/lib/common/avatar';
import styles from './GroupList.module.css';

export const GroupList = () => {
	const { loading, items, selectedGroup } = useAppSelector((store) => store.groups);
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
				const isSelected = item.groupId === selectedGroup?.groupId;
				return (
					<List.Item
						className={`${styles.group__item} ${isSelected ? styles['group__item--selected'] : ''}`}
						key={item.groupId}
						onClick={() => onSelectGroup(item)}>
						<List.Item.Meta
							avatar={<Avatar src={generateAvatar(item.groupId)} />}
							title={item.group.name}
						/>
					</List.Item>
				);
			}}
		/>
	);
};
