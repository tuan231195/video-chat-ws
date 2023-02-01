import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { groups } from 'src/store/reducers/groups';

export const store = configureStore({
	devTools: true,
	reducer: combineReducers({
		groups: groups.reducer,
	}),
});
