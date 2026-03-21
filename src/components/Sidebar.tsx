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
import { useIsMobile } from '@/hooks/use-mobile'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'

export function AppSidebar() {
  const location = useLocation()
  const { signOut, user } = useAuth()
  const { collapsed, toggle, mobileOpen, setMobileOpen } = useSidebar()
  const isMobile = useIsMobile()

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

  const SidebarContent = () => (
    <>
      <div
        className={cn(
          'h-16 flex items-center border-b border-sidebar-border bg-sidebar overflow-hidden shrink-0',
          collapsed && !isMobile ? 'px-0 justify-center' : 'px-6',
        )}
      >
        <Store
          className={cn('h-6 w-6 text-primary shrink-0', (!collapsed || isMobile) && 'mr-3')}
        />
        {(!collapsed || isMobile) && (
          <span className="font-bold text-lg tracking-wider truncate">CHARME PDV</span>
        )}
      </div>

      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto overflow-x-hidden min-h-0">
        {links.map((link) => (
          <Link
            key={link.label}
            to={link.to}
            onClick={() => isMobile && setMobileOpen(false)}
            title={collapsed && !isMobile ? link.label : undefined}
            className={cn(
              'flex items-center gap-3 py-3 rounded-lg text-sm font-medium transition-colors',
              collapsed && !isMobile ? 'justify-center px-0' : 'px-4',
              location.pathname === link.to
                ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                : 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground/80',
            )}
          >
            <link.icon className="h-5 w-5 shrink-0" />
            {(!collapsed || isMobile) && <span className="truncate">{link.label}</span>}
          </Link>
        ))}
      </nav>

      <div
        className={cn(
          'p-4 border-t border-sidebar-border m-3 rounded-lg bg-sidebar-accent/50 shrink-0 overflow-hidden transition-all',
          collapsed && !isMobile ? 'p-2 flex flex-col items-center gap-2' : '',
        )}
      >
        {(!collapsed || isMobile) && (
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
            collapsed && !isMobile ? 'h-10 w-10 p-0 rounded-full' : 'w-full text-xs h-9',
          )}
          onClick={signOut}
          title={collapsed && !isMobile ? 'Sair' : undefined}
        >
          <LogOut className={cn(collapsed && !isMobile ? 'h-5 w-5' : 'h-4 w-4 mr-2')} />
          {(!collapsed || isMobile) && <span>Encerrar Sessão</span>}
        </Button>
      </div>
    </>
  )

  if (isMobile) {
    return (
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          className="p-0 w-72 bg-sidebar border-r-0 flex flex-col [&>button]:text-sidebar-foreground"
        >
          <SheetTitle className="sr-only">Navegação Principal</SheetTitle>
          <SidebarContent />
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <div
      className={cn(
        'bg-sidebar border-r border-sidebar-border text-sidebar-foreground flex flex-col shrink-0 h-full transition-all duration-300 relative print:hidden',
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

      <SidebarContent />
    </div>
  )
}
