import Home from "../pages/home/Home.tsx"
import Login from "../pages/login/Login.tsx"
import Purchase from "../pages/purchase/Purchase.tsx"
import Store from "../pages/store/Store.tsx"
import Reservation from "../pages/reservation/Reservation.tsx"
import MyPage from "../pages/myPage/MyPage.tsx"

const routeConfig = [
  { path: "/", element: <Home />, auth: true },
  { path: "/login", element: <Login />, auth: false },
  { path: "/signup", element: <div>Signup</div>, auth: false },
  { path: "/purchase", element: <Purchase />, auth: true },
  { path: "/store", element: <Store />, auth: true },
  { path: "/reservation", element: <Reservation />, auth: true },
  { path: "/mypage", element: <MyPage />, auth: true },
]

export default routeConfig
