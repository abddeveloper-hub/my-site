/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        obsidian: "#0B0D12",
        panel: "#11141B",
        paper: "#F3F1EC",
        ember: "#FF6B3D",
        glass: "#6FE3D9",
        steel: "#8A93A6",
        line: "#262B36",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Inter", "sans-serif"],
        mono: ['"Space Mono"', "monospace"],
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "marquee-reverse": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0%)" },
        },
      },
      animation: {
        marquee: "marquee 36s linear infinite",
        "marquee-reverse": "marquee-reverse 42s linear infinite",
      },
    },
  },
  plugins: [],
};
