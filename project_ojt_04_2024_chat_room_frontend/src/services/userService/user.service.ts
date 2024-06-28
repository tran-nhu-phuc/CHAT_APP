import { checkUserSignInApi, getUserProfileApi, updateAvatarApi, uploadAvatarApi } from '../../apis/user';

export const userProfile = async (idUser: number) => {
  try {
    const reponse = await getUserProfileApi(idUser);
    return reponse;
  } catch (error) {
    throw error;
  }
};
export const updateAvatarService = async (avatar: string) => {
  try {
    const response = await updateAvatarApi(avatar);
    return response;
  } catch (error) {
    throw error;
  }
};
export const uploadAvatarSerivce = async (file: File) => {
  try {
    const response = await uploadAvatarApi(file);
    return response;
  } catch (error) {
    throw error;
  }
};
export const checkingUserSignInService = async () => {
  try {
    const response = await checkUserSignInApi();
    return response;
  } catch (error) {
    throw error;
  }
};
