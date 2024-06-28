import { UserInRoomResponse } from '../apis/user-in-room/responses/user-in-room.response';

const replaceUserIdWithNameOrAttribute = (content: string, dataListUser: UserInRoomResponse[] | undefined): string => {
  let replacedContent = content;
  const regex = /<span\s+(?:[^>]*?\bdata-name=["']([^"']*?)["'])?.*?>@(\d+)<\/span>/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const userId = parseInt(match[2]);
    const userData = dataListUser?.find((user: UserInRoomResponse) => user.userId == userId);
    let replacedSpan;
    if (userData) {
      const userName = `${userData?.user?.firstName} ${userData?.user?.lastName}`;
      replacedSpan = `<span style="color:red"> @${userName}</span>`;
    } else {
      replacedSpan = `<span style="color:red"> @${match[1]}</span>`;
    }
    replacedContent = replacedContent.replace(match[0], replacedSpan);
  }
  return replacedContent;
};
export default replaceUserIdWithNameOrAttribute;
