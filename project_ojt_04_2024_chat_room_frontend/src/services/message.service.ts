import { messageApi } from '../apis/messages';
import { MessageResponse } from '../apis/messages/responses/message.response';

const findMessageByRoom = async (endpoint: string): Promise<MessageResponse[]> => {
  try {
    const dataListMessage = await messageApi.listMessageByRoom({
      url: endpoint,
    });
    return dataListMessage?.data?.reverse();
  } catch (error) {
    throw error;
  }
};

export const messageServices = {
  findMessageByRoom,
};
