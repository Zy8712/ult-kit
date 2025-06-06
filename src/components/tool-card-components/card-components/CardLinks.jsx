import Image from "next/image";

export default function CardLinks(props) {
    return (
        <>
            <div className="absolute -bottom-8 right-3 z-20 w-44 h-7 flex justify-between">

                <a href={props.officialLink} target="_blank" className={`${props.officialLink == "" ? 'cursor-not-allowed opacity-35' : 'hover:bg-white hover:bg-opacity-20'} w-[54px] h-7 grid place-items-center border-gray-400 border-[0.5px] border-solid rounded`}>
                    <Image
                        width={22}
                        height={22}
                        src={'/icons/tool-card-icons/web-svgrepo-com.svg'}
                        alt=""
                    />
                </a>

                <a href={props.githubLink} target="_blank" className={`${(props.githubLink == "" || props.githubLink == null) ? 'cursor-not-allowed opacity-35' : 'hover:bg-white hover:bg-opacity-20'} w-[54px] h-7 grid place-items-center border-gray-400 border-[0.5px] border-solid rounded`}>
                    <Image
                        width={20}
                        height={20}
                        src={'/icons/tool-card-icons/github-svgrepo-com.svg'}
                        alt=""
                    />
                </a>

                <a href="" target="_blank" className="cursor-not-allowed w-[54px] h-7 grid place-items-center border-gray-400 border-[0.5px] border-solid rounded opacity-35">
                    <Image
                        width={22}
                        height={22}
                        src={'/icons/tool-card-icons/info-svgrepo-com.svg'}
                        alt=""
                    />
                </a>
            </div>
        </>
    );
}