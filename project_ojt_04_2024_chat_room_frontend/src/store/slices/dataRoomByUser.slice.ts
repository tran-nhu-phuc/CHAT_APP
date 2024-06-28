import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserInRoomResponse } from '../../apis/user-in-room/responses/user-in-room.response';

export interface RoomByUserState {
  data: UserInRoomResponse[] | null;
  status: boolean;
}

const initialState: RoomByUserState = { data: null, status: false };

const roomByUserSlice = createSlice({
  name: 'roomByUser',
  initialState,
  reducers: {
    incrementChangeDataRoom(state, action: PayloadAction<UserInRoomResponse[]>) {
      return {
        data: action.payload,
        status: !state.status,
      };
    },
  },
});

export const { incrementChangeDataRoom } = roomByUserSlice.actions;
export default roomByUserSlice.reducer;
