export interface UserResponse {
  id?: number;
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  birthDate?: Date;
  phone?: string;
  avatar?: string;
  role?: number;
  isDelete?: number;
  createdAt?: Date;
  updatedAt?: Date;
  status?: number;
}
