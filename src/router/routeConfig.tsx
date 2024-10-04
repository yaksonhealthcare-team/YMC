import Home from "../pages/home/Home.tsx"
import Login from "../pages/login/Login.tsx"

const routeConfig = [
  { path: "/", element: <Home />, auth: true },
  { path: "/login", element: <Login />, auth: false },
]

export default routeConfig
