import { useState } from "react"
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom"
import { AppProvider, useStores } from "./store"
import { AuthPage } from "./features/auth/pages/AuthPage"
import { StoreOnboarding } from "./features/store/pages/StoreOnboarding"
import { WorkspaceShell } from "./components/layout/WorkspaceShell"

type AuthMode = "login" | "signup"

function AppRoutes() {
    const navigate = useNavigate()
    const { stores, selectedStoreId, setSelectedStoreId, addStore, clearStores, initializeStores } = useStores()
    const [initialStoreStep, setInitialStoreStep] = useState(1)

    const handleAddStore = (newStore: Parameters<typeof addStore>[0]) => {
        addStore(newStore)
        navigate("/dashboard")
    }

    const logout = () => {
        clearStores()
        navigate("/login")
    }

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
        onLogout: logout,
    }

    return (
        <Routes>
            <Route path="/" element={<Navigate to={homeDestination} replace />} />
            <Route
                path="/login"
                element={
                    <AuthPage
                        initialMode="login"
                        onLogin={() => {
                            if (stores.length === 0) {
                                initializeStores()
                            }
                            navigate("/dashboard")
                        }}
                        onSignup={() => {
                            clearStores()
                            navigate("/stores/new")
                        }}
                        onModeChange={(mode) => navigate(mode === "signup" ? "/signup" : "/login")}
                    />
                }
            />
            <Route
                path="/signup"
                element={
                    <AuthPage
                        initialMode="signup"
                        onLogin={() => navigate("/dashboard")}
                        onSignup={() => {
                            clearStores()
                            navigate("/stores/new")
                        }}
                        onModeChange={(mode: AuthMode) => navigate(mode === "signup" ? "/signup" : "/login")}
                    />
                }
            />
            <Route
                path="/stores/new"
                element={
                    <StoreOnboarding
                        initialStep={initialStoreStep}
                        onComplete={handleAddStore}
                        onCancel={stores.length > 0 ? () => navigate("/dashboard") : undefined}
                    />
                }
            />
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
