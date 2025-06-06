import { LogoBox, MenuButton } from "@/utils/navbarComponents";

export default function NavbarLeftBox(){
    return(
        <>
            <div className="w-full max-w-96 h-full flex items-center">
                <MenuButton />
                <LogoBox />
            </div>
        </>
    );
}