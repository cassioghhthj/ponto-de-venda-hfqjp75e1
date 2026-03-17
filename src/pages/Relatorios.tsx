import { useState } from 'react'
import { DateRange } from 'react-day-picker'
import { subDays } from 'date-fns'
import { DatePickerWithRange } from '@/components/ui/date-range-picker'
import { useReports } from '@/hooks/use-reports'
import { Loader2, PieChart } from 'lucide-react'
import { RelatoriosKPIs } from '@/components/relatorios/RelatoriosKPIs'
import { ChartTopProducts } from '@/components/relatorios/ChartTopProducts'
import { ChartCategories } from '@/components/relatorios/ChartCategories'
import { ChartCashFlow } from '@/components/relatorios/ChartCashFlow'
import { ChartAccounts } from '@/components/relatorios/ChartAccounts'
import { TableCriticalStock } from '@/components/relatorios/TableCriticalStock'

export default function Relatorios() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  })

  const { kpis, topProducts, topCategories, cashFlow, accounts, criticalStock, loading } =
    useReports(date)

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <PieChart className="h-6 w-6 text-primary" />
            Relatórios Gerenciais
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Acompanhe o desempenho do negócio e a saúde financeira.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-600">Período:</span>
          <DatePickerWithRange date={date} setDate={setDate} />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
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
      )}
    </div>
  )
}
