// ── Design Tokens ────────────────────────────────────────────────────────────

export const colors = {
  // Brand
  primary:       "#5b5cf6",
  primaryDark:   "#3f3bd8",
  primaryLight:  "#ecebff",
  primarySoft:   "#f5f4ff",
  primaryBorder: "#c7c6ff",

  // Semantic
  success:         "#5b5cf6",
  successLight:    "#ecebff",
  successDark:     "#3f3bd8",
  successCalendar: "#5b5cf6",
  error:           "#ef4444",
  warning:         "#b45309",
  warningBg:       "#fef3c7",

  // Text
  textPrimary:   "#111827",
  textDark:      "#374151",
  textMuted:     "#4b5563",
  textSecondary: "#6b7280",
  textTertiary:  "#9ca3af",

  // Surfaces
  background: "#f9fafb",
  surface:    "#f3f4f6",
  card:       "#ffffff",

  // Borders
  border:      "#e5e7eb",
  borderLight: "#d1d5db",

  // States
  disabled:     "#d1d5db",
  disabledText: "#9ca3af",

  // Overlays / feedback
  overlay: "rgba(17,24,39,0.48)",
  heroScrimMid: "rgba(0,0,0,0.38)",
  heroScrimStrong: "rgba(0,0,0,0.74)",
  toastSuccess: "rgba(91,92,246,0.95)",
  toastWarning: "rgba(180,83,9,0.95)",
  toastInfo: "rgba(91,92,246,0.95)",
  white: "#ffffff",
  whiteMuted: "rgba(255,255,255,0.78)",
  whiteSubtle: "rgba(255,255,255,0.70)",
  whiteGlass: "rgba(255,255,255,0.72)",
};

export const radius = {
  xs:   8,
  sm:   10,
  md:   16,
  lg:   24,
  full: 999,
  pill: 999,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 40,
};

export const typography = {
  pageTitle:   { fontSize: 28, fontWeight: "800" },
  inputTitle:  { fontSize: 20, fontWeight: "700" },
  cardTitle:   { fontSize: 17, fontWeight: "700" },
  sectionTitle:{ fontSize: 18, fontWeight: "700" },
  body:        { fontSize: 15 },
  bodySemibold:{ fontSize: 16, fontWeight: "600" },
  label:       { fontSize: 13, fontWeight: "600" },
  labelSm:     { fontSize: 12, fontWeight: "600" },
  button:      { fontSize: 15, fontWeight: "700" },
};

export const shadow = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  toast: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
};
