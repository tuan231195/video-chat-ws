import React from 'react';
import { Input, Modal } from 'antd';
import styles from 'src/components/groups/GroupCreatedModal.module.css';
import copy from 'copy-to-clipboard';
import { CopyFilled } from '@ant-design/icons';

export const GroupCreatedModal = ({ id, onClose }: { id: string; onClose: () => void }) => (
	<Modal className={styles.modal} open title="Group created" onCancel={onClose} footer={null}>
		<div className={styles.modal}>
			<div>
				<strong>Group ID:</strong>
				<Input name={'title'} value={id} disabled addonAfter={<CopyFilled onClick={() => copy(id)} />} />
			</div>
		</div>
	</Modal>
);
