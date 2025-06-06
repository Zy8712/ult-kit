import Image from "next/image";

export default function CardLogo(props) {

    const formattedString = props.name.replace(/\s+/g, "-").replace(/['"<>:/\\|?*]/g, "").toLowerCase();
    const link = "/tool-sites-images/"+formattedString+"/"+props.logoUrl;

    return (
        <>
            <div className="absolute left-6 -bottom-8 z-20 w-20 h-20 grid place-items-center bg-black backdrop-blur-sm bg-opacity-5 border-gray-400 border-[1px] border-solid rounded-xl">

                {props.logoUrl != "" ? (
                    <>
                        <Image
                            src={link}
                            alt=""
                            width={56}
                            height={56}
                            className="rounded-lg"
                        />
                    </>
                ) : (
                    <>
                    </>
                )}

                <div className="absolute -bottom-[12px] left-1/2 -translate-x-1/2 w-full h-5 flex justify-center items-center gap-x-1">

                    {props.featured && (
                        <div className="w-5 h-5 grid place-items-center bg-gradient-to-tl from-indigo-400 via-purple-300 to-pink-400 rounded-full">
                            <img src="/icons/general-icons-primary/stars-whitesparkle-svgrepo-com.svg" alt="" className="w-4 h-4" />
                        </div>
                    )}

                    {props.trending && (
                        <div className="w-5 h-5 grid place-items-center bg-gradient-to-r from-red-600 via-amber-500 to-yellow-300 rounded-full">
                            <img src="/icons/general-icons-primary/fire-svgrepo-com.svg" alt="" className="w-4 h-4" />
                        </div>
                    )}

                    {props.gatekeep && (
                        <div className="w-5 h-5 grid place-items-center bg-gradient-to-r from-teal-400 via-cyan-500 to-blue-700 rounded-full">
                            <img src="/icons/navbar-icons/lock-svgrepo-com.svg" alt="" className="w-4 h-4" />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}