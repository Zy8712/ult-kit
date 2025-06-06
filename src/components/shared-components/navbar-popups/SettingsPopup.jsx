'use client';
import PopupWrapper from "../navbar-reusable/PopupWrapper";
import { useSelector } from "react-redux";

export default function SettingsPopup() {
    const expandedPopupState = useSelector((state) => state.generalUI.expandedPopup.settings);

    return (
        <PopupWrapper
            popupName="settings"
            styling={`absolute top-[100%] right-1 z-50 mt-1 w-96 h-[400px] ${expandedPopupState ? 'flex' : 'hidden'} bg-black bg-opacity-75 border-white border-2 border-solid rounded-2xl overflow-hidden`}
        >
            {/* Popup content goes here */}
        </PopupWrapper>
    );
}
