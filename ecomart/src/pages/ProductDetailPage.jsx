import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Star, CheckCircle, Leaf, Award } from "lucide-react";
import { products } from "../data/products";
import { useApp } from "../context/AppContext";
import { SustainabilityScore, EcoBadge } from "../components/SustainabilityScore";
import { CarbonBadge } from "../components/CarbonTracker";
import { SocialProofNudge } from "../components/SocialProof";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { dispatch } = useApp();
  const product = products.find(p => p.id === Number(id));

  const [added, setAdded] = useState(false);
  const [nudgeVisible, setNudgeVisible] = useState(false);

  useEffect(() => {
    if (!product) return;
    // Show social proof nudge after 1.5 seconds
    const t = setTimeout(() => setNudgeVisible(true), 1500);
    return () => clearTimeout(t);
  }, [product]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="serif text-2xl mb-4" style={{ color: "#6B7A6E" }}>
          Product not found
        </p>
        <Link to="/" style={{ color: "#2C5F2D" }}>← Back to shop</Link>
      </div>
    );
  }

  function handleAdd() {
    dispatch({ type: "ADD_TO_CART", product });
    setAdded(true);
    setTimeout(() => navigate("/cart"), 800);
  }

  const relatedProducts = products
    .filter(p => p.id !== product.id && (p.category === product.category || p.sustainabilityScore >= 90))
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm mb-6 transition-colors"
        style={{ color: "#6B7A6E", background: "none", border: "none", cursor: "pointer" }}
        onMouseEnter={e => (e.target.style.color = "#2C5F2D")}
        onMouseLeave={e => (e.target.style.color = "#6B7A6E")}
      >
        <ArrowLeft size={16} /> Back to products
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* LEFT — Image + sustainability */}
        <div className="space-y-4">
          <div
            className="relative rounded-3xl overflow-hidden"
            style={{ height: 420, background: "#E8F5E9" }}
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {/* Floating score */}
            <div
              className="absolute top-4 left-4 rounded-2xl p-3"
              style={{ background: "rgba(255,255,255,0.95)", boxShadow: "0 4px 16px rgba(0,0,0,0.12)" }}
            >
              <SustainabilityScore score={product.sustainabilityScore} size="lg" />
            </div>
          </div>

          {/* Material breakdown card */}
          <div
            className="rounded-2xl p-5 space-y-3"
            style={{ background: "white", border: "1px solid #E8F5E9" }}
          >
            <p className="font-semibold text-sm" style={{ color: "#1E3A1E" }}>
              🌿 What it's made of
            </p>
            <p className="text-sm" style={{ color: "#3D2B1F" }}>{product.materials}</p>
            <div className="flex flex-wrap gap-2 pt-1">
              {product.certifications.map(c => (
                <span
                  key={c}
                  className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full"
                  style={{ background: "#F4F7F0", color: "#2C5F2D", border: "1px solid #A8D5A2" }}
                >
                  <CheckCircle size={11} /> {c}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — Info + persuasive nudges */}
        <div className="space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#7BAE7F" }}>
              {product.category}
            </p>
            <h1 className="serif text-4xl mb-2" style={{ color: "#1E3A1E" }}>
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={i < Math.round(product.rating) ? "#F59E0B" : "none"}
                    color={i < Math.round(product.rating) ? "#F59E0B" : "#D1D5DB"}
                  />
                ))}
              </div>
              <span className="text-sm" style={{ color: "#6B7A6E" }}>
                {product.rating} · {product.reviews} reviews
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3">
            <span className="serif text-4xl font-bold" style={{ color: "#1E3A1E" }}>
              GH₵ {product.price.toFixed(2)}
            </span>
            <CarbonBadge carbonKg={product.carbonKg} />
          </div>

          {/* Description */}
          <p className="text-sm leading-relaxed" style={{ color: "#3D2B1F", lineHeight: 1.75 }}>
            {product.description}
          </p>

          {/* Eco badges */}
          <div className="flex flex-wrap gap-2">
            {product.badges.map(b => <EcoBadge key={b} label={b} />)}
          </div>

          {/* PERSUASIVE FEATURE 1: Social Proof Nudge */}
          <SocialProofNudge product={product} visible={nudgeVisible} />

          {/* PERSUASIVE FEATURE 2: Green points preview */}
          <div
            className="flex items-center gap-3 rounded-xl px-4 py-3"
            style={{ background: "#F4F7F0", border: "1px solid #E8F5E9" }}
          >
            <div
              className="rounded-full flex items-center justify-center flex-shrink-0"
              style={{ width: 36, height: 36, background: "#1E3A1E" }}
            >
              <Award size={18} color="#A8D5A2" />
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: "#1E3A1E" }}>
                Earn <span className="mono text-base" style={{ color: "#2C5F2D" }}>
                  +{Math.round(product.sustainabilityScore / 10)}
                </span> green points
              </p>
              <p className="text-xs" style={{ color: "#6B7A6E" }}>
                Higher eco score = more points
              </p>
            </div>
          </div>

          {/* Add to cart */}
          <div className="flex gap-3">
            <button
              onClick={handleAdd}
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold text-base transition-all"
              style={{
                background: added ? "#4A7C59" : "#1E3A1E",
                color: "white",
                transform: added ? "scale(0.98)" : "scale(1)",
              }}
            >
              {added ? (
                <><CheckCircle size={20} /> Added to cart</>
              ) : (
                <><ShoppingCart size={20} /> Add to Cart</>
              )}
            </button>
          </div>

          {/* PERSUASIVE FEATURE 3: Eco shipping teaser */}
          <div
            className="flex items-start gap-3 rounded-xl px-4 py-3"
            style={{ background: "#E8F5E9", border: "1px solid #A8D5A2" }}
          >
            <Leaf size={20} style={{ color: "#2C5F2D", flexShrink: 0, marginTop: 2 }} />
            <div>
              <p className="text-sm font-semibold" style={{ color: "#1E3A1E" }}>
                Free eco delivery available
              </p>
              <p className="text-xs mt-0.5" style={{ color: "#4A7C59" }}>
                Carbon-neutral shipping pre-selected at checkout — earn +50 bonus points!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <div className="mt-14">
          <h2 className="serif text-2xl mb-6" style={{ color: "#1E3A1E" }}>
            More eco-friendly picks
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map(p => (
              <Link
                key={p.id}
                to={`/product/${p.id}`}
                className="group no-underline rounded-2xl overflow-hidden transition-shadow"
                style={{ background: "white", border: "1px solid #E8F5E9", boxShadow: "0 2px 8px rgba(30,58,30,0.06)" }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 24px rgba(30,58,30,0.14)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 2px 8px rgba(30,58,30,0.06)"; }}
              >
                <div style={{ height: 140, overflow: "hidden" }}>
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-3">
                  <p className="font-semibold text-sm" style={{ color: "#1A1A1A" }}>{p.name}</p>
                  <p className="text-xs mt-1" style={{ color: "#6B7A6E" }}>
                    GH₵ {p.price.toFixed(2)} · Score: {p.sustainabilityScore}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
