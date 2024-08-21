export interface User {
	id?: number;
	email: string;
	username: string;
	firstname: string;
	lastname: string;
	blocked?: boolean;
	public?: boolean;
}
