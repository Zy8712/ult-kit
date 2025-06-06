'use client';
import PopupWrapper from "../navbar-reusable/PopupWrapper";
import { useSelector } from "react-redux";

export default function FocusModePopup(){
    const expandedPopupState = useSelector((state) => state.generalUI.expandedPopup.focusView);

    return (
        <PopupWrapper
            popupName="focusView"
            styling={`absolute top-[100%] right-1 z-50 mt-1 w-96 h-40 ${expandedPopupState ? 'flex' : 'hidden'} bg-black bg-opacity-75 border-white border-2 border-solid rounded-2xl overflow-hidden`}
        >
            {/* Popup content goes here */}
        </PopupWrapper>
    );
}