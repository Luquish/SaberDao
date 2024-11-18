// tailwind.config.js

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
    300: "#AAB8C1",
    400: "#9CA3AF",
    500: "#6B7280",
    600: "#4B5563",
    700: "#374151",
    800: "#161E26",
    900: "#050505",
};

const coolGray = {
    DEFAULT: "#6e7582",
    50: "#f9fafb",
    100: "#f0f1f3",
    150: "#eff1f4",
    200: "#d9dbdf",
    300: "#AAB8C1",
    400: "#9CA3AF",
    500: "#6B7280",
    600: "#4B5563",
    700: "#374151",
    800: "#161E26",
    900: "#050505",
};

const warmGray = {
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
    800: "#222222",
    850: "#181818",
    900: "#050505",
};

const textColor = {
    DEFAULT: grays[800],
    secondary: grays[500],
};


/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,jsx,ts,tsx}',
        './src/components/**/*.{js,jsx,ts,tsx}',
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                primary,
                accent,
                gray: grays,
                coolGray,
                warmGray,
                secondary: '#718096',
            },
            textColor,
            // ... resto de la configuración de theme de TribecaDAO
        },
    },
    plugins: [
        require("@tailwindcss/forms"), 
        require("@tailwindcss/typography")
    ],
};
