import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Navbar from "./components/Navbar";
import ShopPage from "./pages/ShopPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import DashboardPage from "./pages/DashboardPage";

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div style={{ minHeight: "100vh", background: "#F4F7F0" }}>
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<ShopPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
            </Routes>
          </main>
          <footer
            className="mt-16 py-8 text-center text-xs"
            style={{ borderTop: "1px solid #E8F5E9", color: "#7BAE7F" }}
          >
            <p>
              🌿 EcoMart — Persuasive E-Commerce Interface · HCI Research Prototype ·{" "}
              <span style={{ color: "#A8D5A2" }}>
                All purchases simulated for evaluation purposes
              </span>
            </p>
          </footer>
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
