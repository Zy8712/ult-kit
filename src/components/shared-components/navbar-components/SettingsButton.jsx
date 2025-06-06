'use client'
import Image from "next/image";
import PopupButtonWrapper from "../navbar-reusable/PopupButtonWrapper";

export default function SettingsButton() {

    return (
        <>
            <PopupButtonWrapper popupName="settings" styling="rounded-lg bg-white bg-opacity-0 hover:bg-opacity-25 p-1">
                <Image
                    src={'/icons/general-icons-secondary/gear-svgrepo-com.svg'}
                    alt=""
                    height={32}
                    width={32}
                    className=""
                />
            </PopupButtonWrapper>
        </>
    );
}
