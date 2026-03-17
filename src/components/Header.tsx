import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { useLocation } from 'react-router-dom'

export function Header() {
  const location = useLocation()

  const getTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'CAIXA LIVRE - VENDA'
      case '/dashboard':
        return 'DASHBOARD GERENCIAL'
      default:
        return 'SISTEMA'
    }
  }

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6 shrink-0 shadow-sm z-10 relative">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-bold text-slate-800 tracking-tight">{getTitle()}</h1>
        <div className="h-6 w-[2px] bg-slate-200 hidden sm:block"></div>
        <div className="hidden sm:flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full border">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-xs font-semibold text-emerald-700">SAT Disponível</span>
        </div>
      </div>

      <div className="relative w-72 hidden md:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar produto em todo o sistema..."
          className="pl-9 bg-slate-50 border-slate-200 h-9"
        />
      </div>
    </header>
  )
}
