import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { DateRange } from 'react-day-picker'
import { startOfDay, endOfDay, format } from 'date-fns'

export interface ReportData {
  kpis: { totalSales: number; avgTicket: number; salesCount: number }
  topProducts: { name: string; quantidade: number }[]
  topCategories: { name: string; value: number; fill: string }[]
  cashFlow: { data: string; entradas: number; saidas: number }[]
  accounts: { name: string; a_receber: number; a_pagar: number }[]
  criticalStock: any[]
  loading: boolean
}

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
]

export function useReports(dateRange: DateRange | undefined) {
  const [data, setData] = useState<ReportData>({
    kpis: { totalSales: 0, avgTicket: 0, salesCount: 0 },
    topProducts: [],
    topCategories: [],
    cashFlow: [],
    accounts: [],
    criticalStock: [],
    loading: true,
  })

  useEffect(() => {
    async function fetchData() {
      if (!dateRange?.from || !dateRange?.to) return
      setData((prev) => ({ ...prev, loading: true }))

      const startIso = startOfDay(dateRange.from).toISOString()
      const endIso = endOfDay(dateRange.to).toISOString()

      const [vendasRes, movsRes, crRes, cpRes, prodRes] = await Promise.all([
        supabase.from('vendas').select('id, total, data').gte('data', startIso).lte('data', endIso),
        supabase
          .from('movimentacoes_caixa')
          .select('tipo, valor, data')
          .gte('data', startIso)
          .lte('data', endIso),
        supabase
          .from('contas_receber')
          .select('valor')
          .eq('status', 'pendente')
          .gte('data_vencimento', startIso)
          .lte('data_vencimento', endIso),
        supabase
          .from('contas_pagar')
          .select('valor')
          .eq('status', 'pendente')
          .gte('data_vencimento', startIso)
          .lte('data_vencimento', endIso),
        supabase.from('produtos').select('*'),
      ])

      const vendas = vendasRes.data || []
      const vendaIds = vendas.map((v) => v.id)
      let itensVenda: any[] = []

      if (vendaIds.length > 0) {
        const { data: itens } = await supabase
          .from('itens_venda')
          .select('quantidade, preco_unitario, produtos(nome, categoria)')
          .in('venda_id', vendaIds)
        itensVenda = itens || []
      }

      const totalSales = vendas.reduce((sum, v) => sum + Number(v.total), 0)
      const salesCount = vendas.length
      const avgTicket = salesCount > 0 ? totalSales / salesCount : 0

      const prodMap = new Map()
      const catMap = new Map()
      itensVenda.forEach((i) => {
        const nome = i.produtos?.nome || 'Desconhecido'
        const cat = i.produtos?.categoria || 'Outros'
        const qty = i.quantidade
        const val = qty * Number(i.preco_unitario)
        prodMap.set(nome, (prodMap.get(nome) || 0) + qty)
        catMap.set(cat, (catMap.get(cat) || 0) + val)
      })

      const topProducts = Array.from(prodMap.entries())
        .map(([name, quantidade]) => ({ name, quantidade }))
        .sort((a, b) => b.quantidade - a.quantidade)
        .slice(0, 5)
      const topCategories = Array.from(catMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, value], i) => ({ name, value, fill: COLORS[i % COLORS.length] }))

      const flowMap = new Map()
      ;(movsRes.data || []).forEach((m) => {
        const d = format(new Date(m.data), 'dd/MM')
        if (!flowMap.has(d)) flowMap.set(d, { data: d, entradas: 0, saidas: 0 })
        const entry = flowMap.get(d)
        if (m.tipo === 'entrada') entry.entradas += Number(m.valor)
        if (m.tipo === 'saida') entry.saidas += Number(m.valor)
      })
      const cashFlow = Array.from(flowMap.values())

      const aReceber = (crRes.data || []).reduce((acc, curr) => acc + Number(curr.valor), 0)
      const aPagar = (cpRes.data || []).reduce((acc, curr) => acc + Number(curr.valor), 0)
      const accounts = [{ name: 'Pendentes', a_receber: aReceber, a_pagar: aPagar }]

      const criticalStock = (prodRes.data || [])
        .filter((p) => p.estoque !== null && p.estoque <= p.estoque_minimo)
        .sort((a, b) => (a.estoque || 0) - (b.estoque || 0))

      setData({
        kpis: { totalSales, avgTicket, salesCount },
        topProducts,
        topCategories,
        cashFlow,
        accounts,
        criticalStock,
        loading: false,
      })
    }
    fetchData()
  }, [dateRange])

  return data
}
