import React from 'react';

// Single Source of Truth for the SafePath Ant Logo
// Supports variants: "thin" (default for app), "bold", and "filled" (for tab icon/favicon).
const AntLogo = ({ className = "", style = {}, variant = "thin" }) => {
    let strokeW = 8;
    let smileStW = 6;
    let eyeR = 5;
    let antR = 7;
    let headFill = "transparent";
    let featureColor = "currentColor";

    // Limits line thickness so nothing overlaps
    const isBold = variant === "bold" || variant === "filled";
    if (isBold) {
        strokeW = 10;
        smileStW = 8;
        eyeR = 6;
        antR = 8;
    }

    if (variant === "filled") {
        headFill = "currentColor"; // Fills the background red (or current inherit color)
        featureColor = "#ffffff";  // Makes face features white so they are visible
    }

    return (
        <svg
            viewBox="0 0 100 100"
            className={className}
            style={style}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g transform="translate(50, 75)">
                {/* Antennae */}
                <path d="M -15 -48 Q -30 -75 -15 -85" stroke="currentColor" strokeWidth={strokeW} strokeLinecap="round" />
                <circle cx="-15" cy="-85" r={antR} fill="currentColor" />

                <path d="M 15 -48 Q 30 -75 15 -85" stroke="currentColor" strokeWidth={strokeW} strokeLinecap="round" />
                <circle cx="15" cy="-85" r={antR} fill="currentColor" />

                {/* Head Outline */}
                <path d="M -40 -5 C -45 -55 45 -55 40 -5 C 38 25 -38 25 -40 -5 Z" fill={headFill} stroke="currentColor" strokeWidth={strokeW} strokeLinejoin="round" />

                {/* Eyes */}
                <circle cx="-16" cy="-12" r={eyeR} fill={featureColor} />
                <circle cx="16" cy="-12" r={eyeR} fill={featureColor} />

                {/* Smile */}
                <path d="M -16 2 Q 0 16 16 2" stroke={featureColor} strokeWidth={smileStW} strokeLinecap="round" fill="none" />
            </g>
        </svg>
    );
};

export default AntLogo;
