import { useState } from 'react'
import { DateRange } from 'react-day-picker'
import { subDays } from 'date-fns'
import { DatePickerWithRange } from '@/components/ui/date-range-picker'
import { PieChart, Tags, Activity } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { TabVisaoGeral } from '@/components/relatorios/TabVisaoGeral'
import { TabCmv } from '@/components/relatorios/TabCmv'
import { TabEtiquetas } from '@/components/relatorios/TabEtiquetas'

export default function Relatorios() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  })

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto pb-10 flex flex-col h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <PieChart className="h-6 w-6 text-primary" />
            Relatórios e Análises
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Acompanhe o desempenho do negócio e a saúde financeira.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Período:</span>
          <DatePickerWithRange date={date} setDate={setDate} />
        </div>
      </div>

      <Tabs defaultValue="geral" className="flex-1 flex flex-col min-h-0">
        <TabsList className="shrink-0 w-fit mb-4">
          <TabsTrigger value="geral" className="gap-2">
            <PieChart className="h-4 w-4" /> Visão Geral
          </TabsTrigger>
          <TabsTrigger value="cmv" className="gap-2">
            <Activity className="h-4 w-4" /> Relatório CMV
          </TabsTrigger>
          <TabsTrigger value="etiquetas" className="gap-2">
            <Tags className="h-4 w-4" /> Etiquetas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="geral" className="flex-1 focus-visible:outline-none">
          <TabVisaoGeral date={date} />
        </TabsContent>

        <TabsContent value="cmv" className="flex-1 focus-visible:outline-none">
          <TabCmv date={date} />
        </TabsContent>

        <TabsContent value="etiquetas" className="flex-1 focus-visible:outline-none">
          <TabEtiquetas />
        </TabsContent>
      </Tabs>
    </div>
  )
}
