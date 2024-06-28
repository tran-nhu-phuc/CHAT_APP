import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RoomState {
  rooms: Record<number, number[]>;
}

const initialState: RoomState = {
  rooms: {},
};

const roomSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    joinRoom(state, action: PayloadAction<{ roomId: number; userId: number }>) {
      const { roomId, userId } = action.payload;
      if (state.rooms[roomId]) {
        state.rooms[roomId].push(userId);
      } else {
        state.rooms[roomId] = [userId];
      }
    },
    leaveRoom(state, action: PayloadAction<{ roomId: number; userId: number }>) {
      const { roomId, userId } = action.payload;
      if (state.rooms[roomId]) {
        state.rooms[roomId] = state.rooms[roomId].filter((id) => id !== userId);
        if (state.rooms[roomId].length === 0) {
          delete state.rooms[roomId];
        }
      }
    },
  },
});

export const { joinRoom, leaveRoom } = roomSlice.actions;
export default roomSlice.reducer;
