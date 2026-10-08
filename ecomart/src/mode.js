// Experiment condition switch: ?mode=control renders the standard (non-persuasive) interface.
let mode = "persuasive";
try {
  const p = new URLSearchParams(window.location.search).get("mode");
  if (p) sessionStorage.setItem("ecomart_mode", p);
  mode = sessionStorage.getItem("ecomart_mode") || "persuasive";
} catch {}
export const IS_CONTROL = mode === "control";
