import { useRef, useState } from 'react';

export const useCurrent = <T>(value: T) => {
	const ref = useRef<T>(value);
	ref.current = value;
	return ref;
};

export function useForceUpdate() {
	const [, setValue] = useState(0);
	return () => setValue((value) => value + 1);
}
