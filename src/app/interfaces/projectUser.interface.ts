import { ProjectUserRole } from './types/projectUserRole.type';

export interface ProjectUser {
	id: number;
	role: ProjectUserRole;
	user: {
		isSelf?: boolean;
		id: number;
		email: string;
		username: string;
		firstname: string;
		lastname: string;
	};
}
