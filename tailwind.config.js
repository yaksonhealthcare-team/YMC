/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Pretendard", "system-ui"], // 기본 폰트 패밀리 설정
      },
      fontWeight: {
        b: "700", // Bold
        sb: "600", // Semi-Bold
        m: "500", // Medium
        r: "400", // Regular
      },
      // 폰트 크기, line-height 설정
      fontSize: {
        "10px": ["10px", "148%"],
        "12px": ["12px", "148%"],
        "14px": ["14px", "148%"],
        "14pxb": ["14px", "168%"],
        "16px": ["16px", "148%"],
        "16pxb": ["16px", "168%"],
        "18px": ["18px", "168%"],
        "20px": ["20px", "148%"],
        "24px": ["24px", "148%"],
        "28px": ["28px", "148%"],
      },
      // letter-spacing (-0.50%) 설정
      letterSpacing: {
        DEFAULT: "-0.005em", // 기본 letter-spacing 설정
      },
      colors: {
        white: "#FFFFFF",
        black: "#000000",
        gray: {
          50: "#F8F8F8",
          100: "#ECECEC",
          200: "#DDDDDD",
          300: "#BDBDBD",
          400: "#9E9E9E",
          500: "#757575",
          600: "#424242",
          700: "#212121",
        },
        primary: {
          main: "#F37165",
          50: "#FEF1F0",
          100: "#FDEAE8",
          200: "#FBD3CF",
          300: "#F37165",
          400: "#DB665B",
          500: "#C25A51",
          600: "#B6554C",
        },
      },
    },
  },
  plugins: [],
}
