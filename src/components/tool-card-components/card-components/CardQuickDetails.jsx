import Image from "next/image";

export default function CardQuickDetails(props) {

    const pricingColors = ["bg-[#28A745]", "bg-[#007BFF]", "bg-[#d4af37]"];
    const pricingColor = pricingColors[props.pricing];

    const downloadColors = ["bg-[#0056B3]", "bg-[#6C757D]", "bg-[#20C997]"];
    const downloadColor = downloadColors[props.downloadable];

    const activeColors = ["bg-[#6C757D]", "bg-[#FFC107]", "bg-[#28A745]"];
    const activeColor = activeColors[props.status];

    return (
        <>
            <p className="my-3 flex items-center text-white font-semibold text-xs leading-[14px]">
                <span className="flex gap-[2px] bg-gradient-to-tr from-purple-400 to-blue-400 px-1 rounded-sm text-center">
                    <Image
                        width={12}
                        height={12}
                        src={'/icons/tool-card-icons/star-filled-svgrepo-com.svg'}
                        alt=""
                    />
                    {props.bliRate}/5
                </span>
                &nbsp;
                <span className={`flex gap-[1px] ${pricingColor} pl-[2px] pr-1 rounded-sm text-center`}>
                    <Image
                        width={14}
                        height={14}
                        src={'/icons/tool-card-icons/dollar-sign-svgrepo-com.svg'}
                        alt=""
                    />
                    {
                        props.pricing === 0
                            ? "Free"
                            : props.pricing === 1
                                ? "Freemium"
                                : "Premium"
                    }
                </span>
                &nbsp;
                <span className={`flex gap-[3px] ${downloadColor} px-1 rounded-sm text-center`}>
                    <Image
                        width={11}
                        height={11}
                        src={'/icons/tool-card-icons/download-cloud-svgrepo-com.svg'}
                        alt=""
                    />
                    {
                        props.downloadable === 0
                            ? "Web App"
                            : props.downloadable === 1
                                ? "On/Offline"
                                : "Desktop"
                    }
                </span>
                &nbsp;
                <span className={`flex gap-[2px] ${activeColor} pl-[2px] pr-1 rounded-sm text-center`}>
                    <Image
                        width={14}
                        height={14}
                        src={'/icons/tool-card-icons/update-svgrepo-com.svg'}
                        alt=""
                    />
                    {
                        props.status === 0
                            ? "Legacy"
                            : props.status === 1
                                ? "Stable"
                                : "Active"
                    }
                </span>
            </p>
        </>
    );
}