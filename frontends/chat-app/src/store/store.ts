import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { groupsReducer } from 'src/store/reducers/groups.reducer';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { errorMiddleware } from 'src/store/middlewares/error';
import { messagesReducer } from 'src/store/reducers/messages.reducer';

const reducers = combineReducers({
	groups: groupsReducer.reducer,
	messages: messagesReducer.reducer,
});

export const store = configureStore({
	devTools: true,
	reducer: reducers,
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(errorMiddleware.middleware),
});

export type RootState = ReturnType<typeof reducers>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
