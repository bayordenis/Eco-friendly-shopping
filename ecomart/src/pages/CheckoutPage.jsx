import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Leaf, Wind, Star, AlertCircle } from "lucide-react";
import { useApp } from "../context/AppContext";
import { RewardPopup } from "../components/GreenRewards";
import { SustainabilityScore } from "../components/SustainabilityScore";

function Field({ label, type = "text", placeholder, required, id }) {
  const [err, setErr] = useState("");
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-sm font-medium" style={{ color: "#1E3A1E" }}>
        {label}{required && <span style={{ color: "#EF4444" }}>*</span>}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
        style={{
          border: `1.5px solid ${err ? "#EF4444" : "#E8F5E9"}`,
          background: "white",
          color: "#1A1A1A",
        }}
        onFocus={e => { e.target.style.borderColor = "#2C5F2D"; setErr(""); }}
        onBlur={e => { e.target.style.borderColor = "#E8F5E9"; }}
      />
      {err && <p className="text-xs" style={{ color: "#EF4444" }}>{err}</p>}
    </div>
  );
}

export default function CheckoutPage() {
  const { state, dispatch, cartTotal, cartCarbon } = useApp();
  const navigate = useNavigate();
  const { cart, selectedShipping, recentReward } = state;
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const orderTotal = cartTotal + selectedShipping.price;
  const totalCarbon = cartCarbon;
  const standardCarbon = cartCarbon - selectedShipping.carbonKg + 0.82;
  const carbonSaved = Math.max(0, standardCarbon - totalCarbon);

  const productPoints = cart.reduce((acc, item) =>
    acc + Math.round((item.sustainabilityScore / 10) * item.qty), 0);
  const totalPoints = productPoints + (selectedShipping.isEco ? 50 : 0);

  const avgScore = cart.length > 0
    ? Math.round(cart.reduce((a, i) => a + i.sustainabilityScore * i.qty, 0) /
        cart.reduce((a, i) => a + i.qty, 0))
    : 0;

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      dispatch({ type: "COMPLETE_ORDER" });
      setSubmitting(false);
    }, 800);
  }

  function handleRewardDismiss() {
    dispatch({ type: "CLEAR_REWARD" });
    navigate("/dashboard");
  }

  if (cart.length === 0 && !recentReward) {
    navigate("/");
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="serif text-3xl mb-2" style={{ color: "#1E3A1E" }}>Checkout</h1>
      <p className="text-sm mb-8" style={{ color: "#6B7A6E" }}>
        Review your order and its environmental impact before completing.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left: Form */}
        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Contact */}
            <div
              className="rounded-2xl p-5 space-y-4"
              style={{ background: "white", border: "1px solid #E8F5E9" }}
            >
              <p className="font-semibold" style={{ color: "#1E3A1E" }}>Contact Information</p>
              <div className="grid grid-cols-2 gap-3">
                <Field id="fname" label="First name" placeholder="Kofi" required />
                <Field id="lname" label="Last name" placeholder="Mensah" required />
              </div>
              <Field id="email" label="Email" type="email" placeholder="kofi@example.com" required />
              <Field id="phone" label="Phone" type="tel" placeholder="+233 XX XXX XXXX" />
            </div>

            {/* Delivery address */}
            <div
              className="rounded-2xl p-5 space-y-4"
              style={{ background: "white", border: "1px solid #E8F5E9" }}
            >
              <p className="font-semibold" style={{ color: "#1E3A1E" }}>Delivery Address</p>
              <Field id="street" label="Street address" placeholder="12 Liberation Road" required />
              <div className="grid grid-cols-2 gap-3">
                <Field id="city" label="City" placeholder="Accra" required />
                <Field id="region" label="Region" placeholder="Greater Accra" required />
              </div>
            </div>

            {/* Selected shipping recap */}
            <div
              className="rounded-2xl p-4 flex items-center gap-3"
              style={{
                background: selectedShipping.isEco ? "#E8F5E9" : "#FFF3E0",
                border: `1px solid ${selectedShipping.isEco ? "#A8D5A2" : "#FFCC80"}`,
              }}
            >
              <Leaf size={20} style={{ color: selectedShipping.isEco ? "#2C5F2D" : "#E65100", flexShrink: 0 }} />
              <div>
                <p className="text-sm font-semibold" style={{ color: selectedShipping.isEco ? "#1E3A1E" : "#E65100" }}>
                  {selectedShipping.label}
                  {selectedShipping.isEco && " ✓"}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "#6B7A6E" }}>
                  {selectedShipping.description} · {selectedShipping.carbonKg} kg CO₂
                </p>
              </div>
              {!selectedShipping.isEco && (
                <button
                  type="button"
                  onClick={() => navigate("/cart")}
                  className="ml-auto text-xs font-semibold underline"
                  style={{ color: "#2C5F2D", background: "none", border: "none", cursor: "pointer" }}
                >
                  Switch to eco
                </button>
              )}
            </div>

            {formError && (
              <div
                className="flex items-center gap-2 text-sm rounded-xl px-4 py-3"
                style={{ background: "#FEF2F2", color: "#EF4444", border: "1px solid #FCA5A5" }}
              >
                <AlertCircle size={16} /> {formError}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-2xl font-bold text-lg text-white transition-all flex items-center justify-center gap-2"
              style={{ background: submitting ? "#4A7C59" : "#1E3A1E" }}
            >
              {submitting ? (
                <><span className="animate-spin">⟳</span> Processing…</>
              ) : (
                <>
                  <CheckCircle size={20} />
                  Complete Order · GH₵ {orderTotal.toFixed(2)}
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right: Order review + environmental impact summary */}
        <div className="space-y-5">
          {/* PERSUASIVE FEATURE: Environmental Impact Summary */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{ border: "2px solid #2C5F2D" }}
          >
            <div
              className="flex items-center gap-2 px-5 py-3"
              style={{ background: "#1E3A1E", color: "white" }}
            >
              <Leaf size={18} />
              <span className="font-semibold">Environmental Impact Summary</span>
            </div>

            <div className="bg-white p-5 space-y-4">
              {/* Avg sustainability score */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold" style={{ color: "#1E3A1E" }}>
                    Avg. Eco Score
                  </p>
                  <p className="text-xs" style={{ color: "#6B7A6E" }}>
                    Across your {cart.reduce((a, i) => a + i.qty, 0)} items
                  </p>
                </div>
                <SustainabilityScore score={avgScore} size="md" />
              </div>

              <div className="w-full h-px" style={{ background: "#E8F5E9" }} />

              {/* Carbon */}
              <div className="grid grid-cols-2 gap-3">
                <div
                  className="rounded-xl p-3 text-center"
                  style={{ background: "#E8F5E9" }}
                >
                  <p className="text-xs" style={{ color: "#4A7C59" }}>Order carbon</p>
                  <p className="mono font-bold text-lg" style={{ color: "#1E3A1E" }}>
                    {totalCarbon.toFixed(2)}
                    <span className="text-xs font-normal"> kg</span>
                  </p>
                </div>
                {carbonSaved > 0 && (
                  <div
                    className="rounded-xl p-3 text-center"
                    style={{ background: "#F4F7F0" }}
                  >
                    <p className="text-xs" style={{ color: "#4A7C59" }}>vs standard shipping</p>
                    <p className="mono font-bold text-lg" style={{ color: "#2C5F2D" }}>
                      −{carbonSaved.toFixed(2)}
                      <span className="text-xs font-normal"> kg</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Points preview */}
              <div
                className="flex items-center justify-between rounded-xl px-4 py-3"
                style={{ background: "#1E3A1E" }}
              >
                <div className="flex items-center gap-2">
                  <Star size={16} fill="#A8D5A2" color="#A8D5A2" />
                  <span className="text-sm font-semibold text-white">Points you'll earn</span>
                </div>
                <span className="mono text-xl font-bold" style={{ color: "#A8D5A2" }}>
                  +{totalPoints}
                </span>
              </div>

              {/* Wind savings */}
              {carbonSaved > 0 && (
                <div
                  className="flex items-center gap-2 text-xs rounded-lg px-3 py-2"
                  style={{ background: "#F4F7F0", color: "#4A7C59" }}
                >
                  <Wind size={14} />
                  Choosing eco delivery saves {carbonSaved.toFixed(2)} kg CO₂ —
                  like not driving <strong>{(carbonSaved / 0.21).toFixed(0)} km</strong>.
                </div>
              )}
            </div>
          </div>

          {/* Order items list */}
          <div
            className="rounded-2xl p-5 space-y-3"
            style={{ background: "white", border: "1px solid #E8F5E9" }}
          >
            <p className="font-semibold text-sm" style={{ color: "#1E3A1E" }}>
              {cart.reduce((a, i) => a + i.qty, 0)} items
            </p>
            {cart.map(item => (
              <div key={item.id} className="flex items-center gap-3 text-sm">
                <img
                  src={item.image}
                  alt={item.name}
                  className="rounded-lg object-cover flex-shrink-0"
                  style={{ width: 48, height: 48 }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate" style={{ color: "#1A1A1A" }}>{item.name}</p>
                  <p className="text-xs" style={{ color: "#6B7A6E" }}>Qty: {item.qty}</p>
                </div>
                <span className="mono font-medium" style={{ color: "#1E3A1E" }}>
                  GH₵ {(item.price * item.qty).toFixed(2)}
                </span>
              </div>
            ))}
            <div className="pt-3 border-t space-y-1 text-sm" style={{ borderColor: "#E8F5E9" }}>
              <div className="flex justify-between">
                <span style={{ color: "#6B7A6E" }}>Subtotal</span>
                <span className="mono">GH₵ {cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "#6B7A6E" }}>Delivery</span>
                <span className="mono" style={{ color: selectedShipping.isEco ? "#2C5F2D" : "#1A1A1A" }}>
                  {selectedShipping.price === 0 ? "Free" : `GH₵ ${selectedShipping.price.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between font-bold pt-1 border-t" style={{ borderColor: "#E8F5E9" }}>
                <span style={{ color: "#1E3A1E" }}>Total</span>
                <span className="mono" style={{ color: "#1E3A1E" }}>GH₵ {orderTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reward popup */}
      {recentReward && (
        <RewardPopup reward={recentReward} onDismiss={handleRewardDismiss} />
      )}
    </div>
  );
}
