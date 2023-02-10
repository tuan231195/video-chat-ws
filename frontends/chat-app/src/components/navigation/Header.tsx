import { MessageOutlined } from '@ant-design/icons';
import React from 'react';
import { Layout, theme, Typography } from 'antd';

const { Header: AppHeader } = Layout;
const { Title } = Typography;

export function Header() {
	const {
		token: { colorPrimary, colorWhite },
	} = theme.useToken();

	return (
		<AppHeader style={{ background: colorPrimary, display: 'flex', alignItems: 'center' }}>
			<MessageOutlined style={{ color: colorWhite, fontSize: 24, marginRight: '5px' }} />
			<Title level={5} style={{ color: colorWhite, margin: 0 }}>
				Messenger
			</Title>
		</AppHeader>
	);
}
