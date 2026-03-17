import { useState, useEffect } from 'react'
import { formatCurrency } from '@/lib/format'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from 'recharts'
import { Banknote, ShoppingBag, TrendingUp, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { Transaction } from '@/types'

const chartConfigLine = {
  sales: { label: 'Vendas', color: 'hsl(var(--chart-1))' },
} satisfies ChartConfig
const chartConfigBar = {
  value: { label: 'Valor', color: 'hsl(var(--chart-2))' },
} satisfies ChartConfig

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [totalSales, setTotalSales] = useState(0)
  const [loading, setLoading] = useState(true)
  const [chartDataLine, setChartDataLine] = useState<any[]>([])
  const [chartDataBar, setChartDataBar] = useState<any[]>([])

  useEffect(() => {
    const fetchDashboardData = async () => {
      // Fetch latest 10 sales
      const { data: sales } = await supabase
        .from('vendas')
        .select('*')
        .order('data', { ascending: false })
        .limit(10)

      if (sales) {
        setTransactions(sales)
        const total = sales.reduce((acc, curr) => acc + Number(curr.total), 0)
        setTotalSales(total)
      }

      // Fetch all sales today for line chart
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const { data: todaySales } = await supabase
        .from('vendas')
        .select('data, total')
        .gte('data', today.toISOString())

      if (todaySales) {
        const hourlyMap = new Map()
        todaySales.forEach((s) => {
          const d = new Date(s.data)
          const hour = `${String(d.getHours()).padStart(2, '0')}:00`
          hourlyMap.set(hour, (hourlyMap.get(hour) || 0) + Number(s.total))
        })
        const lineData = Array.from(hourlyMap.entries())
          .map(([time, sales]) => ({ time, sales }))
          .sort((a, b) => a.time.localeCompare(b.time))
        setChartDataLine(lineData.length > 0 ? lineData : [{ time: '00:00', sales: 0 }])
      }

      // Fetch category data for bar chart
      const { data: itens } = await supabase
        .from('itens_venda')
        .select('quantidade, preco_unitario, produto:produtos(categoria)')

      if (itens) {
        const catMap = new Map()
        itens.forEach((i) => {
          const cat = i.produto?.categoria || 'Sem categoria'
          const val = Number(i.quantidade) * Number(i.preco_unitario)
          catMap.set(cat, (catMap.get(cat) || 0) + val)
        })
        const barData = Array.from(catMap.entries())
          .map(([category, value]) => ({ category, value }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 5)
        setChartDataBar(barData)
      }

      setLoading(false)
    }
    fetchDashboardData()
  }, [])

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Vendas Recentes
            </CardTitle>
            <Banknote className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              <>
                <div className="text-3xl font-bold">{formatCurrency(totalSales)}</div>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" /> Nas últimas 10 transações
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ticket Médio (Aprox)
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {transactions.length > 0
                ? formatCurrency(totalSales / transactions.length)
                : formatCurrency(0)}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Transações</CardTitle>
            <ShoppingBag className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{transactions.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Vendas por Hora (Hoje)</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfigLine} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartDataLine}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-sales)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--color-sales)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="time"
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
                    dataKey="sales"
                    stroke="var(--color-sales)"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorSales)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Vendas por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfigBar} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartDataBar}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  layout="vertical"
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={false}
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  />
                  <YAxis
                    dataKey="category"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--foreground))', fontSize: 12, fontWeight: 500 }}
                    width={100}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="value"
                    fill="var(--color-value)"
                    radius={[0, 4, 4, 0]}
                    barSize={24}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Últimas Transações Registradas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>ID</TableHead>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Método</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((trx) => (
                <TableRow key={trx.id}>
                  <TableCell className="font-medium font-mono text-xs">
                    {trx.id.split('-')[0]}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(trx.data).toLocaleString('pt-BR')}
                  </TableCell>
                  <TableCell>{trx.metodo_pagamento}</TableCell>
                  <TableCell>
                    <Badge
                      variant={trx.status === 'Concluído' ? 'default' : 'destructive'}
                      className={
                        trx.status === 'Concluído'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300 hover:bg-emerald-200 border-0'
                          : ''
                      }
                    >
                      {trx.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatCurrency(trx.total)}
                  </TableCell>
                </TableRow>
              ))}
              {transactions.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    Nenhuma transação encontrada no banco de dados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
