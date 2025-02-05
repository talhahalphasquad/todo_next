module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Your custom color palette
        primary: {
          DEFAULT: "hsl(222.2 47.4% 11.2%)",
          foreground: "hsl(210 40% 98%)",
        },
        // ... other color definitions
      },
      // Additional dark mode specific configurations
    },
  },
  // ... other configurations
};
