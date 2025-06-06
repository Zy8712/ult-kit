'use client'
import Image from "next/image";
import PopupButtonWrapper from "../navbar-reusable/PopupButtonWrapper";

export default function AccessCodeButton() {

    return (
        <>
            <PopupButtonWrapper popupName="accessCode" styling="rounded-lg bg-white bg-opacity-0 hover:bg-opacity-25 p-1">
                <Image
                    src={'/icons/navbar-icons/lock-svgrepo-com.svg'}
                    alt=""
                    height={32}
                    width={32}
                    className=""
                />
            </PopupButtonWrapper>
        </>
    );
}
