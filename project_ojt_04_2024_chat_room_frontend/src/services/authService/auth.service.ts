import { AxiosResponse } from 'axios';
import { LoginRequest } from '../../apis/auth/requests/login.request';
import { ERROR_MESSAGE } from '../../constants/error.util';
import { ErrorType } from '../../types/common.type';
import { LoginResponse } from '../../apis/auth/responses/login.response';
import { authApi } from '../../apis/auth';
import { setAccessToken } from '../../utilities/token.util';

export const validateLoginForm = (loginData: LoginRequest) => {
  const errors: ErrorType = {};

  if (loginData.email.length === 0) {
    errors.email = ERROR_MESSAGE.EMAIL_REQUIRED;
  }

  if (loginData.password.length === 0) {
    errors.password = ERROR_MESSAGE.PASSWORD_REQUIRED;
  } else if (loginData.password.length < 8 || loginData.password.length > 20) {
    errors.password = ERROR_MESSAGE.INVALID_PASSWORD_LENGTH;
  }

  return errors;
};

const loginService = async (loginData: LoginRequest) => {
  const errors = validateLoginForm(loginData);

  if (Object.keys(errors).length > 0) {
    throw errors;
  }
  try {
    const response: AxiosResponse<LoginResponse> | undefined = await authApi.loginApi(loginData);
    const accessToken = response?.headers?.authorization.split(' ')[1];

    setAccessToken(accessToken);
    return response?.data;
  } catch (error) {
    if (error?.response) {
      throw { message: error.response.data.message };
    }
    throw error;
  }
};

export const authService = { loginService };
