import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Moon, Sun } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { useTheme } from './ThemeProvider'

export function Header() {
  const location = useLocation()
  const { theme, setTheme } = useTheme()

  const getTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'CAIXA LIVRE - VENDA'
      case '/dashboard':
        return 'DASHBOARD GERENCIAL'
      case '/caixa':
        return 'FLUXO DE CAIXA'
      case '/clientes':
        return 'CLIENTES'
      case '/contas-receber':
        return 'CONTAS A RECEBER'
      case '/contas-pagar':
        return 'CONTAS A PAGAR'
      case '/estoque':
        return 'PRODUTOS E ESTOQUE'
      case '/relatorios':
        return 'RELATÓRIOS'
      default:
        return 'SISTEMA'
    }
  }

  return (
    <header className="h-16 bg-background border-b border-border flex items-center justify-between px-6 shrink-0 shadow-sm z-10 relative print:hidden">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-bold text-foreground tracking-tight">{getTitle()}</h1>
        <div className="h-6 w-[2px] bg-border hidden sm:block"></div>
        <div className="hidden sm:flex items-center gap-2 bg-muted px-3 py-1 rounded-full border border-border">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            SAT Disponível
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative w-72 hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar produto em todo o sistema..."
            className="pl-9 bg-muted border-border h-9"
          />
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="text-foreground"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
      </div>
    </header>
  )
}
