'use client'
import React from 'react';
import { useSelector } from 'react-redux';
import Image from "next/image";
import { usePathname } from 'next/navigation';
import sidenavData from "@/data/nav-data/large-sidenav-data.json";

export default function SideNavLarge() {
    const { expandedMenu } = useSelector(state => state.generalUI);
    const pathname = usePathname();

    return (
        <>
            <nav className={`fixed top-0 ${expandedMenu ? 'left-0' : '-left-60'} z-40 w-60 h-screen text-white font-theme-orbitron text-sm font-semibold bg-black pt-16 transition-all duration-500 ease-in-out`}>
                <div className="h-full overflow-x-hidden overflow-y-auto custom-scroll">
                    {sidenavData.slice(0, 7).map((section, index) =>  (
                        <React.Fragment key={section.link || index}>
                            {index === 7 && (
                                <p className="px-4 uppercase text-base my-1">Categories</p>
                            )}
                            <a
                                href={section.link}
                                className={`h-11 flex items-center px-4 bg-white ${pathname === section.link ? 'bg-opacity-20' : 'bg-opacity-0'
                                    } rounded-xl hover:bg-opacity-25 cursor-pointer`}
                            >
                                <Image
                                    src={section.icon}
                                    alt=""
                                    height={section.height}
                                    width={section.width}
                                />
                                <span className="ml-4">{section.name}</span>
                            </a>
                            {index === 4 && (
                                <div
                                    key={`divider-${index}`}
                                    className="mx-2 my-2 h-[1px] bg-white bg-opacity-50"
                                ></div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </nav>
        </>
    );
}
