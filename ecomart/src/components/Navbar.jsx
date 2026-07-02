import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Leaf, Star, BarChart2 } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function Navbar() {
  const { state, cartCount } = useApp();
  const location = useLocation();

  const navLinks = [
    { to: "/", label: "Shop" },
    { to: "/cart", label: "Cart" },
    { to: "/dashboard", label: "Dashboard" },
  ];

  return (
    <header
      className="sticky top-0 z-40"
      style={{ background: "white", borderBottom: "1px solid #E8F5E9" }}
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 no-underline">
          <div
            className="rounded-full flex items-center justify-center"
            style={{ width: 36, height: 36, background: "#1E3A1E" }}
          >
            <Leaf size={18} color="#A8D5A2" />
          </div>
          <span className="serif text-xl" style={{ color: "#1E3A1E" }}>
            EcoMart
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden sm:flex items-center gap-6">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="text-sm font-medium no-underline transition-colors"
              style={{
                color: location.pathname === to ? "#2C5F2D" : "#6B7A6E",
                borderBottom: location.pathname === to ? "2px solid #2C5F2D" : "2px solid transparent",
                paddingBottom: 2,
              }}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-3">
          {/* Green points pill */}
          {state.greenPoints > 0 && (
            <Link
              to="/dashboard"
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full no-underline"
              style={{ background: "#E8F5E9", color: "#2C5F2D", border: "1px solid #A8D5A2" }}
            >
              <Star size={12} fill="#2C5F2D" color="#2C5F2D" />
              {state.greenPoints} pts
            </Link>
          )}

          {/* Cart icon */}
          <Link
            to="/cart"
            className="relative flex items-center justify-center no-underline"
            aria-label={`Cart, ${cartCount} items`}
          >
            <div
              className="rounded-full p-2 transition-colors"
              style={{ background: cartCount > 0 ? "#E8F5E9" : "transparent" }}
            >
              <ShoppingCart size={22} style={{ color: cartCount > 0 ? "#2C5F2D" : "#6B7A6E" }} />
            </div>
            {cartCount > 0 && (
              <span
                className="absolute -top-1 -right-1 rounded-full text-white flex items-center justify-center mono font-bold"
                style={{
                  width: 18, height: 18, fontSize: 10, background: "#2C5F2D",
                }}
              >
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile nav */}
      <nav
        className="sm:hidden flex border-t"
        style={{ borderColor: "#E8F5E9" }}
      >
        {navLinks.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className="flex-1 text-center text-xs font-medium py-2 no-underline"
            style={{
              color: location.pathname === to ? "#2C5F2D" : "#6B7A6E",
              borderBottom: location.pathname === to ? "2px solid #2C5F2D" : "2px solid transparent",
              background: location.pathname === to ? "#F4F7F0" : "white",
            }}
          >
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
