const primary = {
    DEFAULT: "#00D18C",
    50: "#8AFFD8",
    100: "#75FFD2",
    200: "#4CFFC4",
    300: "#24FFB7",
    400: "#00FAA7",
    500: "#00D18C",
    600: "#009966",
    700: "#006141",
    800: "#00291B",
    900: "#000000",
};

const accent = {
    DEFAULT: "#9945FF",
    50: "#FEFDFF",
    100: "#F2E8FF",
    200: "#DCBFFF",
    300: "#C697FF",
    400: "#AF6EFF",
    500: "#9945FF",
    600: "#7A0DFF",
    700: "#6000D4",
    800: "#46009C",
    900: "#2D0064",
};

const grays = {
    DEFAULT: "#6e7582",
    50: "#f9fafb",
    100: "#f0f1f3",
    150: "#eff1f4",
    200: "#d9dbdf",
    300: "#b7bbc2",
    400: "#8f959f",
    500: "#6e7582",
    600: "#555e6e",
    700: "#3e4859",
    800: "#283242",
    850: "#1f2023",
    900: "#131f30",
};

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/**/*.{js,jsx,ts,tsx}',
    ],
    darkMode: "class",
    theme: {
        screens: {
            sm: "480px",
            md: "768px",
            lg: "976px",
            xl: "1220px",
        },
        fontFamily: {
            display: ['Inter', 'sans-serif'],
            body: ['Inter', 'sans-serif'],
            sans: ['Inter', 'sans-serif'],
            serif: ['Inter', 'sans-serif'],
            mono: ['monospace'],
        },
        extend: {
            fontSize: {
                sm: ".8125rem",
            },
            colors: {
                primary,
                accent,
                gray: grays,
                secondary: '#666',
                saber: {
                    light: '#6966FB',
                    dark: '#3D42CE',
                    darker: '#181a52',
                    modelBg: '#111827',
                },
            },
            boxShadow: {
                '3xl': 'rgba(82, 82, 82, 0.25) 10px 10px 20px, rgba(82, 82, 82, 0.25) -10px -10px  20px',
            },
            scale: {
                98: ".98",
                102: "1.02",
            },
            borderColor: {
                DEFAULT: grays[150],
            },
            typography: {
                sm: {
                    css: {
                        fontSize: ".8125rem",
                        h1: { fontSize: ".8125rem" },
                        h2: { fontSize: ".8125rem" },
                        h3: { fontSize: ".8125rem" },
                    },
                },
                DEFAULT: {
                    css: {
                        color: grays[500],
                        strong: { color: grays[800] },
                        h1: { color: grays[800], fontWeight: 500 },
                        h2: { color: grays[800], fontWeight: 500 },
                        h3: { color: grays[800], fontWeight: 500 },
                        code: { color: grays[500] },
                    },
                },
                light: {
                    css: {
                        color: grays[300],
                        strong: { color: grays[50] },
                        h1: { color: grays[50], fontWeight: 500 },
                        h2: { color: grays[50], fontWeight: 500 },
                        h3: { color: grays[50], fontWeight: 500 },
                        code: { color: grays[300] },
                    },
                },
            },
        },
    },
    variants: {
        extend: {
            typography: ["dark"],
        },
    },
    plugins: [
        require("@tailwindcss/forms"),
        require("@tailwindcss/typography")
    ],
}; 