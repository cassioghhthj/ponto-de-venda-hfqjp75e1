import { useReports } from '@/hooks/use-reports'
import { DateRange } from 'react-day-picker'
import { Loader2 } from 'lucide-react'
import { RelatoriosKPIs } from './RelatoriosKPIs'
import { ChartTopProducts } from './ChartTopProducts'
import { ChartCategories } from './ChartCategories'
import { ChartCashFlow } from './ChartCashFlow'
import { ChartAccounts } from './ChartAccounts'
import { TableCriticalStock } from './TableCriticalStock'

export function TabVisaoGeral({ date }: { date: DateRange | undefined }) {
  const { kpis, topProducts, topCategories, cashFlow, accounts, criticalStock, loading } =
    useReports(date)

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <RelatoriosKPIs {...kpis} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartTopProducts data={topProducts} />
        <ChartCategories data={topCategories} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCashFlow data={cashFlow} />
        <ChartAccounts data={accounts} />
      </div>

      <TableCriticalStock data={criticalStock} />
    </div>
  )
}
