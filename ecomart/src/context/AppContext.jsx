import { createContext, useContext, useReducer, useEffect } from "react";
import { shippingOptions } from "../data/products";

const AppContext = createContext(null);

const initialState = {
  cart: [],
  selectedShipping: shippingOptions[0], // eco by default
  greenPoints: 0,
  totalCarbonSaved: 0,
  totalPurchases: 0,
  recentReward: null,
  nudgeVisible: {},
  badges: [],
};

function reducer(state, action) {
  switch (action.type) {
    case "ADD_TO_CART": {
      const existing = state.cart.find(i => i.id === action.product.id);
      const newCart = existing
        ? state.cart.map(i => i.id === action.product.id ? { ...i, qty: i.qty + 1 } : i)
        : [...state.cart, { ...action.product, qty: 1 }];
      return { ...state, cart: newCart };
    }
    case "REMOVE_FROM_CART":
      return { ...state, cart: state.cart.filter(i => i.id !== action.id) };
    case "UPDATE_QTY": {
      const newCart = state.cart
        .map(i => i.id === action.id ? { ...i, qty: action.qty } : i)
        .filter(i => i.qty > 0);
      return { ...state, cart: newCart };
    }
    case "SET_SHIPPING":
      return { ...state, selectedShipping: action.shipping };
    case "CLEAR_CART":
      return { ...state, cart: [] };
    case "COMPLETE_ORDER": {
      // Award points based on sustainability scores
      const ecoBonus = state.selectedShipping.isEco ? 50 : 0;
      const productPoints = state.cart.reduce((acc, item) => {
        return acc + Math.round((item.sustainabilityScore / 10) * item.qty);
      }, 0);
      const totalPoints = productPoints + ecoBonus;

      // Carbon saved vs standard shipping
      const standardCarbon = 0.82;
      const savedCarbon = state.selectedShipping.isEco
        ? (standardCarbon - state.selectedShipping.carbonKg) * 1
        : 0;
      const productCarbon = state.cart.reduce((acc, item) => {
        return acc + item.carbonKg * item.qty;
      }, 0);

      const newTotal = state.greenPoints + totalPoints;
      const newBadges = [...state.badges];
      if (newTotal >= 100 && !state.badges.includes("Green Starter"))
        newBadges.push("Green Starter");
      if (newTotal >= 250 && !state.badges.includes("Eco Champion"))
        newBadges.push("Eco Champion");
      if (state.totalPurchases + 1 >= 3 && !state.badges.includes("Sustainability Streak"))
        newBadges.push("Sustainability Streak");

      return {
        ...state,
        cart: [],
        greenPoints: newTotal,
        totalCarbonSaved: state.totalCarbonSaved + savedCarbon,
        totalPurchases: state.totalPurchases + 1,
        recentReward: { points: totalPoints, ecoBonus },
        badges: newBadges,
      };
    }
    case "SHOW_NUDGE":
      return { ...state, nudgeVisible: { ...state.nudgeVisible, [action.key]: true } };
    case "HIDE_NUDGE":
      return { ...state, nudgeVisible: { ...state.nudgeVisible, [action.key]: false } };
    case "CLEAR_REWARD":
      return { ...state, recentReward: null };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    try {
      const saved = localStorage.getItem("ecomart_state");
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...init, greenPoints: parsed.greenPoints || 0, totalCarbonSaved: parsed.totalCarbonSaved || 0, totalPurchases: parsed.totalPurchases || 0, badges: parsed.badges || [] };
      }
    } catch {}
    return init;
  });

  useEffect(() => {
    try {
      localStorage.setItem("ecomart_state", JSON.stringify({
        greenPoints: state.greenPoints,
        totalCarbonSaved: state.totalCarbonSaved,
        totalPurchases: state.totalPurchases,
        badges: state.badges,
      }));
    } catch {}
  }, [state.greenPoints, state.totalCarbonSaved, state.totalPurchases, state.badges]);

  const cartCount = state.cart.reduce((a, i) => a + i.qty, 0);
  const cartTotal = state.cart.reduce((a, i) => a + i.price * i.qty, 0);
  const cartCarbon = state.cart.reduce((a, i) => a + i.carbonKg * i.qty, 0)
    + state.selectedShipping.carbonKg;

  return (
    <AppContext.Provider value={{ state, dispatch, cartCount, cartTotal, cartCarbon }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
