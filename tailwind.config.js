/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        symbol: {
          primary: '#646cff',
          secondary: '#61dafb',
          accent: '#888',
          hover: '#646cffaa',
          react: '#61dafbaa',
        },
        // GitHub contribution graph colors
        grass: {
          0: '#ebedf0',  // 없음
          1: '#9be9a8',  // 적음
          2: '#40c463',  // 중간
          3: '#30a14e',  // 많음
          4: '#216e39',  // 최대
        },
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': {
            boxShadow: '0 0 15px rgba(56, 189, 248, 0.9), 0 0 35px rgba(125, 211, 252, 0.7), 0 0 60px rgba(186, 230, 253, 0.5), 0 0 90px rgba(224, 242, 254, 0.3)',
          },
          '50%': {
            boxShadow: '0 0 25px rgba(56, 189, 248, 1), 0 0 50px rgba(125, 211, 252, 0.9), 0 0 85px rgba(186, 230, 253, 0.7), 0 0 120px rgba(224, 242, 254, 0.5)',
          },
        },
      },
      fontFamily: {
        sans: [
          "Pretendard Variable",
          "Pretendard",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "Roboto",
          "Helvetica Neue",
          "Segoe UI",
          "Apple SD Gothic Neo",
          "Noto Sans KR",
          "Malgun Gothic",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
}