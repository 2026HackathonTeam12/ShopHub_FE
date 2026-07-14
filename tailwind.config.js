/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                // Surface
                canvas:  "var(--canvas)",
                surface: "var(--surface)",
                // Ink
                ink: "var(--ink)",
                // Panel (dark surfaces — AI panels, sidebar, auth left)
                panel:         "var(--panel)",
                "panel-hover": "var(--panel-hover)",
                // Single accent — Toss blue
                accent:           "var(--accent)",
                "accent-hover":   "var(--accent-hover)",
                "accent-muted":   "var(--accent-muted)",
                "accent-on-dark": "var(--accent-on-dark)",
                // Semantic
                success:          "var(--success)",
                "success-bg":     "var(--success-bg)",
                "success-border": "var(--success-border)",
                error:            "var(--error)",
                "error-bg":       "var(--error-bg)",
                "error-border":   "var(--error-border)",
                // Borders
                border:          "var(--border)",
                "border-subtle": "var(--border-subtle)",
                // Text roles
                secondary: "var(--text-secondary)",
                muted:     "var(--text-muted)",
                // Misc
                "star-gold": "var(--star-gold)",
            },
            fontSize: {
                // 5-step scale — base 14px
                display: ["2.5rem",   { lineHeight: "1.1",  letterSpacing: "-0.02em" }],
                title:   ["1.5rem",   { lineHeight: "1.2",  letterSpacing: "-0.015em" }],
                heading: ["1rem",     { lineHeight: "1.4" }],
                body:    ["0.875rem", { lineHeight: "1.65" }],
                caption: ["0.75rem",  { lineHeight: "1.45" }],
            },
            borderRadius: {
                card: "20px",
            },
        },
    },
    plugins: [],
}
