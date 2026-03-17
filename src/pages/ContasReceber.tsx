import { useState, useEffect } from 'react'
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
import { Loader2, DollarSign, Wallet } from 'lucide-react'

interface ContaReceber {
  id: string
  venda_id: string
  valor: number
  data_vencimento: string
  status: string
  data_pagamento: string | null
  venda?: {
    data: string
  }
}

export default function ContasReceber() {
  const [contas, setContas] = useState<ContaReceber[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('Todos')

  const [payingConta, setPayingConta] = useState<ContaReceber | null>(null)
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0])
  const [submitting, setSubmitting] = useState(false)

  const fetchContas = async () => {
    setLoading(true)
    const { data, error } = await (supabase as any)
      .from('contas_receber')
      .select('*, venda:vendas(data)')
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
      toast({ title: 'Sucesso', description: 'Pagamento registrado com sucesso!' })
      setPayingConta(null)
      fetchContas()
    }
  }

  const filteredContas = contas.filter((c) => {
    if (filter === 'Pendentes') return c.status === 'pendente'
    if (filter === 'Pagos') return c.status === 'pago'
    return true
  })

  const totalAReceber = contas
    .filter((c) => c.status === 'pendente')
    .reduce((acc, curr) => acc + Number(curr.valor), 0)
  const totalRecebido = contas
    .filter((c) => c.status === 'pago')
    .reduce((acc, curr) => acc + Number(curr.valor), 0)

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto h-full flex flex-col">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 shrink-0">
        <Card className="shadow-sm border-orange-200 dark:border-orange-900 bg-orange-50/30 dark:bg-orange-950/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-orange-800 dark:text-orange-400">
              Total a Receber
            </CardTitle>
            <DollarSign className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-900 dark:text-orange-300">
              {formatCurrency(totalAReceber)}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-emerald-200 dark:border-emerald-900 bg-emerald-50/30 dark:bg-emerald-950/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-emerald-800 dark:text-emerald-400">
              Total Recebido
            </CardTitle>
            <Wallet className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-900 dark:text-emerald-300">
              {formatCurrency(totalRecebido)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList>
            <TabsTrigger value="Todos">Todos</TabsTrigger>
            <TabsTrigger value="Pendentes">Pendentes</TabsTrigger>
            <TabsTrigger value="Pagos">Pagos</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Card className="shadow-sm border-border flex-1 flex flex-col min-h-0 bg-card">
        <CardContent className="p-0 flex-1 overflow-auto">
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader className="sticky top-0 bg-muted/80 z-10 backdrop-blur-md">
                <TableRow>
                  <TableHead>ID Venda</TableHead>
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
                    <TableCell className="font-mono text-xs">
                      {conta.venda_id.split('-')[0]}
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
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300 border-0'
                            : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300 border-0'
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
