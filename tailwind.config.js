// tailwind.config.js

/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
    content: [
        './src/hoc/**/*.{js,jsx,ts,tsx}',
        './src/pages/**/*.{js,jsx,ts,tsx}',
        './src/components/**/*.{js,jsx,ts,tsx}',
    ],
    theme: {
        fontFamily: {
            display: ['Inter', 'sans-serif'],
            body: ['Inter', 'sans-serif'],
            sans: ['Inter', 'sans-serif'],
            serif: ['Inter', 'sans-serif'],
            mono: ['monospace'],
        },
        extend: {
            colors: {
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
            keyframes: {
                'fade-in-down': {
                    '0%': {
                        opacity: '0',
                        transform: 'translateY(-10px)'
                    },
                    '100%': {
                        opacity: '1',
                        transform: 'translateY(0)'
                    },
                }
            },
            animation: {
                'fade-in-down': 'fade-in-down 1.5s ease-out forwards',
                'fade-in-down-delayed': 'fade-in-down 1.5s 0.2s ease-out forwards',
                'fade-in-down-delayed-2': 'fade-in-down 1.5s 0.4s ease-out forwards',
                'fade-in-down-delayed-3': 'fade-in-down 1.5s 0.6s ease-out forwards',
            }
        },
    },
    plugins: [],
};
