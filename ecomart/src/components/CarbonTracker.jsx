import { Leaf, TrendingDown, Wind } from "lucide-react";

function carbonEquivalent(kg) {
  if (kg < 1) return `${(kg * 1000).toFixed(0)}g CO₂`;
  return `${kg.toFixed(2)} kg CO₂`;
}

function driveKm(kg) {
  // average car emits ~0.21 kg CO₂/km
  return (kg / 0.21).toFixed(1);
}

export function CarbonBadge({ carbonKg, size = "md" }) {
  const isLow = carbonKg < 0.5;
  return (
    <div
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1"
      style={{
        background: isLow ? "#E8F5E9" : "#FFF3E0",
        border: `1px solid ${isLow ? "#A8D5A2" : "#FFCC80"}`,
        color: isLow ? "#1E3A1E" : "#E65100",
      }}
    >
      <Wind size={size === "sm" ? 12 : 14} />
      <span className="mono font-medium text-xs">{carbonEquivalent(carbonKg)}</span>
    </div>
  );
}

export function CartCarbonSummary({ cartCarbon, shipping }) {
  const baselineCarbon = cartCarbon - shipping.carbonKg + 0.82; // standard shipping baseline
  const saved = Math.max(0, baselineCarbon - cartCarbon);
  const pct = Math.min(100, Math.round((saved / baselineCarbon) * 100));

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: "1px solid #A8D5A2", background: "white" }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{ background: "#1E3A1E", color: "white" }}
      >
        <Leaf size={18} />
        <span className="font-semibold text-sm">Carbon Footprint</span>
      </div>

      <div className="px-4 py-4 space-y-3">
        {/* This order */}
        <div className="flex items-center justify-between text-sm">
          <span style={{ color: "#6B7A6E" }}>This order</span>
          <span className="mono font-semibold" style={{ color: "#1E3A1E" }}>
            {carbonEquivalent(cartCarbon)}
          </span>
        </div>

        {/* vs baseline */}
        {saved > 0 && (
          <>
            <div className="flex items-center justify-between text-sm">
              <span style={{ color: "#6B7A6E" }}>vs. standard shipping</span>
              <span className="mono font-semibold text-green-700">
                −{carbonEquivalent(saved)}
              </span>
            </div>

            {/* Progress bar */}
            <div>
              <div
                className="w-full rounded-full h-2"
                style={{ background: "#E8F5E9" }}
              >
                <div
                  className="h-2 rounded-full"
                  style={{
                    width: `${100 - pct}%`,
                    background: "linear-gradient(90deg, #2C5F2D, #4A7C59)",
                    transition: "width 0.8s ease",
                  }}
                />
              </div>
              <p className="text-xs mt-1" style={{ color: "#4A7C59" }}>
                {pct}% lower carbon than standard delivery
              </p>
            </div>

            {/* Equivalent */}
            <div
              className="flex items-center gap-2 text-xs rounded-lg px-3 py-2"
              style={{ background: "#F4F7F0", color: "#2C5F2D" }}
            >
              <TrendingDown size={14} />
              <span>
                Equivalent to not driving <strong>{driveKm(saved)} km</strong> by car.
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function TotalCarbonSavedWidget({ totalKg }) {
  const trees = (totalKg / 21).toFixed(2); // a tree absorbs ~21kg/year
  return (
    <div
      className="rounded-2xl px-5 py-4 flex items-center gap-4"
      style={{ background: "linear-gradient(135deg, #1E3A1E 0%, #2C5F2D 100%)", color: "white" }}
    >
      <div
        className="rounded-full flex items-center justify-center flex-shrink-0"
        style={{ width: 52, height: 52, background: "rgba(168,213,162,0.2)" }}
      >
        <Leaf size={26} color="#A8D5A2" />
      </div>
      <div>
        <p className="text-xs font-medium" style={{ color: "#A8D5A2" }}>
          Total Carbon Saved
        </p>
        <p className="mono text-2xl font-bold" style={{ color: "#A8D5A2" }}>
          {carbonEquivalent(totalKg)}
        </p>
        <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.6)" }}>
          ≈ {trees} tree-years of absorption
        </p>
      </div>
    </div>
  );
}
