'use client'
import { useDispatch } from 'react-redux';
import { toggleMenu } from '@/lib/generalUISlice';
import Image from "next/image";

export default function MenuButton() {
    const dispatch = useDispatch();

    const handleMenuClick = () => {
        dispatch(toggleMenu());
    }

    return (
        <>
            <button onClick={() => handleMenuClick()} className="w-10 h-10 grid place-content-center bg-white bg-opacity-0 hover:bg-opacity-25 rounded transition-all duration-300 ease-in-out">
                <Image
                    src={'/icons/navbar-icons/menu-svgrepo-com.svg'}
                    alt=""
                    width={28}
                    height={28}
                />
            </button>
        </>
    );
}