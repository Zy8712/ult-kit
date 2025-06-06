'use client'
import { useState } from "react";

export default function CardLikeButtonV2() {

    const [isLiked, setIsLiked] = useState(false); // Tracks whether the button is toggled
    const [animationState, setAnimationState] = useState(""); // Tracks animation state

    const handleClick = () => {
        // Start the animation
        setAnimationState("scaling-down");
        setTimeout(() => {
            // Toggle the state and trigger the scaling up animation
            setIsLiked((prev) => !prev);
            setAnimationState("scaling-up");
        }, 300); // Matches the duration of the scale-down animation

        setTimeout(() => {
            // Finish the animation by returning to normal scale
            setAnimationState("");
        }, 600); // Total duration (scale-down + scale-up)
    };

    return (
        <>
            <button onClick={handleClick}
                className="absolute bottom-0 right-0 w-12 h-12">

                <img src="/icons/heart-svgrepo-com.svg" alt="" className={`w-8 h-8 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 transition-transform duration-300 ${!isLiked && animationState === "scaling-down"
                    ? "scale-50"
                    : !isLiked
                        ? "scale-100"
                        : "scale-0"
                    }`} />

                <img src="/icons/heart-filled-red-svgrepo-com.svg" alt="" className={`w-8 h-8 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 transition-transform duration-300 ${isLiked && animationState === "scaling-up"
                    ? "scale-125"
                    : isLiked
                        ? "scale-100"
                        : "scale-0"
                    }`} />

            </button>
        </>
    );
}