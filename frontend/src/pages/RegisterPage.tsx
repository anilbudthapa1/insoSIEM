import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AlertCircle, Building2, Shield } from 'lucide-react'
import { authApi } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100)
}

export function RegisterPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [organizationName, setOrganizationName] = useState('')
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const organizationSlug = useMemo(() => slugify(organizationName), [organizationName])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!organizationName || !organizationSlug || !fullName || !username || !email || password.length < 12) {
      setError('Complete every field and use a password with at least 12 characters.')
      return
    }

    setLoading(true)
    setError(null)
    try {
      const response = await authApi.register({
        organization_name: organizationName,
        organization_slug: organizationSlug,
        full_name: fullName,
        username,
        email,
        password,
      })
      setAuth(response.user, response.access_token)
      navigate('/dashboard')
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ??
        'Registration failed. Check the details and try again.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div
        className="fixed inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(59,130,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.3) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/20 border border-accent/30 rounded-2xl mb-4">
            <Shield className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary">Create Inso Workspace</h1>
          <p className="text-text-muted mt-1 text-sm">Bootstrap your tenant and first administrator</p>
        </div>

        <div className="bg-surface border border-border rounded-xl shadow-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text-primary">Register workspace</h2>
              <p className="text-xs text-text-muted">The first user becomes the tenant administrator.</p>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 bg-red-900/30 border border-red-700/50 rounded-lg px-4 py-3 mb-5 text-sm text-red-300">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1.5">
                Organization
              </label>
              <input
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                className="input-dark w-full"
                placeholder="Acme Security Operations"
                disabled={loading}
              />
              {organizationSlug && <p className="text-xs text-text-muted mt-1">Workspace slug: {organizationSlug}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1.5">
                  Full Name
                </label>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="input-dark w-full"
                  placeholder="Anil Budthapa"
                  autoComplete="name"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1.5">
                  Username
                </label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input-dark w-full"
                  placeholder="anil"
                  autoComplete="username"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-dark w-full"
                placeholder="admin@company.com"
                autoComplete="email"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-dark w-full"
                placeholder="Minimum 12 characters"
                autoComplete="new-password"
                disabled={loading}
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-2.5">
              {loading ? (
                <>
                  <LoadingSpinner size="sm" />
                  Creating workspace...
                </>
              ) : (
                'Create Workspace'
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-border text-sm text-text-secondary">
            Already have an account?{' '}
            <Link to="/login" className="text-accent hover:text-accent-hover">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
