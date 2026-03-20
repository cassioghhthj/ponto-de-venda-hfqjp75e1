import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase/client'
import { formatCurrency } from '@/lib/format'
import { toast } from '@/hooks/use-toast'
import { Loader2, DollarSign, Wallet, FileText, Search, Users } from 'lucide-react'
import { PrintableReport } from '@/components/contas-receber/PrintableReport'

interface ContaReceber {
  id: string
  venda_id: string
  valor: number
  data_vencimento: string
  status: string
  data_pagamento: string | null
  venda?: { data: string }
  cliente?: { nome: string }
}

export default function ContasReceber() {
  const [contas, setContas] = useState<ContaReceber[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('Todos')
  const [clientSearch, setClientSearch] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const [payingConta, setPayingConta] = useState<ContaReceber | null>(null)
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0])
  const [submitting, setSubmitting] = useState(false)

  const fetchContas = async () => {
    setLoading(true)
    const { data, error } = await (supabase as any)
      .from('contas_receber')
      .select('*, venda:vendas(data), cliente:clientes(nome)')
      .order('data_vencimento', { ascending: true })
    if (error)
      toast({ title: 'Erro', description: 'Erro ao carregar contas.', variant: 'destructive' })
    else setContas((data || []) as ContaReceber[])
    setLoading(false)
  }

  useEffect(() => {
    fetchContas()
  }, [])

  const handlePay = async () => {
    if (!payingConta) return
    setSubmitting(true)
    const dateObj = new Date(paymentDate)
    dateObj.setHours(12, 0, 0, 0)
    const { error } = await (supabase as any)
      .from('contas_receber')
      .update({ status: 'pago', data_pagamento: dateObj.toISOString() })
      .eq('id', payingConta.id)
    setSubmitting(false)
    if (error)
      toast({ title: 'Erro', description: 'Erro ao registrar pagamento.', variant: 'destructive' })
    else {
      toast({ title: 'Sucesso', description: 'Pagamento registrado!' })
      setPayingConta(null)
      fetchContas()
    }
  }

  const filteredContas = contas.filter((c) => {
    const matchStatus =
      filter === 'Todos' ||
      (filter === 'Pendentes' && c.status === 'pendente') ||
      (filter === 'Pagos' && c.status === 'pago')
    const matchClient =
      !clientSearch || (c.cliente?.nome || '').toLowerCase().includes(clientSearch.toLowerCase())
    const matchDate =
      (!startDate || c.data_vencimento >= startDate) && (!endDate || c.data_vencimento <= endDate)
    return matchStatus && matchClient && matchDate
  })

  const totalAReceber = filteredContas
    .filter((c) => c.status === 'pendente')
    .reduce((acc, curr) => acc + Number(curr.valor), 0)
  const totalRecebido = filteredContas
    .filter((c) => c.status === 'pago')
    .reduce((acc, curr) => acc + Number(curr.valor), 0)

  const debtsByCustomer = useMemo(() => {
    const debts: Record<string, number> = {}
    filteredContas.forEach((c) => {
      if (c.status === 'pendente' && c.cliente?.nome) {
        debts[c.cliente.nome] = (debts[c.cliente.nome] || 0) + Number(c.valor)
      }
    })
    return Object.entries(debts)
      .map(([nome, valor]) => ({ nome, valor }))
      .sort((a, b) => b.valor - a.valor)
  }, [filteredContas])

  return (
    <div className="space-y-6 animate-fade-in max-w-[1400px] mx-auto h-full flex flex-col print:block print:h-auto print:max-w-none print:m-0 print:p-0 print:space-y-0">
      <PrintableReport
        contas={filteredContas}
        clientName={clientSearch}
        startDate={startDate}
        endDate={endDate}
      />

      <div className="print:hidden grid grid-cols-1 md:grid-cols-2 gap-6 shrink-0">
        <Card className="shadow-sm border-orange-200 bg-orange-50/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">
              Total a Receber (Filtrado)
            </CardTitle>
            <DollarSign className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-900">
              {formatCurrency(totalAReceber)}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-emerald-200 bg-emerald-50/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-emerald-800">
              Total Recebido (Filtrado)
            </CardTitle>
            <Wallet className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-900">
              {formatCurrency(totalRecebido)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="print:hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0 bg-muted/50 p-4 rounded-xl border border-border">
        <div className="flex flex-wrap gap-4 items-center w-full md:w-auto">
          <Tabs value={filter} onValueChange={setFilter}>
            <TabsList>
              <TabsTrigger value="Todos">Todos</TabsTrigger>
              <TabsTrigger value="Pendentes">Pendentes</TabsTrigger>
              <TabsTrigger value="Pagos">Pagos</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar cliente..."
              className="pl-9 bg-background h-9"
              value={clientSearch}
              onChange={(e) => setClientSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="date"
              className="h-9 w-auto text-sm"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              title="Data Inicial"
            />
            <span className="text-muted-foreground">até</span>
            <Input
              type="date"
              className="h-9 w-auto text-sm"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              title="Data Final"
            />
          </div>
        </div>
        <Button
          variant="outline"
          className="shrink-0 w-full md:w-auto bg-background"
          onClick={() => window.print()}
        >
          <FileText className="h-4 w-4 mr-2" /> Gerar Relatório PDF
        </Button>
      </div>

      <div className="print:hidden flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm border-border flex flex-col min-h-0 bg-card">
          <CardContent className="p-0 flex-1 overflow-auto">
            {loading ? (
              <div className="flex h-40 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <Table>
                <TableHeader className="sticky top-0 bg-muted/90 z-10 backdrop-blur-md">
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Data Venda</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContas.map((conta) => (
                    <TableRow key={conta.id}>
                      <TableCell className="font-medium text-foreground">
                        {conta.cliente?.nome || '-'}
                      </TableCell>
                      <TableCell>
                        {conta.venda?.data
                          ? new Date(conta.venda.data).toLocaleDateString('pt-BR')
                          : '-'}
                      </TableCell>
                      <TableCell>
                        {new Date(conta.data_vencimento).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="font-medium">{formatCurrency(conta.valor)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={conta.status === 'pago' ? 'default' : 'secondary'}
                          className={
                            conta.status === 'pago'
                              ? 'bg-emerald-100 text-emerald-800 border-0'
                              : 'bg-orange-100 text-orange-800 border-0'
                          }
                        >
                          {conta.status === 'pago' ? 'Pago' : 'Pendente'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {conta.status === 'pendente' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setPayingConta(conta)
                              setPaymentDate(new Date().toISOString().split('T')[0])
                            }}
                          >
                            Registrar Pagamento
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredContas.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        Nenhuma conta encontrada.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-1 shadow-sm border-border flex flex-col h-full bg-card max-h-[500px] lg:max-h-none">
          <CardHeader className="bg-muted/30 border-b border-border py-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" /> Resumo de Devedores
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto p-0">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10 shadow-sm">
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead className="text-right">Total Pendente</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {debtsByCustomer.map((d) => (
                  <TableRow key={d.nome}>
                    <TableCell className="font-medium text-sm">{d.nome}</TableCell>
                    <TableCell className="text-right font-bold text-orange-600 dark:text-orange-400">
                      {formatCurrency(d.valor)}
                    </TableCell>
                  </TableRow>
                ))}
                {debtsByCustomer.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center text-muted-foreground py-8">
                      Nenhuma dívida pendente.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!payingConta} onOpenChange={(open) => !open && setPayingConta(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Registrar Pagamento</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="data" className="text-right">
                Data
              </Label>
              <Input
                id="data"
                type="date"
                className="col-span-3"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPayingConta(null)} disabled={submitting}>
              Cancelar
            </Button>
            <Button onClick={handlePay} disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />} Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
