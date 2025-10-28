module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  darkMode: 'class', // importante: toggling con class "dark" su <html> o <body>
  theme: {
    extend: {
      colors: {
        'dnd-brown': '#2b1f15',
        'dnd-gold': '#d4a95b',
        'dnd-ink': '#0b0b0b',
        'dnd-emerald': '#0ea5a4',
        'dnd-velvet': '#3b2130'
      },
      fontFamily: {
        fantasy: ['"Cinzel"', 'serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        'ornate': '0 8px 30px rgba(11,11,11,0.45)'
      }
    }
  },
  plugins: [],
}
