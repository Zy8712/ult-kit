'use client'
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Sidenav expanded settings
  expandedMenu: true,

  // Navbar popup settings
  expandedPopup: {
    settings: false,
    accessCode: false,
    quickAccess: false,
    focusView: false,
  },
  popupClosing: {
    settings: false,
    accessCode: false,
    quickAccess: false,
    focusView: false,
  },

};

const generalUISlice = createSlice({
  name: 'general ui',
  initialState,
  reducers: {

    toggleMenu(state) {
      state.expandedMenu = !state.expandedMenu;
    },

    togglePopup(state, action) {
      // If popup is open, set it to closing state
      const popupName = action.payload;
      console.log("Toggling Popup:", popupName); // Debugging line
      if (state.expandedPopup[popupName]) {
        state.popupClosing[popupName] = true;
      } else {
        state.popupClosing[popupName] = false;
      }
      state.expandedPopup[popupName] = !state.expandedPopup[popupName];
    },
    closePopup(state, action) {
      console.log('close popup called');
      const popupName = action.payload;
      console.log(`Closing Popup: ${popupName}`);
      state.expandedPopup[popupName] = false;
      state.popupClosing[popupName] = false; // Reset closing state when closed
    },

  },
});

export const {
  toggleMenu,
  togglePopup,
  closePopup,
} = generalUISlice.actions;

export default generalUISlice.reducer;