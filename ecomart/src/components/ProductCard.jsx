import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";
import { useApp } from "../context/AppContext";
import { SustainabilityScore, EcoBadge } from "./SustainabilityScore";
import { CarbonBadge } from "./CarbonTracker";

export default function ProductCard({ product }) {
  const { dispatch } = useApp();
  const [added, setAdded] = useState(false);

  function handleAdd(e) {
    e.preventDefault();
    dispatch({ type: "ADD_TO_CART", product });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <Link
      to={`/product/${product.id}`}
      className="group block no-underline rounded-2xl overflow-hidden transition-transform hover:-translate-y-1"
      style={{
        background: "white",
        border: "1px solid #E8F5E9",
        boxShadow: "0 2px 8px rgba(30,58,30,0.06)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(30,58,30,0.14)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(30,58,30,0.06)";
      }}
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ height: 200 }}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Sustainability score overlay */}
        <div className="absolute top-3 left-3">
          <SustainabilityScore score={product.sustainabilityScore} size="sm" />
        </div>
        {/* Carbon badge */}
        <div className="absolute bottom-3 right-3">
          <CarbonBadge carbonKg={product.carbonKg} size="sm" />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Category */}
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#7BAE7F" }}>
          {product.category}
        </p>

        {/* Name */}
        <h3 className="font-semibold" style={{ color: "#1A1A1A", fontSize: 15 }}>
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                fill={i < Math.round(product.rating) ? "#F59E0B" : "none"}
                color={i < Math.round(product.rating) ? "#F59E0B" : "#D1D5DB"}
              />
            ))}
          </div>
          <span className="text-xs" style={{ color: "#6B7A6E" }}>
            {product.rating} ({product.reviews})
          </span>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-1">
          {product.badges.slice(0, 2).map(b => (
            <EcoBadge key={b} label={b} />
          ))}
        </div>

        {/* Price + Add button */}
        <div className="flex items-center justify-between pt-1">
          <span className="font-bold text-lg" style={{ color: "#1E3A1E" }}>
            GH₵ {product.price.toFixed(2)}
          </span>
          <button
            onClick={handleAdd}
            className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl transition-all"
            style={{
              background: added ? "#A8D5A2" : "#2C5F2D",
              color: added ? "#1E3A1E" : "white",
            }}
            aria-label={`Add ${product.name} to cart`}
          >
            {added ? (
              <span>✓ Added</span>
            ) : (
              <>
                <ShoppingCart size={14} />
                Add
              </>
            )}
          </button>
        </div>
      </div>
    </Link>
  );
}
