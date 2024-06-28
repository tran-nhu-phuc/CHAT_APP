import { configureStore } from '@reduxjs/toolkit';
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';
import dataLoginSlice from './slices/dataLogin.silce';
import messageEventSlice from './slices/messageEvent.slice';
import notificationSlice from './slices/newNotification.slice';
import roomSlice from './slices/room.slice';
import dataRoomByUserSlice from './slices/dataRoomByUser.slice';
import dataCreateRoom from './slices/DataCreateRoom.slice';
import checkJoinOutRoom from './slices/checkJoniRoom.slice';
import updateListRoom from './slices/updateListRoom.slice';
import checkUpdateAvatarSlice from './slices/checkUpdateAvatar.slice';

const store: ToolkitStore = configureStore({
  reducer: {
    notificationSlice,
    messageEventSlice,
    dataLoginSlice,
    roomSlice,
    dataRoomByUserSlice,
    dataCreateRoom,
    checkJoinOutRoom,
    updateListRoom,
    checkUpdateAvatarSlice,
  },
});

export type AppDispatch = typeof store.dispatch;
export type AppState = ReturnType<typeof store.getState>;
export default store;
