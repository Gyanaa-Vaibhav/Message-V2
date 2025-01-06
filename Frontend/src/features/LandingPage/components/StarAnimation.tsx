import React, { useEffect, useRef } from "react";
import "./StarAnimation.css";

const StarAnimation: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const starCount = 100; // Number of stars

        const createStar = () => {
            if (!containerRef.current) return;

            const star = document.createElement("div");
            star.classList.add("star");

            // Randomize size, position, and animation duration
            const size = Math.random() * 3 + 1; // 1px to 4px SIZE
            const x = Math.random() * 100; // 0% to 100% POSITION
            const y = Math.random() * 100; // 0% to 100% POSITION
            const duration = Math.random() * 2 + 1; // 1s to 3s ANIMATION DURATION

            // Apply styles
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.left = `${x}%`;
            star.style.top = `${y}%`;
            star.style.animationDuration = `${duration}s`;

            containerRef.current.appendChild(star);
        };

        for (let i = 0; i < starCount; i++) {
            createStar();
        }
        return(()=>{
        })
    }, []);

    return <div className="star-container" ref={containerRef}></div>;
};

export default StarAnimation;
