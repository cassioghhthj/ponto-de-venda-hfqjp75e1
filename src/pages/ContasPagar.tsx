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
import { Loader2, DollarSign, Wallet, Plus, Search } from 'lucide-react'

interface ContaPagar {
  id: string
  descricao: string
  valor: number
  data_vencimento: string
  categoria: string | null
  status: string
  data_pagamento: string | null
  fornecedor: string | null
}

export default function ContasPagar() {
  const [contas, setContas] = useState<ContaPagar[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('Todos')
  const [searchCategoria, setSearchCategoria] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [payingId, setPayingId] = useState<string | null>(null)

  const [form, setForm] = useState({
    descricao: '',
    valor: '',
    data_vencimento: new Date().toISOString().split('T')[0],
    categoria: '',
    fornecedor: '',
  })

  const fetchContas = async () => {
    setLoading(true)
    const { data, error } = await (supabase as any)
      .from('contas_pagar')
      .select('*')
      .order('data_vencimento', { ascending: true })
    if (error)
      toast({ title: 'Erro', description: 'Erro ao carregar contas.', variant: 'destructive' })
    else setContas((data || []) as ContaPagar[])
    setLoading(false)
  }

  useEffect(() => {
    fetchContas()
  }, [])

  const handlePay = async (id: string) => {
    setPayingId(id)
    const { error } = await (supabase as any)
      .from('contas_pagar')
      .update({ status: 'pago', data_pagamento: new Date().toISOString() })
      .eq('id', id)
    setPayingId(null)
    if (error)
      toast({ title: 'Erro', description: 'Erro ao registrar pagamento.', variant: 'destructive' })
    else {
      toast({ title: 'Sucesso', description: 'Pagamento registrado com sucesso!' })
      fetchContas()
    }
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    const { error } = await (supabase as any).from('contas_pagar').insert({
      descricao: form.descricao,
      valor: parseFloat(form.valor),
      data_vencimento: new Date(form.data_vencimento).toISOString(),
      categoria: form.categoria || null,
      fornecedor: form.fornecedor || null,
      status: 'pendente',
    })
    setSubmitting(false)
    if (error)
      toast({ title: 'Erro', description: 'Erro ao adicionar despesa.', variant: 'destructive' })
    else {
      toast({ title: 'Sucesso', description: 'Despesa adicionada com sucesso!' })
      setIsModalOpen(false)
      setForm({
        descricao: '',
        valor: '',
        data_vencimento: new Date().toISOString().split('T')[0],
        categoria: '',
        fornecedor: '',
      })
      fetchContas()
    }
  }

  const filteredContas = contas.filter((c) => {
    const matchStatus =
      filter === 'Todos' ||
      (filter === 'Pendentes' && c.status === 'pendente') ||
      (filter === 'Pagos' && c.status === 'pago')
    const matchCat =
      !searchCategoria || c.categoria?.toLowerCase().includes(searchCategoria.toLowerCase())
    return matchStatus && matchCat
  })

  const totalAPagar = contas
    .filter((c) => c.status === 'pendente')
    .reduce((acc, curr) => acc + Number(curr.valor), 0)
  const totalPago = contas
    .filter((c) => c.status === 'pago')
    .reduce((acc, curr) => acc + Number(curr.valor), 0)

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto h-full flex flex-col">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 shrink-0">
        <Card className="shadow-sm border-red-100 bg-red-50/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-red-800">Total a Pagar</CardTitle>
            <DollarSign className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-900">{formatCurrency(totalAPagar)}</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-emerald-100 bg-emerald-50/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-emerald-800">Total Pago</CardTitle>
            <Wallet className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-900">{formatCurrency(totalPago)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div className="flex items-center gap-4">
          <Tabs value={filter} onValueChange={setFilter}>
            <TabsList>
              <TabsTrigger value="Todos">Todos</TabsTrigger>
              <TabsTrigger value="Pendentes">Pendentes</TabsTrigger>
              <TabsTrigger value="Pagos">Pagos</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="relative w-48">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Filtrar categoria"
              className="pl-8 h-9"
              value={searchCategoria}
              onChange={(e) => setSearchCategoria(e.target.value)}
            />
          </div>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Nova Despesa
        </Button>
      </div>

      <Card className="shadow-sm border-slate-200 flex-1 flex flex-col min-h-0">
        <CardContent className="p-0 flex-1 overflow-auto">
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader className="sticky top-0 bg-white z-10 shadow-sm">
                <TableRow>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContas.map((conta) => (
                  <TableRow key={conta.id}>
                    <TableCell className="font-medium">{conta.descricao}</TableCell>
                    <TableCell>{conta.fornecedor || '-'}</TableCell>
                    <TableCell>
                      {new Date(conta.data_vencimento).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>{conta.categoria || '-'}</TableCell>
                    <TableCell className="font-semibold">{formatCurrency(conta.valor)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={conta.status === 'pago' ? 'default' : 'secondary'}
                        className={
                          conta.status === 'pago'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
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
                          onClick={() => handlePay(conta.id)}
                          disabled={payingId === conta.id}
                        >
                          {payingId === conta.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            'Pagar'
                          )}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {filteredContas.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Nenhuma despesa encontrada.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adicionar Nova Despesa</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAdd} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Descrição *</Label>
              <Input
                required
                value={form.descricao}
                onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Valor *</Label>
                <Input
                  type="number"
                  step="0.01"
                  required
                  value={form.valor}
                  onChange={(e) => setForm({ ...form, valor: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Vencimento *</Label>
                <Input
                  type="date"
                  required
                  value={form.data_vencimento}
                  onChange={(e) => setForm({ ...form, data_vencimento: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Categoria</Label>
                <Input
                  placeholder="Ex: Energia"
                  value={form.categoria}
                  onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Fornecedor</Label>
                <Input
                  placeholder="Ex: Enel"
                  value={form.fornecedor}
                  onChange={(e) => setForm({ ...form, fornecedor: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null} Salvar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
