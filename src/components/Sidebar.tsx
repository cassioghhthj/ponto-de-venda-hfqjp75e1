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
  ChevronLeft,
  Menu,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { useSidebar } from '@/context/SidebarContext'

export function AppSidebar() {
  const location = useLocation()
  const { signOut, user } = useAuth()
  const { collapsed, toggle } = useSidebar()

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
    <div
      className={cn(
        'bg-sidebar border-r border-sidebar-border text-sidebar-foreground flex flex-col shrink-0 h-full transition-all duration-300 relative',
        collapsed ? 'w-20' : 'w-64',
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-4 top-4 bg-background border border-border shadow-sm rounded-full h-8 w-8 z-50 hidden sm:flex"
        onClick={toggle}
      >
        {collapsed ? <Menu className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>

      <div
        className={cn(
          'h-16 flex items-center border-b border-sidebar-border bg-sidebar overflow-hidden',
          collapsed ? 'px-0 justify-center' : 'px-6',
        )}
      >
        <Store className={cn('h-6 w-6 text-primary shrink-0', !collapsed && 'mr-3')} />
        {!collapsed && <span className="font-bold text-lg tracking-wider truncate">NEXUS PDV</span>}
      </div>

      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto overflow-x-hidden">
        {links.map((link) => (
          <Link
            key={link.label}
            to={link.to}
            title={collapsed ? link.label : undefined}
            className={cn(
              'flex items-center gap-3 py-3 rounded-lg text-sm font-medium transition-colors',
              collapsed ? 'justify-center px-0' : 'px-4',
              location.pathname === link.to
                ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                : 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground/80',
            )}
          >
            <link.icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span className="truncate">{link.label}</span>}
          </Link>
        ))}
      </nav>

      <div
        className={cn(
          'p-4 border-t border-sidebar-border m-3 rounded-lg bg-sidebar-accent/50 shrink-0 overflow-hidden transition-all',
          collapsed ? 'p-2 flex flex-col items-center gap-2' : '',
        )}
      >
        {!collapsed && (
          <>
            <div className="text-xs font-semibold text-sidebar-foreground/60 mb-1">
              Operador Caixa
            </div>
            <div className="text-sm font-bold mb-4 truncate" title={user?.email || ''}>
              {user?.email || 'Usuário'}
            </div>
          </>
        )}
        <Button
          variant="destructive"
          className={cn(
            'bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground border-0',
            collapsed ? 'h-10 w-10 p-0 rounded-full' : 'w-full text-xs h-9',
          )}
          onClick={signOut}
          title={collapsed ? 'Sair' : undefined}
        >
          <LogOut className={cn(collapsed ? 'h-5 w-5' : 'h-4 w-4 mr-2')} />
          {!collapsed && <span>Encerrar Sessão</span>}
        </Button>
      </div>
    </div>
  )
}
