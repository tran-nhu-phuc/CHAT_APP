import { createSlice } from '@reduxjs/toolkit';
import { AppState } from '..';

interface AvatarState {
  avatarUrl: string | null;
}

const initialState: AvatarState = {
  avatarUrl: null,
};

const updateAvatarSlice = createSlice({
  name: 'updateAvatar',
  initialState,
  reducers: {
    checkUpdateAvatar(state, action) {
      state.avatarUrl = action.payload;
    },
  },
});

export default updateAvatarSlice.reducer;

export const { checkUpdateAvatar } = updateAvatarSlice.actions;

export const selectAvatarUrl = (state: AppState) => state.checkUpdateAvatarSlice.avatarUrl;
console.log(selectAvatarUrl);
