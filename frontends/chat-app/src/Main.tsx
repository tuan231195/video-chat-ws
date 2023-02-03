import React, { useEffect } from 'react';
import { Layout, theme } from 'antd';
import { loadGroups } from 'src/store/actions/group';
import { useAppDispatch } from 'src/store/store';
import { Header } from 'src/components/navigation/Header';
import { Messages } from 'src/components/messages/Messages';
import { GroupList } from './components/groups/GroupList';

const { Sider, Content } = Layout;

export function Main() {
	const {
		token: { colorBgContainer, colorBorder },
	} = theme.useToken();

	const dispatch = useAppDispatch();
	useEffect(() => {
		dispatch(loadGroups());
	}, []);

	return (
		<Layout style={{ minHeight: '100vh', maxHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
			<Header />
			<Layout style={{ flexGrow: 1 }}>
				<Sider
					width={'240px'}
					style={{
						background: colorBgContainer,
						borderRight: `1px solid ${colorBorder}`,
					}}>
					<GroupList />
				</Sider>
				<Content style={{ background: colorBgContainer }}>
					<Messages />
				</Content>
			</Layout>
		</Layout>
	);
}
