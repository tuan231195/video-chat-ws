import { createListenerMiddleware } from '@reduxjs/toolkit';
import { notification } from 'antd';

export const errorMiddleware = createListenerMiddleware();
errorMiddleware.startListening({
	predicate: (action) => action.type.endsWith('/rejected'),
	effect: (action) => {
		const { error } = action;
		const status = error?.status ?? 500;
		const errors = error?.errors ?? [];

		const message = status >= 500 || !errors[0]?.message ? 'Something went wrong' : errors[0].message;
		notification.error({
			message,
			type: status === 500 ? 'error' : 'warning',
			duration: 2000,
		});
	},
});
