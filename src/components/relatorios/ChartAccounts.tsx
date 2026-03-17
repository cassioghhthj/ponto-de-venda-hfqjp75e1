import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts'
import { formatCurrency } from '@/lib/format'

interface Props {
  data: { name: string; a_receber: number; a_pagar: number }[]
}

const config = {
  a_receber: { label: 'A Receber', color: 'hsl(var(--chart-2))' },
  a_pagar: { label: 'A Pagar', color: 'hsl(var(--destructive))' },
} satisfies ChartConfig

export function ChartAccounts({ data }: Props) {
  const isEmpty = data.every((d) => d.a_receber === 0 && d.a_pagar === 0)

  return (
    <Card className="shadow-sm border-border bg-card">
      <CardHeader>
        <CardTitle className="text-lg">Comparativo de Contas (Pendentes)</CardTitle>
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <div className="h-[250px] flex items-center justify-center text-muted-foreground">
            Nenhuma conta pendente no período.
          </div>
        ) : (
          <ChartContainer config={config} className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} hide />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  tickFormatter={(val) => `R$ ${val}`}
                />
                <ChartTooltip
                  content={<ChartTooltipContent formatter={(v: number) => formatCurrency(v)} />}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Bar
                  dataKey="a_receber"
                  name="A Receber"
                  fill="var(--color-a_receber)"
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                />
                <Bar
                  dataKey="a_pagar"
                  name="A Pagar"
                  fill="var(--color-a_pagar)"
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
