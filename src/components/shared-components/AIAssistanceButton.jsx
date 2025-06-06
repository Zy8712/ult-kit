
export default function AIAssistanceButton(){
    return(
        <>
            <button className="fixed z-50 bottom-3 right-3 w-12 h-12 bg-white bg-opacity-40 hover:bg-opacity-60 border-solid rounded-xl flex justify-center items-center text-white transition-opacity duration-300 ease-linear">
                <img src="/icons/robot-svgrepo-com.svg" alt="" className="w-8 h-8" />
            </button>
        </>
    );
}