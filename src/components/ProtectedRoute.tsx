import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Loader2 } from 'lucide-react'

export function ProtectedRoute() {
  const { session, loading, userProfile } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 text-slate-500">
        <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
        <p className="text-sm font-medium">Verificando autenticação...</p>
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  // Verifica permissões de acesso baseadas no perfil do usuário
  if (userProfile && userProfile.role !== 'admin') {
    const path = location.pathname
    const perms = userProfile.permissions || {}

    let hasAccess = true

    if (path === '/' && !perms.pdv) hasAccess = false
    else if (path === '/dashboard' && !perms.dashboard) hasAccess = false
    else if (path === '/estoque' && !perms.estoque) hasAccess = false
    else if (path === '/clientes' && !perms.clientes) hasAccess = false
    else if (path === '/contas-receber' && !perms.contas_receber) hasAccess = false
    else if (path === '/contas-pagar' && !perms.contas_pagar) hasAccess = false
    else if (path === '/caixa' && !perms.caixa) hasAccess = false
    else if (path === '/relatorios' && !perms.relatorios) hasAccess = false
    else if (path === '/usuarios') hasAccess = false // Somente admin

    if (!hasAccess) {
      // Tenta redirecionar para a primeira tela acessível do usuário
      if (path !== '/' && perms.pdv) return <Navigate to="/" replace />
      if (path !== '/dashboard' && perms.dashboard) return <Navigate to="/dashboard" replace />
      if (path !== '/caixa' && perms.caixa) return <Navigate to="/caixa" replace />
      if (path !== '/estoque' && perms.estoque) return <Navigate to="/estoque" replace />

      return (
        <div className="flex h-[80vh] items-center justify-center bg-transparent">
          <div className="text-center p-8 bg-card rounded-2xl shadow-sm border border-border max-w-sm">
            <h2 className="text-xl font-bold text-foreground mb-2">Acesso Restrito</h2>
            <p className="text-muted-foreground mb-4">
              Você não tem permissão para acessar esta área do sistema.
            </p>
            <p className="text-sm text-muted-foreground/80 border-t border-border pt-4">
              Contate o administrador para solicitar acesso.
            </p>
          </div>
        </div>
      )
    }
  }

  return <Outlet />
}
