'use client'
import { Logo, Title } from '@/utils/navbarComponents';
import { useSelector } from 'react-redux';

export default function Footer() {

    const { expandedMenu } = useSelector(state => state.generalUI);

    return (
        <>
            <div className={`${expandedMenu ? 'pl-60' : 'pl-14'} transition-all duration-300 ease-in-out`}>
                <footer className={`h-20 flex flex-col items-center bg-black`}>
                    <div className="flex">
                        <Logo />
                        <Title />
                    </div>
                    <div className="mt-3 text-xs leading-3 text-white font-semibold font-theme-orbitron">
                        Site Designed & Coded By:&nbsp;
                        <a href="https://github.com/Zy8712" target="_blank" className="underline underline-offset-1 text-blue-500 hover:text-purple-500">
                            Bryan Li
                        </a>
                        .
                    </div>
                </footer>
            </div>
        </>
    );
}