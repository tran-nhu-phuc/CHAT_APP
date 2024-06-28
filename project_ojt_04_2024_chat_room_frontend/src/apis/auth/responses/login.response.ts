export interface LoginResponse {
  id: number;
  email: string;
  role: number;
  password: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  phone: number;
  birthDate: string;
}
