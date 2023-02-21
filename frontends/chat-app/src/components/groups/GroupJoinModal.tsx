import React, { useState } from 'react';
import { Form, Input, Modal } from 'antd';
import styles from 'src/components/groups/GroupJoinModal.module.css';
import { useAppDispatch } from 'src/store/store';
import { joinGroup } from 'src/store/actions/group';

export const GroupJoinModal = ({ onClose }: { onClose: () => void }) => {
	const [form] = Form.useForm();
	const dispatch = useAppDispatch();
	const [buttonDisabled, setButtonDisabled] = useState(true);
	const [submitting, setSubmitting] = useState(false);

	const onSave = async () => {
		const payload = form.getFieldsValue();
		try {
			setSubmitting(true);
			await dispatch(joinGroup(payload));
			onClose();
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<Modal
			className={styles.modal}
			open
			title="Join group"
			onCancel={onClose}
			onOk={onSave}
			okButtonProps={{ disabled: buttonDisabled || submitting }}>
			<div className={styles.modal}>
				<Form
					form={form}
					onFieldsChange={() =>
						setButtonDisabled(form.getFieldsError().some((field) => field.errors.length > 0))
					}>
					<Form.Item name="groupId" label="ID" rules={[{ required: true, message: 'Group id is required' }]}>
						<Input />
					</Form.Item>
				</Form>
			</div>
		</Modal>
	);
};
