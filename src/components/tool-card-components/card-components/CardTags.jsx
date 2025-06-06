
export default function CardTags(props) {
    return (
        <>
            <div className="mt-2 flex gap-1 overflow-y-hidden overflow-x-auto custom-scroll-2">
                {props.tags.map((tag, index) => (
                    <a key={index} className="h-5 min-w-fit grid place-items-center text-[12px] text-white uppercase font-medium bg-white bg-opacity-20 rounded-sm px-[6px] hover:bg-opacity-35 hover:cursor-pointer whitespace-nowrap">
                        {tag}
                    </a>
                ))}
            </div>
        </>
    );
}