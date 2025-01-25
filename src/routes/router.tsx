import { createBrowserRouter } from "react-router-dom"
import App from "../App"
import ReviewDetailPage from "../pages/review/ReviewDetailPage"
import CartPage from "../pages/cart/CartPage"
import MyPage from "../pages/myPage/MyPage"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "review",
        children: [
          {
            path: ":reviewId",
            element: <ReviewDetailPage />,
          },
        ],
      },
      {
        path: "cart",
        element: <CartPage />,
      },
      {
        path: "mypage",
        element: <MyPage />,
      },
    ],
  },
])
