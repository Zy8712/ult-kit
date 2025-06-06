
export default function ToolCardBottomSection(props) {
    return (
        <>
            <div className="relative h-56 pt-12 pl-6 pr-2 bg-black bg-opacity-70">
                {props.children}
            </div>
        </>
    );
}