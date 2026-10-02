import React from "react";

export function QuantumAIIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="qai-orbit-1" x1="4" y1="6" x2="28" y2="26" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38bdf8" />
          <stop offset="0.6" stopColor="#2563eb" />
          <stop offset="1" stopColor="#60a5fa" />
        </linearGradient>
        <linearGradient id="qai-orbit-2" x1="28" y1="6" x2="4" y2="26" gradientUnits="userSpaceOnUse">
          <stop stopColor="#60a5fa" />
          <stop offset="0.5" stopColor="#0284c7" />
          <stop offset="1" stopColor="#38bdf8" />
        </linearGradient>
        <radialGradient id="qai-core" cx="16" cy="16" r="4.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" />
          <stop offset="0.4" stopColor="#38bdf8" />
          <stop offset="0.9" stopColor="#1d4ed8" />
          <stop offset="1" stopColor="#0f172a" />
        </radialGradient>
      </defs>

      {/* Outer Quantum Orbit 1 */}
      <ellipse
        cx="16"
        cy="16"
        rx="12.5"
        ry="4.6"
        transform="rotate(-32 16 16)"
        stroke="url(#qai-orbit-1)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />

      {/* Outer Quantum Orbit 2 */}
      <ellipse
        cx="16"
        cy="16"
        rx="12.5"
        ry="4.6"
        transform="rotate(32 16 16)"
        stroke="url(#qai-orbit-2)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />

      {/* Vertical Gyro Orbit */}
      <ellipse
        cx="16"
        cy="16"
        rx="12"
        ry="4.2"
        transform="rotate(90 16 16)"
        stroke="#38bdf8"
        strokeWidth="1.2"
        strokeDasharray="2 2"
        className="opacity-60"
      />

      {/* Central Superposition Core Qubit */}
      <circle cx="16" cy="16" r="4" fill="url(#qai-core)" />
      <circle cx="15.2" cy="15.2" r="1.2" fill="#ffffff" />

      {/* Orbiting Quantum Phase Nodes */}
      <circle cx="25.5" cy="10" r="1.5" fill="#38bdf8" />
      <circle cx="6.5" cy="22" r="1.5" fill="#60a5fa" />
    </svg>
  );
}
