'use client'
import { configureStore } from '@reduxjs/toolkit';
import generalUIReducer from '@/lib/generalUISlice';
import tagFormReducer from '@/lib/taggerFormSlice';
import tagUIReducer from '@/lib/taggerUISlice';

import authReducer from './authSlice';
import toolsReducer from './toolsSlice';
import listsReducer from './listsSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      generalUI: generalUIReducer,
      tagForm: tagFormReducer,
      tagUI: tagUIReducer,
      auth: authReducer,
      tools: toolsReducer,
      lists: listsReducer,
    }
  })
}