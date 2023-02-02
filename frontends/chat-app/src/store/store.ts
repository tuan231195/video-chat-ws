import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { groups } from 'src/store/reducers/groups';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { errorMiddleware } from 'src/store/middlewares/error';

const reducers = combineReducers({
	groups: groups.reducer,
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
