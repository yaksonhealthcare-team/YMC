import { fetchUser, signinWithSocial } from "@apis/auth.api.ts"
import ErrorPage from "@components/ErrorPage"
import LoadingIndicator from "@components/LoadingIndicator"
import { Suspense, useEffect } from "react"
import {
  createBrowserRouter,
  RouteObject,
  RouterProvider,
} from "react-router-dom"
import { AuthProvider, useAuth } from "../contexts/AuthContext.tsx"
import { LayoutProvider } from "../contexts/LayoutContext.tsx"
import { OverlayProvider } from "../contexts/ModalContext.tsx"
import { SignupProvider } from "../contexts/SignupContext.tsx"
import ProtectedRoute from "./ProtectedRoute.tsx"
import { routeConfig, RouteConfig } from "./routeConfig"

export const createRoutes = () => {
  const mapRoutes = (routes: RouteConfig[]): RouteObject[] => {
    return routes.map((route) => {
      let element = route.element

      if (route.path.startsWith("/signup")) {
        element = <SignupProvider>{element}</SignupProvider>
      }

      if (route.auth) {
        element = <ProtectedRoute>{element}</ProtectedRoute>
      }

      element = (
        <LayoutProvider>
          <OverlayProvider>{element}</OverlayProvider>
        </LayoutProvider>
      )

      return {
        path: route.path,
        element: (
          <Suspense fallback={<LoadingIndicator className="min-h-screen" />}>
            {element}
          </Suspense>
        ),
        errorElement: <ErrorPage />,
        children: route.children ? mapRoutes(route.children) : undefined,
      }
    })
  }

  return createBrowserRouter(mapRoutes(routeConfig))
}

export const AppRouter = () => {
  const { login } = useAuth()

  useEffect(() => {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.onMessage = (data: string) => {
        // TODO: 개발 환경일 때만 로그 찍도록
        window.ReactNativeWebView?.postMessage(
          JSON.stringify({
            type: "CONSOLE_LOG",
            data: `Received message: ${data}`,
          }),
        )

        let result
        try {
          result = JSON.parse(data)
        } catch {
          result = data
        }

        if (result.type) {
          switch (result.type) {
            case "SOCIAL_LOGIN":
              handleSocialLogin(result.data)
              break
            case "LOGOUT":
              handleLogout()
              break
          }
        }
      }
    }
  }, [])

  const handleSocialLogin = async (data: any) => {
    console.log("소셜 로그인 처리:", data)
    try {
      const { accessToken } = await signinWithSocial({
        socialAccessToken: data.accessToken,
        socialId: data.socialId,
        provider: data.provider,
      })
      const user = await fetchUser(accessToken)
      login({ user, token: accessToken })
      window.location.href = "/"
      return
    } catch (error) {
      window.ReactNativeWebView?.postMessage(
        JSON.stringify({
          type: "CONSOLE_LOG",
          data: `Error: ${JSON.stringify(error)}`,
        }),
      )
      throw error
    }
  }

  const handleLogout = () => {
    console.log("로그아웃 처리")
    // TODO: 로그아웃 로직 구현
  }

  return (
    <AuthProvider>
      <RouterProvider router={createRoutes()} />
    </AuthProvider>
  )
}
