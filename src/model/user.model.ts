export enum UserRole {
  ADMIN = "ADMIN",
  CUSTOMER = "CUSTOMER",
}

export interface UserProps {
  id: number;
  username: string;
  email: string;
  role: UserRole;
}

export class User implements UserProps {
  constructor(
    public id: number,
    public username: string,
    public email: string,
    public role: UserRole,
  ) {}
}
