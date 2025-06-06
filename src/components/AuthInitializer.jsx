// src/components/AuthInitializer.jsx
'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchCurrentUser } from '@/lib/authSlice';

export default function AuthInitializer() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  return null;
}
