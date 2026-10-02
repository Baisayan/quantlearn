import React from "react";
import Link from "next/link";

interface BrandLogoProps {
  className?: string;
  showBadge?: boolean;
  href?: string;
}

export function QuantumSymbol({ className = "size-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="ql-grad-1" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8b5cf6" />
          <stop offset="0.5" stopColor="#a855f7" />
          <stop offset="1" stopColor="#06b6d4" />
        </linearGradient>
        <linearGradient id="ql-grad-2" x1="28" y1="4" x2="4" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#06b6d4" />
          <stop offset="0.6" stopColor="#8b5cf6" />
          <stop offset="1" stopColor="#ec4899" />
        </linearGradient>
        <linearGradient id="ql-grad-3" x1="16" y1="4" x2="16" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#c084fc" />
          <stop offset="1" stopColor="#38bdf8" />
        </linearGradient>
        <radialGradient id="ql-core" cx="16" cy="16" r="4" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" />
          <stop offset="0.4" stopColor="#a855f7" />
          <stop offset="1" stopColor="#6366f1" />
        </radialGradient>
      </defs>

      {/* Orbit 1: Tilted -30 deg */}
      <ellipse
        cx="16"
        cy="16"
        rx="12.5"
        ry="4.8"
        transform="rotate(-35 16 16)"
        stroke="url(#ql-grad-1)"
        strokeWidth="1.6"
        strokeLinecap="round"
        className="opacity-90"
      />

      {/* Orbit 2: Tilted +35 deg */}
      <ellipse
        cx="16"
        cy="16"
        rx="12.5"
        ry="4.8"
        transform="rotate(35 16 16)"
        stroke="url(#ql-grad-2)"
        strokeWidth="1.6"
        strokeLinecap="round"
        className="opacity-90"
      />

      {/* Orbit 3: Vertical 90 deg */}
      <ellipse
        cx="16"
        cy="16"
        rx="12.5"
        ry="4.8"
        transform="rotate(90 16 16)"
        stroke="url(#ql-grad-3)"
        strokeWidth="1.5"
        strokeDasharray="2 1.5"
        className="opacity-60"
      />

      {/* Quantum Superposition Core Node */}
      <circle cx="16" cy="16" r="3.6" fill="url(#ql-core)" />
      <circle cx="15.2" cy="15.2" r="1.1" fill="#ffffff" className="opacity-95" />

      {/* Orbiting State Phase Dots |0> & |1> */}
      <circle cx="25.5" cy="10" r="1.4" fill="#38bdf8" className="animate-pulse" />
      <circle cx="6.5" cy="22" r="1.4" fill="#ec4899" />
      <circle cx="16" cy="3.5" r="1.2" fill="#c084fc" />
    </svg>
  );
}

export function BrandLogo({ className = "", showBadge = true, href = "/" }: BrandLogoProps) {
  const content = (
    <div className={`group flex items-center gap-2.5 transition-opacity hover:opacity-95 ${className}`}>
      {/* Icon Badge */}
      <div className="relative flex size-9 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-gradient-to-tr from-primary/15 via-violet-500/10 to-cyan-500/10 p-1 shadow-xs transition-all duration-300 group-hover:scale-105 group-hover:border-primary/50 group-hover:shadow-[0_0_16px_rgba(124,58,237,0.3)]">
        <QuantumSymbol className="size-6" />
      </div>

      {/* Typography */}
      <div className="flex items-center">
        <span className="font-display text-xl font-bold tracking-tight text-foreground">
          Quant<span className="bg-gradient-to-r from-primary via-violet-500 to-cyan-500 bg-clip-text text-transparent">Learn</span>
        </span>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-4 rounded-lg"
      >
        {content}
      </Link>
    );
  }

  return content;
}
