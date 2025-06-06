'use client'
import Image from "next/image";
import PopupButtonWrapper from "../navbar-reusable/PopupButtonWrapper";

export default function QuickAccessButton() {

    return (
        <>
            <PopupButtonWrapper popupName="quickAccess" styling="rounded-lg bg-white bg-opacity-0 hover:bg-opacity-25 p-1">
                <Image
                    src={'/icons/navbar-icons/grid-svgrepo-com.svg'}
                    alt=""
                    height={32}
                    width={32}
                    className=""
                />
            </PopupButtonWrapper>
        </>
    );
}
