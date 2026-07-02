import { Link } from "react-router-dom";
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell,
} from "recharts";
import { Leaf, Star, Award, ShoppingBag, TrendingDown } from "lucide-react";
import { useApp } from "../context/AppContext";
import { TotalCarbonSavedWidget } from "../components/CarbonTracker";
import { GreenPointsBar, BadgeShelf } from "../components/GreenRewards";
import { products } from "../data/products";

const TIER_DATA = [
  { name: "Seedling", min: 0, max: 99 },
  { name: "Sapling", min: 100, max: 249 },
  { name: "Oak", min: 250, max: 499 },
  { name: "Forest", min: 500, max: Infinity },
];

function StatCard({ icon, value, label, sub, accent }) {
  return (
    <div
      className="rounded-2xl p-5 flex items-start gap-4"
      style={{ background: "white", border: "1px solid #E8F5E9" }}
    >
      <div
        className="rounded-full flex items-center justify-center flex-shrink-0"
        style={{ width: 48, height: 48, background: accent + "18" }}
      >
        {icon}
      </div>
      <div>
        <p className="mono text-2xl font-bold" style={{ color: accent }}>{value}</p>
        <p className="font-semibold text-sm" style={{ color: "#1A1A1A" }}>{label}</p>
        {sub && <p className="text-xs mt-0.5" style={{ color: "#6B7A6E" }}>{sub}</p>}
      </div>
    </div>
  );
}

// Mock session data for charts (in a real app, stored per-session)
const sessionData = [
  { session: "Sess 1", points: 0, carbon: 0 },
  { session: "Sess 2", points: 85, carbon: 0.77 },
  { session: "Sess 3", points: 130, carbon: 1.2 },
  { session: "Sess 4", points: 200, carbon: 1.55 },
];

const radarData = [
  { metric: "Eco Score", value: 91 },
  { metric: "Carbon Savings", value: 78 },
  { metric: "Shipping Choice", value: 95 },
  { metric: "Points Earned", value: 65 },
  { metric: "Badge Progress", value: 50 },
];

