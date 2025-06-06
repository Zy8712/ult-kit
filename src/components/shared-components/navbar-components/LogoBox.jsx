import { Logo, Title } from "@/utils/navbarComponents";

export default function LogoBox(){
    return(
        <>
            <a className="ml-5 flex items-center" href="/">
                <Logo />
                <Title />
            </a>
        </>
    );
}