import { Navigate, Route, Routes } from 'react-router-dom'
import { Bot, Cpu, Settings } from 'lucide-react'
import { Layout } from '@/components/layout/Layout'
import { DashboardPage } from '@/pages/DashboardPage'
import { AlertsPage } from '@/pages/AlertsPage'
import { IncidentsPage } from '@/pages/IncidentsPage'
import { SearchPage } from '@/pages/SearchPage'
import { DetectionPage } from '@/pages/DetectionPage'
import { AssetsPage } from '@/pages/AssetsPage'
import { AuditLogsPage } from '@/pages/AuditLogsPage'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { useAuthStore } from '@/store/authStore'

function RequireAuth() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return isAuthenticated ? <Layout /> : <Navigate to="/login" replace />
}

function RequireAdmin({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user)
  return user?.role === 'admin' ? <>{children}</> : <Navigate to="/dashboard" replace />
}

function ModulePlaceholder({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType
  title: string
  description: string
}) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="max-w-xl text-center">
        <div className="w-14 h-14 mx-auto rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center">
          <Icon className="w-7 h-7 text-accent" />
        </div>
        <h2 className="text-xl font-semibold text-text-primary mt-5">{title}</h2>
        <p className="text-sm text-text-secondary mt-2 leading-6">{description}</p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<RequireAuth />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/alerts" element={<AlertsPage />} />
        <Route path="/incidents" element={<IncidentsPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/detection" element={<DetectionPage />} />
        <Route path="/assets" element={<AssetsPage />} />
        <Route
          path="/audit-logs"
          element={
            <RequireAdmin>
              <AuditLogsPage />
            </RequireAdmin>
          }
        />
        <Route
          path="/agents"
          element={
            <ModulePlaceholder
              icon={Cpu}
              title="Agent Fleet"
              description="Forwarder enrollment, health monitoring, policy groups, and offline buffering are represented in the guide. The backend agent APIs are wired; this screen is ready for the full fleet management UI."
            />
          }
        />
        <Route
          path="/ai"
          element={
            <ModulePlaceholder
              icon={Bot}
              title="AI SOC Assistant"
              description="Alert analysis, investigation chat, and query suggestions are exposed through the API. The assistant workspace can be expanded here without changing the app shell."
            />
          }
        />
        <Route
          path="/settings"
          element={
            <ModulePlaceholder
              icon={Settings}
              title="System Settings"
              description="Tenant settings, branding, licensing, and admin controls are part of the module roadmap. This page anchors those workflows in the running application."
            />
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
