import { createContext, useContext } from 'react';
import { User } from 'src/types/user';

export type Session = {
	token: string;
	user: User;
};

export const SessionContext = createContext<Session>(null as any);

export const useSession = () => useContext(SessionContext);
