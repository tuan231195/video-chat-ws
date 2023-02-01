import { createContext, useContext } from 'react';

export type Session = {
	token: string;
	user: {
		id: string;
	};
};

export const SessionContext = createContext<Session>(null as any);

export const useSession = () => useContext(SessionContext);
