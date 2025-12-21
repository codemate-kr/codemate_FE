/** @type {import('tailwindcss').Config} */
export default {
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