import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Store,
  LogOut,
  ReceiptText,
  CreditCard,
  Calculator,
  Users,
  PieChart,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'

export function AppSidebar() {
  const location = useLocation()
  const { signOut, user } = useAuth()

  const links = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/', icon: ShoppingCart, label: 'Vendas (PDV)' },
    { to: '/estoque', icon: Package, label: 'Produtos e Estoque' },
    { to: '/clientes', icon: Users, label: 'Clientes' },
    { to: '/contas-receber', icon: ReceiptText, label: 'Contas a Receber' },
    { to: '/contas-pagar', icon: CreditCard, label: 'Contas a Pagar' },
    { to: '/caixa', icon: Calculator, label: 'Caixa' },
    { to: '/relatorios', icon: PieChart, label: 'Relatórios' },
  ]

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border text-sidebar-foreground flex flex-col shrink-0 h-full">
      <div className="h-16 flex items-center px-6 border-b border-sidebar-border bg-sidebar">
        <Store className="h-6 w-6 text-primary mr-3" />
        <span className="font-bold text-lg tracking-wider">NEXUS PDV</span>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {links.map((link) => (
          <Link
            key={link.label}
            to={link.to}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
              location.pathname === link.to
                ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                : 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground/80',
            )}
          >
            <link.icon className="h-5 w-5" />
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-sidebar-border m-3 rounded-lg bg-sidebar-accent/50 shrink-0">
        <div className="text-xs font-semibold text-sidebar-foreground/60 mb-1">Operador Caixa</div>
        <div className="text-sm font-bold mb-4 truncate" title={user?.email || ''}>
          {user?.email || 'Usuário'}
        </div>
        <Button
          variant="destructive"
          className="w-full text-xs h-9 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground border-0"
          onClick={signOut}
        >
          <LogOut className="h-4 w-4 mr-2" /> Encerrar Sessão
        </Button>
      </div>
    </div>
  )
}
