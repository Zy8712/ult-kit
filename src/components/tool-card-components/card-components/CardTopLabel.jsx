
export default function CardTopLabel(props) {
    return (
        <>
            {props.sponsored && (
                <div className="absolute -top-2 left-1 w-[104px] h-5 flex justify-center items-center gap-[6px] bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 rounded-md">
                    <img src="/icons/tool-card-icons/ad-announcement-megaphone-svgrepo-com.svg" alt="" className="w-[14px] h-[14px]" />
                    <span className="text-xs font-semibold uppercase text-white">Sponsored</span>
                </div>
            )}
        </>
    );
}

// bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600
// bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-600
// bg-gradient-to-r from-green-400 via-teal-500 to-blue-500
