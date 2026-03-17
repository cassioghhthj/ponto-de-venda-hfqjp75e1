import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/format'
import { DollarSign, Receipt, TrendingUp } from 'lucide-react'

interface KPIsProps {
  totalSales: number
  avgTicket: number
  salesCount: number
}

export function RelatoriosKPIs({ totalSales, avgTicket, salesCount }: KPIsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="shadow-sm border-emerald-200 dark:border-emerald-900 bg-emerald-50/30 dark:bg-emerald-950/20">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-emerald-800 dark:text-emerald-400">
            Total em Vendas
          </CardTitle>
          <DollarSign className="h-4 w-4 text-emerald-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-emerald-900 dark:text-emerald-300">
            {formatCurrency(totalSales)}
          </div>
          <p className="text-xs text-emerald-600/80 dark:text-emerald-500 font-medium mt-1">
            No período selecionado
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-blue-200 dark:border-blue-900 bg-blue-50/30 dark:bg-blue-950/20">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-400">
            Ticket Médio
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-900 dark:text-blue-300">
            {formatCurrency(avgTicket)}
          </div>
          <p className="text-xs text-blue-600/80 dark:text-blue-500 font-medium mt-1">
            Baseado em {salesCount} vendas
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-sm bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Volume de Vendas
          </CardTitle>
          <Receipt className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-foreground">{salesCount}</div>
          <p className="text-xs text-muted-foreground mt-1">Operações concluídas</p>
        </CardContent>
      </Card>
    </div>
  )
}
