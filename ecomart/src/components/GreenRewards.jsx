import { Star, Award, Zap } from "lucide-react";

const BADGE_DATA = {
  "Green Starter": { icon: "🌱", desc: "Earned 100 green points", color: "#4A7C59" },
  "Eco Champion": { icon: "🏆", desc: "Earned 250 green points", color: "#1E3A1E" },
  "Sustainability Streak": { icon: "🔥", desc: "3+ sustainable purchases", color: "#E65100" },
};

const TIERS = [
  { name: "Seedling", min: 0, max: 99, color: "#7BAE7F" },
  { name: "Sapling", min: 100, max: 249, color: "#4A7C59" },
  { name: "Oak", min: 250, max: 499, color: "#2C5F2D" },
  { name: "Forest", min: 500, max: Infinity, color: "#1E3A1E" },
];

export function GreenPointsBar({ points }) {
  const tier = TIERS.find(t => points >= t.min && points <= t.max) || TIERS[0];
  const nextTier = TIERS[TIERS.indexOf(tier) + 1];
  const pct = nextTier
    ? Math.min(100, ((points - tier.min) / (nextTier.min - tier.min)) * 100)
    : 100;

  return (
    <div
      className="rounded-2xl p-4 space-y-3"
      style={{ background: "white", border: "1px solid #E8F5E9" }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Star size={18} fill="#2C5F2D" color="#2C5F2D" />
          <span className="font-semibold text-sm" style={{ color: "#1E3A1E" }}>
            Green Points
          </span>
        </div>
        <span
          className="mono font-bold text-lg"
          style={{ color: tier.color }}
        >
          {points.toLocaleString()}
        </span>
      </div>

      {/* Tier badge */}
      <div className="flex items-center gap-2">
        <span
          className="text-xs font-bold px-2 py-1 rounded-full"
          style={{ background: tier.color, color: "white" }}
        >
          {tier.name}
        </span>
        {nextTier && (
          <span className="text-xs" style={{ color: "#6B7A6E" }}>
            {nextTier.min - points} pts to {nextTier.name}
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className="w-full rounded-full h-2" style={{ background: "#E8F5E9" }}>
        <div
          className="h-2 rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: tier.color }}
        />
      </div>
    </div>
  );
}

export function BadgeShelf({ badges }) {
  if (!badges.length) return null;
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#6B7A6E" }}>
        Earned Badges
      </p>
      <div className="flex flex-wrap gap-2">
        {badges.map(b => {
          const data = BADGE_DATA[b];
          if (!data) return null;
          return (
            <div
              key={b}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium reward-pop"
              style={{ background: data.color + "15", border: `1px solid ${data.color}40`, color: data.color }}
              title={data.desc}
            >
              <span>{data.icon}</span> {b}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function RewardPopup({ reward, onDismiss }) {
  if (!reward) return null;
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: "rgba(0,0,0,0.5)" }}
      onClick={onDismiss}
      role="dialog"
      aria-modal="true"
      aria-label="Reward earned"
    >
      <div
        className="reward-pop rounded-3xl p-8 max-w-sm w-full mx-4 text-center"
        style={{ background: "white", border: "4px solid #A8D5A2" }}
        onClick={e => e.stopPropagation()}
      >
        <div
          className="mx-auto mb-4 rounded-full flex items-center justify-center eco-pulse"
          style={{ width: 80, height: 80, background: "#E8F5E9" }}
        >
          <Award size={40} color="#2C5F2D" />
        </div>
        <h2 className="serif text-2xl mb-2" style={{ color: "#1E3A1E" }}>
          You earned green points!
        </h2>
        <div className="mono text-4xl font-bold my-3" style={{ color: "#2C5F2D" }}>
          +{reward.points}
        </div>
        {reward.ecoBonus > 0 && (
          <div
            className="flex items-center justify-center gap-2 text-sm rounded-lg px-4 py-2 mb-4"
            style={{ background: "#E8F5E9", color: "#2C5F2D" }}
          >
            <Zap size={14} />
            Includes <strong>+{reward.ecoBonus} bonus</strong> for eco shipping!
          </div>
        )}
        <button
          onClick={onDismiss}
          className="w-full py-3 rounded-xl font-semibold text-white"
          style={{ background: "#2C5F2D" }}
        >
          Keep Shopping 🌿
        </button>
      </div>
    </div>
  );
}
