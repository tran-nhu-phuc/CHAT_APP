import { ENDPOINT } from '../../common/endpoint';
import { ApiService } from '../api.service';
import axiosInstance from '../config.api';
import { userProfile } from './responses/user.response';

/**
 * Get user profile data.
 * @param userId - The ID of the user .
 * @returns The user profile data.
 */
const getUserProfileApi = async (userId: number): Promise<userProfile> => {
  const response = await axiosInstance.get(`${ENDPOINT.GET_PROFILE}/${userId}`);
  return response.data;
};

/**
 * Updates avatar of the user.
 * @param userId - ID of user .
 * @param avatar - The URL of user avatar image.
 * @returns link of the image.
 */

const updateAvatarApi = async (avatar: string) => {
  const response = await axiosInstance.patch(`${ENDPOINT.UPDATE_AVATAR}`, { avatar });
  return response.data;
};

/**
 * Uploads the user avatar file .
 * @param - The avatar file to be uploaded.
 * @returns The link of the image.
 */

const uploadAvatarApi = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await axiosInstance.post(ENDPOINT.UPLOAD_AVATAR, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * get token and check if user exist .
 * @returns user Data.
 */
const checkUserSignInApi = async () => {
  const response = await ApiService.GET(ENDPOINT.CHECK_LOGIN, {});
  return response?.data;
};
export { uploadAvatarApi, getUserProfileApi, updateAvatarApi, checkUserSignInApi };
