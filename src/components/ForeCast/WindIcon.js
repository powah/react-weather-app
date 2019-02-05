import React from 'react';

export default function WindIcon({ deg, ...rest }) {
    // SVG icon originally is at 45 degrees and meteorological degree starts from 90 degrees (facing north)
    // so starting icon position is adjust by subtracting 45
    return (
        <svg {...rest} viewBox="0 0 50 50">
            <path d="m24 40v-14h-14l26-12z" transform={`rotate(${deg - 45} 25 25)`} />
            <circle
                cx="25"
                cy="25"
                fill="none"
                r="22"
                stroke="#000"
                strokeLinecap="round"
                strokeMiterlimit="10"
                strokeWidth="2"
            />
        </svg>
    );
}
