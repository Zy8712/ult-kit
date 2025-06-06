'use client'
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    previewPanelOpen: false,
    uploadPanelOpen: false,
    pastePanelOpen: false,
};

const taggerUISlice = createSlice({
    name: 'tagger ui',
    initialState,
    reducers: {
        togglePreviewPanel(state) {
            state.previewPanelOpen = !state.previewPanelOpen;
        },
        toggleUploadPanel(state) {
            state.uploadPanelOpen = !state.uploadPanelOpen;
        },
        togglePastePanel(state) {
            state.pastePanelOpen = !state.pastePanelOpen;
        },
    },
});

export const {
    togglePreviewPanel,
    toggleUploadPanel,
    togglePastePanel,
} = taggerUISlice.actions;

export default taggerUISlice.reducer;