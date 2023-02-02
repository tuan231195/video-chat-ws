export interface UserGroup {
	userId: string;
	connectionId: string;
	groupId: string;
	group: Group;
}
export interface Group {
	id: string;
	name: string;
}
