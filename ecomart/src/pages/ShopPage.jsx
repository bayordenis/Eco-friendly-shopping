import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, Leaf } from "lucide-react";
import { products, categories } from "../data/products";
import ProductCard from "../components/ProductCard";
import { TotalCarbonSavedWidget } from "../components/CarbonTracker";
import { GreenPointsBar } from "../components/GreenRewards";
import { useApp } from "../context/AppContext";

const SORT_OPTIONS = [
  { value: "eco", label: "Eco Score (High → Low)" },
  { value: "price_asc", label: "Price (Low → High)" },
  { value: "price_desc", label: "Price (High → Low)" },
  { value: "carbon", label: "Carbon (Low → High)" },
  { value: "rating", label: "Top Rated" },
];

export default function ShopPage() {
  const { state } = useApp();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("eco");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let list = products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "All" || p.category === category;
      return matchSearch && matchCat;
    });

    switch (sort) {
      case "eco": list.sort((a, b) => b.sustainabilityScore - a.sustainabilityScore); break;
      case "price_asc": list.sort((a, b) => a.price - b.price); break;
      case "price_desc": list.sort((a, b) => b.price - a.price); break;
      case "carbon": list.sort((a, b) => a.carbonKg - b.carbonKg); break;
      case "rating": list.sort((a, b) => b.rating - a.rating); break;
    }
    return list;
  }, [search, category, sort]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero banner */}
      <div
        className="rounded-3xl mb-8 px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6"
        style={{
          background: "linear-gradient(135deg, #1E3A1E 0%, #2C5F2D 60%, #4A7C59 100%)",
          color: "white",
        }}
      >
        <div className="max-w-lg">
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#A8D5A2" }}>
            Eco-Conscious Shopping
          </p>
          <h1 className="serif text-4xl sm:text-5xl mb-3" style={{ lineHeight: 1.1 }}>
            Every purchase,<br />a better planet.
          </h1>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 15 }}>
            Every product is scored for sustainability. Choose wisely — earn green points, save carbon, make a difference.
          </p>
        </div>
        <div className="flex flex-col gap-3 w-full sm:w-72">
          {state.totalCarbonSaved > 0 && (
            <TotalCarbonSavedWidget totalKg={state.totalCarbonSaved} />
          )}
          {state.greenPoints > 0 && (
            <GreenPointsBar points={state.greenPoints} />
          )}
          {state.greenPoints === 0 && (
            <div
              className="rounded-2xl p-4"
              style={{ background: "rgba(255,255,255,0.1)", border: "2px solid rgba(168,213,162,0.3)" }}
            >
              <p className="font-semibold mb-1 text-sm">Start earning green points</p>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>
                Shop sustainably, earn points, level up your eco tier, and unlock badges.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#7BAE7F" }} />
          <input
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search eco products…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
            style={{
              border: "2px solid #E8F5E9",
              background: "white",
              color: "#1A1A1A",
            }}
            onFocus={e => (e.target.style.borderColor = "#2C5F2D")}
            onBlur={e => (e.target.style.borderColor = "#E8F5E9")}
            aria-label="Search products"
          />
        </div>

        {/* Sort */}
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          className="px-4 py-2.5 rounded-xl text-sm outline-none cursor-pointer"
          style={{ border: "2px solid #E8F5E9", background: "white", color: "#1A1A1A", minWidth: 210 }}
          aria-label="Sort products"
        >
          {SORT_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        <button
          onClick={() => setShowFilters(f => !f)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
          style={{
            border: "2px solid #E8F5E9",
            background: showFilters ? "#E8F5E9" : "white",
            color: "#2C5F2D",
          }}
          aria-expanded={showFilters}
          aria-label="Toggle category filters"
        >
          <SlidersHorizontal size={16} /> Filter
        </button>
      </div>

      {/* Category pills */}
      {showFilters && (
        <div className="flex flex-wrap gap-2 mb-6 nudge-in">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className="text-sm font-medium px-4 py-1.5 rounded-full transition-all"
              style={{
                background: category === cat ? "#2C5F2D" : "#E8F5E9",
                color: category === cat ? "white" : "#2C5F2D",
                border: `2px solid ${category === cat ? "#2C5F2D" : "#A8D5A2"}`,
              }}
              aria-pressed={category === cat}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Results count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm" style={{ color: "#6B7A6E" }}>
          <strong style={{ color: "#1A1A1A" }}>{filtered.length}</strong> eco products
          {category !== "All" && <> in <strong style={{ color: "#2C5F2D" }}>{category}</strong></>}
        </p>
        {filtered.length > 0 && (
          <div className="flex items-center gap-1.5 text-xs" style={{ color: "#4A7C59" }}>
            <Leaf size={13} />
            Sorted by eco score by default
          </div>
        )}
      </div>

      {/* Product grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="serif text-2xl mb-2" style={{ color: "#6B7A6E" }}>No products found</p>
          <p className="text-sm" style={{ color: "#6B7A6E" }}>
            Try a different search or category
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
