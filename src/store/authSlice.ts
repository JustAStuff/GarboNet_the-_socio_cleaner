import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  user: any | null;
  role: 'civilian' | 'worker' | 'admin' | null;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  role: null,
  isLoading: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<{ user: any; role: any }>) {
      state.user = action.payload.user;
      state.role = action.payload.role;
      state.isLoading = false;
    },
    logout(state) {
      state.user = null;
      state.role = null;
      state.isLoading = false;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    }
  },
});

export const { setUser, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;
