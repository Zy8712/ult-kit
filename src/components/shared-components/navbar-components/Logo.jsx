export default function Logo(){
    return(
        <>
            <div className="relative w-10 h-10 bg-gradient-to-t from-purple-500 to-blue-500">
                <img src="/icons/navbar-icons/toolbox-svgrepo-com.svg" alt="" className="absolute h-10 bg-black mix-blend-darken" />
                <img src="/icons/navbar-icons/letter-u-svgrepo-com.svg" alt="" className="absolute bottom-[4.5px] left-1/2 -translate-x-1/2 z-50 h-5 bg-black mix-blend-darken rounded" />
            </div>
        </>
    );
}