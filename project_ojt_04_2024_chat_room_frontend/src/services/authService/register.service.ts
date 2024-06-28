import { authApi } from '../../apis/auth';
import { RegisterRequest } from '../../apis/auth/requests/register.request';
import { ERROR_MESSAGE } from '../../constants/error.util';
import { ErrorType } from '../../types/common.type';

export const validateFormData = (formData: RegisterRequest) => {
  const errors: ErrorType = {};

  // Validate email
  if (!formData.email) {
    errors.email = ERROR_MESSAGE.EMAIL_REQUIRED;
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = ERROR_MESSAGE.INVALID_EMAIL_FORMAT;
  }

  // Validate password
  if (!formData.password) {
    errors.password = ERROR_MESSAGE.PASSWORD_REQUIRED;
  } else if (formData.password.length < 8 || formData.password.length > 20) {
    errors.password = ERROR_MESSAGE.INVALID_PASSWORD_LENGTH;
  }

  // Validate confirmPassword
  if (!formData.confirmPassword) {
    errors.confirmPassword = ERROR_MESSAGE.PASSWORD_REQUIRED;
  } else if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = ERROR_MESSAGE.PASSWORD_NOT_MATCH;
  }

  // Validate firstName
  if (!formData.firstName) {
    errors.firstName = ERROR_MESSAGE.FIRST_NAME_REQUIRED;
  }

  // Validate lastName
  if (!formData.lastName) {
    errors.lastName = ERROR_MESSAGE.LAST_NAME_REQUIRED;
  }

  // Validate birthDate
  if (!formData.birthDate) {
    errors.birthDate = ERROR_MESSAGE.BIRTH_DATE_REQUIRED;
  }

  // Validate phoneNumber
  if (!formData.phone) {
    errors.phone = ERROR_MESSAGE.PHONE_NUMBER_REQUIRED;
  } else if (!/^\d{9,11}$/.test(formData.phone)) {
    errors.phone = ERROR_MESSAGE.INVALID_PHONE_NUMBER_FORMAT;
  }

  return errors;
};

const registerService = async (formData: RegisterRequest) => {
  const errors = validateFormData(formData);
  if (Object.keys(errors).length > 0) {
    throw errors;
  }
  try {
    const response = await authApi.registerApi(formData);
    return response;
  } catch (error) {
    throw error;
  }
};

export const userService = { registerService };
