import { AxiosResponse } from 'axios';
import { LoginRequest } from './requests/login.request';
import { LoginResponse } from './responses/login.response';
import { RegisterRequest } from './requests/register.request';
import { ApiService } from '../api.service';
import { ENDPOINT } from '../../common/endpoint';

const loginApi = async (requestBody: LoginRequest): Promise<AxiosResponse<LoginResponse> | undefined> => {
  return await ApiService.POST(ENDPOINT.LOGIN, requestBody, {});
};

const registerApi = async (requestBody: RegisterRequest): Promise<void> => {
  await ApiService.POST(ENDPOINT.REGISTER, requestBody, {});
};

export const authApi = { loginApi, registerApi };
