// main focus drop down menu will reduce the number of tools and categories shown to reduce distractions
// focus options: All, Study General, Study Programming, Travel, Life, Relexation
// depending on the mode selected the navbar will have a moving glowing animation effect of different colors
'use client'
import Image from "next/image";
import PopupButtonWrapper from "../navbar-reusable/PopupButtonWrapper";

export default function FocusModeButton() {

    return (
        <>
            <PopupButtonWrapper popupName="focusView" styling="rounded-lg bg-white bg-opacity-0 hover:bg-opacity-25 p-1">
                <Image
                    src={'/icons/navbar-icons/eye-svgrepo-com.svg'}
                    alt=""
                    height={30}
                    width={30}
                    className=""
                />
            </PopupButtonWrapper>
        </>
    );
}
