import { useEffect, useState } from "react";
import { Users } from "lucide-react";

export function SocialProofNudge({ product, visible }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) {
      const t = setTimeout(() => setShow(true), 300);
      return () => clearTimeout(t);
    }
    setShow(false);
  }, [visible]);

  if (!show) return null;

  return (
    <div
      className="nudge-in flex items-start gap-2 rounded-xl px-4 py-3"
      style={{
        background: "linear-gradient(135deg, #E8F5E9 0%, #F4F7F0 100%)",
        border: "1px solid #A8D5A2",
      }}
      role="status"
      aria-live="polite"
    >
      <div
        className="flex-shrink-0 rounded-full flex items-center justify-center"
        style={{ width: 32, height: 32, background: "#2C5F2D" }}
      >
        <Users size={16} color="white" />
      </div>
      <div>
        <p className="text-sm font-semibold" style={{ color: "#1E3A1E" }}>
          <span
            className="mono px-1 py-0.5 rounded"
            style={{ background: "#A8D5A2", color: "#1E3A1E" }}
          >
            {product.socialProof.count.toLocaleString()}
          </span>
          {" "}people {product.socialProof.label}.
        </p>
        <p className="text-xs mt-0.5" style={{ color: "#4A7C59" }}>
          Join the community making a difference.
        </p>
      </div>
    </div>
  );
}

export function CartSocialNudge({ count = 23 }) {
  return (
    <div
      className="nudge-in flex items-center gap-2 text-sm rounded-lg px-3 py-2"
      style={{ background: "#E8F5E9", color: "#2C5F2D", border: "1px solid #A8D5A2" }}
    >
      <span>👥</span>
      <span>
        <strong>{count} people</strong> are shopping sustainably right now.
      </span>
    </div>
  );
}
