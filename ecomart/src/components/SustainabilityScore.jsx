export function SustainabilityScore({ score, size = "md" }) {
  const color =
    score >= 90 ? "#1E3A1E" :
    score >= 75 ? "#2C5F2D" :
    score >= 60 ? "#4A7C59" : "#8B6914";

  const bg =
    score >= 90 ? "#A8D5A2" :
    score >= 75 ? "#C8E6C9" :
    score >= 60 ? "#DCEDC8" : "#FFF9C4";

  const label =
    score >= 90 ? "Excellent" :
    score >= 75 ? "Good" :
    score >= 60 ? "Fair" : "Low";

  const sizes = {
    sm: { ring: 48, font: 14, label: 9 },
    md: { ring: 64, font: 18, label: 11 },
    lg: { ring: 80, font: 22, label: 12 },
  };

  const s = sizes[size];
  const circumference = 2 * Math.PI * 20;
  const offset = circumference * (1 - score / 100);

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="relative flex items-center justify-center"
        style={{ width: s.ring, height: s.ring }}
        title={`Sustainability Score: ${score}/100 — ${label}`}
      >
        <svg width={s.ring} height={s.ring} viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="20" stroke="#E8F5E9" strokeWidth="5" />
          <circle
            cx="24" cy="24" r="20"
            stroke={color}
            strokeWidth="5"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 24 24)"
            style={{ transition: "stroke-dashoffset 0.8s ease" }}
          />
        </svg>
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          <span style={{ fontSize: s.font, fontWeight: 700, color, lineHeight: 1 }}>
            {score}
          </span>
        </div>
      </div>
      <span
        className="font-semibold uppercase tracking-wider"
        style={{ fontSize: s.label, color, background: bg, padding: "2px 8px", borderRadius: 4 }}
      >
        {label}
      </span>
    </div>
  );
}

export function EcoBadge({ label }) {
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full"
      style={{ background: "#E8F5E9", color: "#1E3A1E", border: "1px solid #A8D5A2" }}
    >
      <span>🌿</span> {label}
    </span>
  );
}
