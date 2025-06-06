import Image from "next/image";

export default function CardPreview(props) {

    const formattedString = props.name.replace(/\s+/g, "-").replace(/['"<>:/\\|?*]/g, "").toLowerCase();
    const link = "/tool-sites-images/"+formattedString+"/site-preview-1920x1920.jpeg";

    return (
        <>
            <Image
                src={link}
                alt=""
                width={320}
                height={320}
                className="-z-10 absolute top-0 left-0"
            />
        </>
    );
}