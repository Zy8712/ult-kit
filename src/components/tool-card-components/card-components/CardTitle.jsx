
export default function CardTitle(props) {
    return (
        <>
            <span className="text-white font-theme-oxanium font-semibold text-xl leading-5 text-ellipsis line-clamp-1">
                {props.name}
            </span>
        </>
    );
}