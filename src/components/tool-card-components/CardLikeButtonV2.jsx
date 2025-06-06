'use client'
import { useState, useEffect } from "react";
import Image from "next/image";

export default function CardLikeButtonV2({ isInitiallyLiked, onToggleLike, isAuthenticated }) {
    const [isLiked, setIsLiked] = useState(isInitiallyLiked);
    const [animationState, setAnimationState] = useState("");

    // Sync with external changes (e.g., Redux update)
    useEffect(() => {
        setIsLiked(isInitiallyLiked);
    }, [isInitiallyLiked]);

    const handleClick = (e) => {
        e.stopPropagation();

        if (!isAuthenticated) {
            console.log("User not authenticated, like action prevented.");
            return;
        }

        // Start scale down animation
        setAnimationState("scaling-down");

        setTimeout(() => {
            // Optimistically toggle like for instant feedback
            setIsLiked((prev) => !prev);
            onToggleLike(); // Redux or DB update
            setAnimationState("scaling-up");
        }, 300);

        setTimeout(() => {
            setAnimationState("");
        }, 600);
    };

    return (
        <button
            onClick={handleClick}
            className="absolute bottom-0 right-0 w-12 h-12 z-20"
            title={isAuthenticated ? (isLiked ? "Unlike" : "Like") : "Sign in to like"}
        >
            {/* Empty heart icon */}
            <Image
                src="/icons/heart-svgrepo-com.svg"
                alt="Like icon"
                width={32}
                height={32}
                className={`absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 transition-transform duration-300 ${
                    !isLiked && animationState === "scaling-down"
                        ? "scale-50"
                        : !isLiked
                        ? "scale-100"
                        : "scale-0"
                }`}
            />

            {/* Filled heart icon */}
            <Image
                src="/icons/heart-filled-red-svgrepo-com.svg"
                alt="Liked icon"
                width={32}
                height={32}
                className={`absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 transition-transform duration-300 ${
                    isLiked && animationState === "scaling-up"
                        ? "scale-125"
                        : isLiked
                        ? "scale-100"
                        : "scale-0"
                }`}
            />
        </button>
    );
}
