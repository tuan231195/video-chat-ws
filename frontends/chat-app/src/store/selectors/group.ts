import { useAppSelector } from 'src/store/store';

export const useSelectedGroup = () =>
	useAppSelector((store) => store.groups.items.find((item) => item.groupId === store.groups.selectedGroupId));
