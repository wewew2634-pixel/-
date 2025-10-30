import React from "react";

export default function Logo({
  size = "xl",
  label = "ZZMUK",
}: { size?: "sm" | "md" | "lg" | "xl"; label?: string }) {
  const s = { sm: "w-10 h-10", md: "w-14 h-14", lg: "w-20 h-20", xl: "w-24 h-24" }[size];
  return (
    <div role="img" aria-label={`${label} logo`} className={`relative ${s} select-none`}>
      <svg viewBox="0 0 100 100" className="block" aria-hidden>
        <defs>
          <radialGradient id="b" cx="50%" cy="40%" r="65%">
            <stop offset="0%" stopColor="#10B981" stopOpacity=".9" />
            <stop offset="100%" stopColor="#059669" stopOpacity=".35" />
          </radialGradient>
          <linearGradient id="e" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity=".25" />
            <stop offset="1" stopColor="#fff" stopOpacity=".05" />
          </linearGradient>
        </defs>
        <path d="M50 2C66 20 80 40 80 58c0 20-15 36-30 40C35 94 20 78 20 58c0-18 14-38 30-56Z" fill="url(#b)" />
        <path d="M50 2C66 20 80 40 80 58c0 20-15 36-30 40C35 94 20 78 20 58c0-18 14-38 30-56Z" fill="none" stroke="url(#e)" strokeWidth="1.2" />
        <text x="50" y="66" textAnchor="middle" fontWeight="700" fontSize="22" fill="#ffffff">Z</text>
      </svg>
      <div className="pointer-events-none absolute inset-0 rounded-[22%] backdrop-blur-xl saturate-150 border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]" />
    </div>
  );
}
