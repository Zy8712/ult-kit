
export default function ToolCategoryPageHeader(props) {
    return (
        <>
            <div className="flex justify-center border-white border-2 border-solid mb-8">
                <h1 className="text-8xl font-semibold uppercase font-theme-orbitron bg-gradient-to-t from-purple-500 to-blue-500 text-transparent bg-clip-text">
                    {props.children}
                </h1>
            </div>
        </>
    );
}