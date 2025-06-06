
export default function CardDescription(props) {
    return (
        <>
            <p className="text-white text-sm font-theme-oxanium font-medium text-ellipsis line-clamp-3">
                {props.description}
            </p>
        </>
    );
}