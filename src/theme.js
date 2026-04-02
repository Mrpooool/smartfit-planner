// ── Design Tokens ────────────────────────────────────────────────────────────

export const colors = {
  // Brand
  primary:       "#6366f1",
  primaryDark:   "#4338ca",
  primaryLight:  "#e0e7ff",
  primaryBorder: "#c7d2fe",

  // Semantic
  success:         "#10b981",
  successCalendar: "#22c55e",
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
};

export const radius = {
  sm:   8,
  md:   12,
  lg:   16,
  pill: 20,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 40,
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
};
