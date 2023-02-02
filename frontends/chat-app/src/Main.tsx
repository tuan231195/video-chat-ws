import React, { useEffect } from 'react';
import { Layout, theme } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import { loadGroups } from 'src/store/actions/group';
import { useAppDispatch } from 'src/store/store';
import Title from 'antd/es/typography/Title';
import { GroupList } from './components/groups/GroupList';

const { Header, Sider, Content } = Layout;

export function Main() {
	const {
		token: { colorBgContainer, colorPrimary, colorWhite },
	} = theme.useToken();

	const dispatch = useAppDispatch();
	useEffect(() => {
		dispatch(loadGroups());
	}, []);

	return (
		<Layout style={{ minHeight: '100vh' }}>
			<Header style={{ background: colorPrimary, display: 'flex', alignItems: 'center' }}>
				<MessageOutlined style={{ color: colorWhite, fontSize: 24, marginRight: '5px' }} />
				<Title level={5} style={{ color: colorWhite, margin: 0 }}>
					Messenger
				</Title>
			</Header>
			<Layout>
				<Sider style={{ background: colorBgContainer }}>
					<GroupList />
				</Sider>
				<Content>Content</Content>
			</Layout>
		</Layout>
	);
}
