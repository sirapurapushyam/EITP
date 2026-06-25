import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: { sidebarOpen: false, theme: 'system' },
  reducers: {
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebar(state, action) {
      state.sidebarOpen = action.payload;
    }
  }
});

export const { toggleSidebar, setSidebar } = uiSlice.actions;
export default uiSlice.reducer;
