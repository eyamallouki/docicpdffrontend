export interface User {
    id: number;
    username: string;
    email: string;
    role: Role;
    is_verified: boolean;
    is_active: boolean;
    is_staff: boolean;
    created_at: string; 
    updated_at: string; 
    token:string;
  }

  export interface UserManager {
    create_user(username: string, email: string, role: Role, password: string): User;
    create_superuser(username: string, email: string, password: string): User;
  }
  
  export enum Role {
    PATIENT = 'PAT',
    ADMINISTRATEUR = 'ADM'
  }

 
  
 