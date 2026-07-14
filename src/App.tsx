import { useState } from "react"
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom"
import { AppProvider, useStores, useSelectedStoreId, useSetSelectedStoreId } from "./store"
import { useExitApp } from "./hooks/useExitApp"
import { AuthPage } from "./features/auth/pages/AuthPage"
import { StoreOnboarding } from "./features/store/pages/StoreOnboarding"
import { OAuthCallbackPage } from "./features/integrations/pages/OAuthCallbackPage"
import { WorkspaceShell } from "./components/layout/WorkspaceShell"

type AuthMode = "login" | "signup"

function AppRoutes() {
    const navigate = useNavigate()
    const stores = useStores()
    const selectedStoreId = useSelectedStoreId()
    const setSelectedStoreId = useSetSelectedStoreId()
    const exitApp = useExitApp()
    const [initialStoreStep, setInitialStoreStep] = useState(1)

    // auth → app (after login)
    const enterApp = () => navigate("/dashboard")

    // auth → app (after signup: go to onboarding)
    const enterOnboarding = () => navigate("/stores/new")

    const hasStores = stores.length > 0
    const homeDestination = hasStores ? "/dashboard" : "/login"

    const workspaceProps = {
        stores,
        selectedStoreId,
        onSelectStore: setSelectedStoreId,
        onAddStore: () => {
            setInitialStoreStep(1)
            navigate("/stores/new")
        },
        onLogout: exitApp,
    }

    return (
        <Routes>
            <Route path="/" element={<Navigate to={homeDestination} replace />} />
            <Route
                path="/login"
                element={
                    <AuthPage
                        initialMode="login"
                        onLogin={enterApp}
                        onSignup={enterOnboarding}
                        onModeChange={(mode) => navigate(mode === "signup" ? "/signup" : "/login")}
                    />
                }
            />
            <Route
                path="/signup"
                element={
                    <AuthPage
                        initialMode="signup"
                        onLogin={enterApp}
                        onSignup={enterOnboarding}
                        onModeChange={(mode: AuthMode) => navigate(mode === "signup" ? "/signup" : "/login")}
                    />
                }
            />
            <Route
                path="/stores/new"
                element={
                    <StoreOnboarding
                        initialStep={initialStoreStep}
                        onComplete={enterApp}
                        onCancel={stores.length > 0 ? () => navigate("/dashboard") : undefined}
                    />
                }
            />
            <Route path="/integrations/oauth/callback" element={<OAuthCallbackPage />} />
            <Route path="/dashboard" element={<WorkspaceShell {...workspaceProps} />} />
            <Route path="/content" element={<WorkspaceShell {...workspaceProps} />} />
            <Route path="/reviews" element={<WorkspaceShell {...workspaceProps} />} />
            <Route path="/store" element={<WorkspaceShell {...workspaceProps} />} />
            <Route path="/account" element={<WorkspaceShell {...workspaceProps} />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    )
}

export default function App() {
    return (
        <BrowserRouter>
            <AppProvider>
                <AppRoutes />
            </AppProvider>
        </BrowserRouter>
    )
}
