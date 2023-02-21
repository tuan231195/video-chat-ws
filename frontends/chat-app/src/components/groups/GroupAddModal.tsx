import React, { useState } from 'react';
import { Form, Input, Modal } from 'antd';
import styles from 'src/components/groups/GroupAddModal.module.css';
import { useAppDispatch } from 'src/store/store';
import { createGroup } from 'src/store/actions/group';
import { GroupCreatedModal } from 'src/components/groups/GroupCreatedModal';

export const GroupAddModal = ({ onClose }: { onClose: () => void }) => {
	const [form] = Form.useForm();
	const dispatch = useAppDispatch();
	const [buttonDisabled, setButtonDisabled] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const [createdGroup, setCreatedGroup] = useState(null);

	const onSave = async () => {
		const payload = form.getFieldsValue();
		try {
			setSubmitting(true);
			const userGroup = await dispatch(createGroup(payload));
			setCreatedGroup(userGroup.payload.groupId);
			onClose();
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<Modal
			className={styles.modal}
			open
			title="Create group"
			onCancel={onClose}
			onOk={onSave}
			okButtonProps={{ disabled: buttonDisabled || submitting }}>
			<div className={styles.modal}>
				{!!createdGroup && <GroupCreatedModal id={createdGroup} onClose={onClose} />}
				<Form
					form={form}
					onFieldsChange={() =>
						setButtonDisabled(form.getFieldsError().some((field) => field.errors.length > 0))
					}>
					<Form.Item
						name="name"
						label="Title"
						rules={[{ required: true, message: 'Group title is required' }]}>
						<Input />
					</Form.Item>
				</Form>
			</div>
		</Modal>
	);
};
