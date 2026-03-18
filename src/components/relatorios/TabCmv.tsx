import { useState, useEffect } from 'react'
import { DateRange } from 'react-day-picker'
import { supabase } from '@/lib/supabase/client'
import { startOfDay, endOfDay } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/format'
import { Loader2, TrendingUp, DollarSign, Percent, PackageOpen } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export function TabCmv({ date }: { date: DateRange | undefined }) {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({
    totalRevenue: 0,
    totalCost: 0,
    margin: 0,
    totalItemsSold: 0,
    topSellers: [] as any[],
  })

  useEffect(() => {
    async function fetchCmv() {
      if (!date?.from || !date?.to) return
      setLoading(true)

      const startIso = startOfDay(date.from).toISOString()
      const endIso = endOfDay(date.to).toISOString()

      const { data: vendas } = await supabase
        .from('vendas')
        .select('id, total')
        .gte('data', startIso)
        .lte('data', endIso)

      const vendaIds = (vendas || []).map((v) => v.id)
      let itens: any[] = []

      if (vendaIds.length > 0) {
        const { data: itensData } = await supabase
          .from('itens_venda')
          .select('quantidade, preco_unitario, produtos(nome, preco_custo)')
          .in('venda_id', vendaIds)
        itens = itensData || []
      }

      const totalRevenue = (vendas || []).reduce((sum, v) => sum + Number(v.total), 0)

      let totalCost = 0
      let totalItemsSold = 0
      const prodMap = new Map()

      itens.forEach((item) => {
        const cost = Number(item.produtos?.preco_custo || 0)
        const qty = item.quantidade
        totalCost += cost * qty
        totalItemsSold += qty

        const nome = item.produtos?.nome || 'Desconhecido'
        if (!prodMap.has(nome)) {
          prodMap.set(nome, { nome, qty: 0, revenue: 0, cost: 0 })
        }
        const p = prodMap.get(nome)
        p.qty += qty
        p.revenue += qty * Number(item.preco_unitario)
        p.cost += qty * cost
      })

      const profit = totalRevenue - totalCost
      const margin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0

      const topSellers = Array.from(prodMap.values())
        .sort((a, b) => b.qty - a.qty)
        .slice(0, 5)

      setData({ totalRevenue, totalCost, margin, totalItemsSold, topSellers })
      setLoading(false)
    }

    fetchCmv()
  }, [date])

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Faturamento (Vendas)
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {formatCurrency(data.totalRevenue)}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Custo (CMV)</CardTitle>
            <DollarSign className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {formatCurrency(data.totalCost)}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Margem de Lucro
            </CardTitle>
            <Percent className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{data.margin.toFixed(2)}%</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Itens Vendidos
            </CardTitle>
            <PackageOpen className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{data.totalItemsSold}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm bg-card">
        <CardHeader>
          <CardTitle className="text-lg">Top 5 Produtos por Margem (Período)</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead className="text-center">Qtd. Vendida</TableHead>
                <TableHead className="text-right">Custo Total</TableHead>
                <TableHead className="text-right">Receita Total</TableHead>
                <TableHead className="text-right">Lucro Bruto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.topSellers.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{item.nome}</TableCell>
                  <TableCell className="text-center">{item.qty}</TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {formatCurrency(item.cost)}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(item.revenue)}
                  </TableCell>
                  <TableCell className="text-right text-emerald-600 font-bold">
                    {formatCurrency(item.revenue - item.cost)}
                  </TableCell>
                </TableRow>
              ))}
              {data.topSellers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Nenhum dado encontrado.
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
