'use client';
import { useSelector, useDispatch } from 'react-redux';
import { togglePopup } from '@/lib/generalUISlice';

export default function PopupButtonWrapper({ popupName, styling, children }) {
  const dispatch = useDispatch();

  const isPopupClosing = useSelector((state) => state.generalUI.popupClosing[popupName]);

  const handleButtonClick = (event) => {
    event.stopPropagation(); // Prevent triggering the outside click handler
    console.log("Popup Button Clicked:", popupName, "isPopupClosing:", isPopupClosing);

    // Only toggle the popup if it's not in the process of closing
    if (!isPopupClosing) {
      dispatch(togglePopup(popupName));
    }
  }

  return (
    <button onClick={handleButtonClick} className={styling}>
      {children}
    </button>
  );
}
