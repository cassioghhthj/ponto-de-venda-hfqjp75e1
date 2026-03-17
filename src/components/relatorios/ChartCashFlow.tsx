import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'

interface Props {
  data: { data: string; entradas: number; saidas: number }[]
}

const config = {
  entradas: { label: 'Entradas', color: 'hsl(var(--chart-2))' },
  saidas: { label: 'Saídas', color: 'hsl(var(--destructive))' },
} satisfies ChartConfig

export function ChartCashFlow({ data }: Props) {
  return (
    <Card className="shadow-sm border-border bg-card">
      <CardHeader>
        <CardTitle className="text-lg">Fluxo de Caixa (Entradas vs Saídas)</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="h-[250px] flex items-center justify-center text-muted-foreground">
            Sem movimentações no período.
          </div>
        ) : (
          <ChartContainer config={config} className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorEntradas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-entradas)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-entradas)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorSaidas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-saidas)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-saidas)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="data"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="entradas"
                  stroke="var(--color-entradas)"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorEntradas)"
                />
                <Area
                  type="monotone"
                  dataKey="saidas"
                  stroke="var(--color-saidas)"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorSaidas)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