export default function DashboardPage() {
  const { state } = useApp();
  const { greenPoints, totalCarbonSaved, totalPurchases, badges } = state;
  const tier = TIER_DATA.find(t => greenPoints >= t.min && greenPoints <= t.max) || TIER_DATA[0];

  // Compute cumulative data
  const cumulativeData = sessionData.map((d, i) => ({
    ...d,
    points: i === 0 ? greenPoints : d.points,
    carbon: i === 0 ? totalCarbonSaved : d.carbon,
  }));

  const topEcoProducts = [...products]
    .sort((a, b) => b.sustainabilityScore - a.sustainabilityScore)
    .slice(0, 5);

  const chartColors = ["#1E3A1E", "#2C5F2D", "#4A7C59", "#7BAE7F", "#A8D5A2"];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#7BAE7F" }}>
            Your Eco Journey
          </p>
          <h1 className="serif text-4xl" style={{ color: "#1E3A1E" }}>
            Dashboard
          </h1>
        </div>
        {totalPurchases > 0 && (
          <div
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm"
            style={{ background: "#E8F5E9", color: "#2C5F2D", border: "1px solid #A8D5A2" }}
          >
            <Leaf size={16} /> {totalPurchases} eco {totalPurchases === 1 ? "purchase" : "purchases"}
          </div>
        )}
      </div>

      {totalPurchases === 0 ? (
        /* Empty state */
        <div className="text-center py-20">
          <div
            className="mx-auto mb-6 rounded-full flex items-center justify-center"
            style={{ width: 88, height: 88, background: "#E8F5E9" }}
          >
            <Leaf size={40} style={{ color: "#4A7C59" }} />
          </div>
          <h2 className="serif text-2xl mb-3" style={{ color: "#1E3A1E" }}>
            Your eco journey starts here
          </h2>
          <p className="mb-6 max-w-sm mx-auto" style={{ color: "#6B7A6E", fontSize: 15 }}>
            Complete your first order to start tracking your green points, carbon savings, and badges.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold no-underline"
            style={{ background: "#2C5F2D", color: "white" }}
          >
            <ShoppingBag size={16} /> Start shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={<Star size={22} fill="#2C5F2D" color="#2C5F2D" />}
              value={greenPoints.toLocaleString()}
              label="Green Points"
              sub={`${tier.name} tier`}
              accent="#2C5F2D"
            />
            <StatCard
              icon={<TrendingDown size={22} color="#4A7C59" />}
              value={`${totalCarbonSaved.toFixed(2)} kg`}
              label="Carbon Saved"
              sub="vs. standard shipping"
              accent="#4A7C59"
            />
            <StatCard
              icon={<ShoppingBag size={22} color="#7BAE7F" />}
              value={totalPurchases}
              label={`Eco ${totalPurchases === 1 ? "Purchase" : "Purchases"}`}
              sub="Sustainable choices made"
              accent="#7BAE7F"
            />
            <StatCard
              icon={<Award size={22} color="#1E3A1E" />}
              value={badges.length}
              label={`${badges.length === 1 ? "Badge" : "Badges"} Earned`}
              sub={badges.length === 0 ? "Keep shopping to earn badges" : badges[badges.length - 1]}
              accent="#1E3A1E"
            />
          </div>

          {/* Points + Carbon widgets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <GreenPointsBar points={greenPoints} />
            <TotalCarbonSavedWidget totalKg={totalCarbonSaved} />
          </div>

          {/* Badges */}
          {badges.length > 0 && (
            <div
              className="rounded-2xl p-5"
              style={{ background: "white", border: "1px solid #E8F5E9" }}
            >
              <BadgeShelf badges={badges} />
            </div>
          )}

          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Eco Metrics radar */}
            <div
              className="rounded-2xl p-5"
              style={{ background: "white", border: "1px solid #E8F5E9" }}
            >
              <p className="font-semibold mb-4" style={{ color: "#1E3A1E" }}>
                Eco Metrics Overview
              </p>
              <ResponsiveContainer width="100%" height={260}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#E8F5E9" />
                  <PolarAngleAxis
                    dataKey="metric"
                    tick={{ fontSize: 11, fill: "#6B7A6E", fontFamily: "Inter" }}
                  />
                  <Radar
                    name="Score"
                    dataKey="value"
                    stroke="#2C5F2D"
                    fill="#2C5F2D"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Product eco scores bar chart */}
            <div
              className="rounded-2xl p-5"
              style={{ background: "white", border: "1px solid #E8F5E9" }}
            >
              <p className="font-semibold mb-4" style={{ color: "#1E3A1E" }}>
                Top 5 Products by Eco Score
              </p>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={topEcoProducts} layout="vertical" margin={{ left: 10 }}>
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: "#6B7A6E" }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={130}
                    tick={{ fontSize: 11, fill: "#6B7A6E", fontFamily: "Inter" }}
                  />
                  <Tooltip
                    formatter={(v) => [`${v}/100`, "Eco Score"]}
                    contentStyle={{
                      borderRadius: 10,
                      border: "1px solid #E8F5E9",
                      fontSize: 12,
                      fontFamily: "Inter",
                    }}
                  />
                  <Bar dataKey="sustainabilityScore" radius={[0, 4, 4, 0]}>
                    {topEcoProducts.map((_, i) => (
                      <Cell key={i} fill={chartColors[i]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* How eco score works */}
          <div
            className="rounded-2xl p-6"
            style={{ background: "linear-gradient(135deg, #1E3A1E 0%, #2C5F2D 100%)", color: "white" }}
          >
            <h2 className="serif text-xl mb-4" style={{ color: "#A8D5A2" }}>
              How Points are Calculated
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              {[
                { icon: "🛍️", title: "Product Points", desc: "Eco score ÷ 10 per item. Score 95 = 9-10 pts per unit." },
                { icon: "🌿", title: "Eco Shipping Bonus", desc: "+50 bonus points whenever you choose eco delivery." },
                { icon: "🏆", title: "Badge Milestones", desc: "Reach 100, 250, 500 pts or 3+ orders to unlock badges." },
              ].map(({ icon, title, desc }) => (
                <div
                  key={title}
                  className="rounded-xl p-4"
                  style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(168,213,162,0.2)" }}
                >
                  <p className="text-2xl mb-2">{icon}</p>
                  <p className="font-semibold mb-1">{title}</p>
                  <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 13 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
