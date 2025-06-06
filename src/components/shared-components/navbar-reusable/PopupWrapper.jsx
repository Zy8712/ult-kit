'use client'
import React, { useRef, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { togglePopup, closePopup } from '@/lib/generalUISlice';

export default function PopupWrapper({ popupName, styling, children }) {

  const dispatch = useDispatch();

  const expandedPopupState = useSelector((state) => state.generalUI.expandedPopup[popupName]);
  const isPopupClosing = useSelector((state) => state.generalUI.popupClosing[popupName]);

  const popupRef = useRef(null);

  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      dispatch(togglePopup(popupName));
    }
  };

  useEffect(() => {
    if (expandedPopupState) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // When popup is closed, reset the closing state
    if (!expandedPopupState && isPopupClosing) {
      setTimeout(() => {
        dispatch(closePopup(popupName));
      }, 300); // Adjust delay as necessary
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [expandedPopupState, isPopupClosing, dispatch]);

  return (
    <div
      ref={popupRef}
      className={styling}
    >
      {children}
    </div>
  );
}
