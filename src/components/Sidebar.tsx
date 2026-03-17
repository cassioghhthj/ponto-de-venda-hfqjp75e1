import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, ShoppingCart, Package, Settings, Store } from 'lucide-react'
import { cn } from '@/lib/utils'

export function AppSidebar() {
  const location = useLocation()

  const links = [
    { to: '/', icon: ShoppingCart, label: 'Vendas (PDV)' },
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '#', icon: Package, label: 'Produtos' },
    { to: '#', icon: Settings, label: 'Configurações' },
  ]

  return (
    <div className="w-64 bg-[#1E293B] text-slate-300 flex flex-col shrink-0 h-full">
      <div className="h-16 flex items-center px-6 border-b border-slate-700 bg-slate-900">
        <Store className="h-6 w-6 text-primary mr-3" />
        <span className="font-bold text-white text-lg tracking-wider">NEXUS PDV</span>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-1">
        {links.map((link) => (
          <Link
            key={link.label}
            to={link.to}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
              location.pathname === link.to
                ? 'bg-primary text-white shadow-md'
                : 'hover:bg-slate-800 hover:text-white',
            )}
          >
            <link.icon className="h-5 w-5" />
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700 m-3 rounded-lg bg-slate-800/50">
        <div className="text-xs font-semibold text-slate-400 mb-1">Operador Caixa</div>
        <div className="text-sm font-bold text-white">João Silva</div>
      </div>
    </div>
  )
}
