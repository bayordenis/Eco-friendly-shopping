import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Leaf, Zap } from "lucide-react";
import { useApp } from "../context/AppContext";
import { shippingOptions } from "../data/products";
import { CartCarbonSummary } from "../components/CarbonTracker";
import { CartSocialNudge } from "../components/SocialProof";
import { SustainabilityScore } from "../components/SustainabilityScore";

export default function CartPage() {
  const { state, dispatch, cartTotal, cartCarbon } = useApp();
  const navigate = useNavigate();
  const { cart, selectedShipping } = state;

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div
          className="inline-flex items-center justify-center rounded-full mb-6"
          style={{ width: 80, height: 80, background: "#E8F5E9" }}
        >
          <ShoppingBag size={36} style={{ color: "#4A7C59" }} />
        </div>
        <h2 className="serif text-3xl mb-3" style={{ color: "#1E3A1E" }}>
          Your cart is empty
        </h2>
        <p className="mb-6" style={{ color: "#6B7A6E" }}>
          Start adding eco-friendly products to your cart.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold no-underline"
          style={{ background: "#2C5F2D", color: "white" }}
        >
          Browse products <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  const orderTotal = cartTotal + selectedShipping.price;
  const pointsPreview = cart.reduce((acc, item) =>
    acc + Math.round((item.sustainabilityScore / 10) * item.qty), 0
  ) + (selectedShipping.isEco ? 50 : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="serif text-3xl mb-8" style={{ color: "#1E3A1E" }}>
        Your Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">
          {/* Social proof nudge */}
          <CartSocialNudge count={31} />

          {cart.map(item => (
            <div
              key={item.id}
              className="flex gap-4 rounded-2xl p-4"
              style={{ background: "white", border: "1px solid #E8F5E9" }}
            >
              {/* Image */}
              <Link to={`/product/${item.id}`} className="flex-shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="rounded-xl object-cover"
                  style={{ width: 80, height: 80 }}
                />
              </Link>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link
                      to={`/product/${item.id}`}
                      className="font-semibold text-sm no-underline"
                      style={{ color: "#1A1A1A" }}
                    >
                      {item.name}
                    </Link>
                    <p className="text-xs mt-0.5" style={{ color: "#7BAE7F" }}>
                      {item.category}
                    </p>
                  </div>
                  <SustainabilityScore score={item.sustainabilityScore} size="sm" />
                </div>

                <div className="flex items-center justify-between mt-3">
                  {/* Qty control */}
                  <div
                    className="flex items-center rounded-lg overflow-hidden"
                    style={{ border: "2px solid #E8F5E9" }}
                  >
                    <button
                      onClick={() => dispatch({ type: "UPDATE_QTY", id: item.id, qty: item.qty - 1 })}
                      className="flex items-center justify-center"
                      style={{ width: 32, height: 32, background: "#F4F7F0", border: "none", cursor: "pointer" }}
                      aria-label={`Decrease quantity of ${item.name}`}
                    >
                      <Minus size={14} style={{ color: "#6B7A6E" }} />
                    </button>
                    <span
                      className="mono font-semibold text-sm"
                      style={{ width: 36, textAlign: "center", color: "#1A1A1A" }}
                    >
                      {item.qty}
                    </span>
                    <button
                      onClick={() => dispatch({ type: "UPDATE_QTY", id: item.id, qty: item.qty + 1 })}
                      className="flex items-center justify-center"
                      style={{ width: 32, height: 32, background: "#F4F7F0", border: "none", cursor: "pointer" }}
                      aria-label={`Increase quantity of ${item.name}`}
                    >
                      <Plus size={14} style={{ color: "#6B7A6E" }} />
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-bold" style={{ color: "#1E3A1E" }}>
                      GH₵ {(item.price * item.qty).toFixed(2)}
                    </span>
                    <button
                      onClick={() => dispatch({ type: "REMOVE_FROM_CART", id: item.id })}
                      className="flex items-center justify-center rounded-lg p-1.5 transition-colors"
                      style={{ background: "#FEF2F2", border: "none", cursor: "pointer" }}
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      <Trash2 size={14} style={{ color: "#EF4444" }} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* PERSUASIVE FEATURE: Eco Shipping Selection (default eco) */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{ border: "2px solid #E8F5E9", background: "white" }}
          >
            <div
              className="flex items-center gap-2 px-5 py-3"
              style={{ background: "#F4F7F0", borderBottom: "1px solid #E8F5E9" }}
            >
              <Leaf size={16} style={{ color: "#2C5F2D" }} />
              <span className="font-semibold text-sm" style={{ color: "#1E3A1E" }}>
                Delivery Method
              </span>
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full ml-auto"
                style={{ background: "#A8D5A2", color: "#1E3A1E" }}
              >
                Eco default pre-selected
              </span>
            </div>
            <div className="divide-y" style={{ borderColor: "#F4F7F0" }}>
              {shippingOptions.map(opt => (
                <label
                  key={opt.id}
                  className="flex items-start gap-3 px-5 py-4 cursor-pointer transition-colors"
                  style={{
                    background: selectedShipping.id === opt.id
                      ? opt.isEco ? "#E8F5E9" : "white"
                      : "white",
                  }}
                >
                  <input
                    type="radio"
                    name="shipping"
                    value={opt.id}
                    checked={selectedShipping.id === opt.id}
                    onChange={() => dispatch({ type: "SET_SHIPPING", shipping: opt })}
                    className="mt-1 accent-green-700"
                    aria-label={`${opt.label}: ${opt.description}`}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm" style={{ color: "#1A1A1A" }}>
                        {opt.label}
                      </span>
                      {opt.isEco && (
                        <span
                          className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full eco-pulse"
                          style={{ background: "#2C5F2D", color: "white" }}
                        >
                          <Zap size={10} /> +50 pts
                        </span>
                      )}
                      <span className="text-xs ml-auto font-medium" style={{ color: "#6B7A6E" }}>
                        {opt.price === 0 ? "Free" : `GH₵ ${opt.price.toFixed(2)}`}
                      </span>
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: "#6B7A6E" }}>
                      {opt.description} · {opt.days} days
                    </p>
                    <p className="text-xs mt-0.5 mono" style={{ color: opt.isEco ? "#4A7C59" : "#E65100" }}>
                      {opt.carbonKg} kg CO₂
                      {!opt.isEco && (
                        <span style={{ color: "#E65100" }}>
                          {" "}(+{(opt.carbonKg - shippingOptions[0].carbonKg).toFixed(2)} kg vs eco)
                        </span>
                      )}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Order summary sidebar */}
        <div className="space-y-4">
          {/* Carbon summary */}
          <CartCarbonSummary cartCarbon={cartCarbon} shipping={selectedShipping} />

          {/* Points preview */}
          <div
            className="rounded-2xl p-4 space-y-2"
            style={{ background: "#1E3A1E", color: "white" }}
          >
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#A8D5A2" }}>
              Points Preview
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm">Products</span>
              <span className="mono font-bold" style={{ color: "#A8D5A2" }}>
                +{pointsPreview - (selectedShipping.isEco ? 50 : 0)}
              </span>
            </div>
            {selectedShipping.isEco && (
              <div className="flex items-center justify-between">
                <span className="text-sm">Eco shipping bonus</span>
                <span className="mono font-bold" style={{ color: "#A8D5A2" }}>+50</span>
              </div>
            )}
            <div
              className="flex items-center justify-between pt-2 font-bold border-t"
              style={{ borderColor: "rgba(168,213,162,0.3)" }}
            >
              <span>Total to earn</span>
              <span className="mono text-xl" style={{ color: "#A8D5A2" }}>+{pointsPreview}</span>
            </div>
          </div>

          {/* Price summary */}
          <div
            className="rounded-2xl p-4 space-y-3"
            style={{ background: "white", border: "1px solid #E8F5E9" }}
          >
            <p className="font-semibold" style={{ color: "#1E3A1E" }}>Order Summary</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span style={{ color: "#6B7A6E" }}>Subtotal</span>
                <span className="mono">GH₵ {cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "#6B7A6E" }}>Delivery</span>
                <span className="mono" style={{ color: selectedShipping.price === 0 ? "#2C5F2D" : "#1A1A1A" }}>
                  {selectedShipping.price === 0 ? "Free 🌿" : `GH₵ ${selectedShipping.price.toFixed(2)}`}
                </span>
              </div>
            </div>
            <div
              className="flex justify-between font-bold pt-3 border-t text-base"
              style={{ borderColor: "#E8F5E9" }}
            >
              <span style={{ color: "#1E3A1E" }}>Total</span>
              <span className="mono" style={{ color: "#1E3A1E" }}>GH₵ {orderTotal.toFixed(2)}</span>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white transition-all"
              style={{ background: "#1E3A1E" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#2C5F2D")}
              onMouseLeave={e => (e.currentTarget.style.background = "#1E3A1E")}
            >
              Proceed to Checkout <ArrowRight size={16} />
            </button>

            <Link
              to="/"
              className="block text-center text-sm no-underline"
              style={{ color: "#6B7A6E" }}
            >
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
