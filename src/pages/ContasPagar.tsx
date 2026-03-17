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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase/client'
import { formatCurrency } from '@/lib/format'
import { toast } from '@/hooks/use-toast'
import { Loader2, DollarSign, Wallet, Plus, Search } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

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

const despesaSchema = z.object({
  descricao: z.string().min(2, 'Descrição obrigatória'),
  valor: z.coerce.number().min(0.01, 'Valor deve ser maior que zero'),
  data_vencimento: z.string().min(1, 'Data é obrigatória'),
  categoria: z.string().optional(),
  fornecedor: z.string().optional(),
})

export default function ContasPagar() {
  const [contas, setContas] = useState<ContaPagar[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('Todos')
  const [searchCategoria, setSearchCategoria] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [payingId, setPayingId] = useState<string | null>(null)

  const form = useForm<z.infer<typeof despesaSchema>>({
    resolver: zodResolver(despesaSchema),
    defaultValues: {
      descricao: '',
      valor: 0,
      data_vencimento: new Date().toISOString().split('T')[0],
      categoria: '',
      fornecedor: '',
    },
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
      toast({ title: 'Sucesso', description: 'Pagamento registrado!' })
      fetchContas()
    }
  }

  const onSubmit = async (data: z.infer<typeof despesaSchema>) => {
    const { error } = await (supabase as any).from('contas_pagar').insert({
      descricao: data.descricao,
      valor: data.valor,
      data_vencimento: new Date(data.data_vencimento).toISOString(),
      categoria: data.categoria || null,
      fornecedor: data.fornecedor || null,
      status: 'pendente',
    })
    if (error)
      toast({ title: 'Erro', description: 'Erro ao adicionar despesa.', variant: 'destructive' })
    else {
      toast({ title: 'Sucesso', description: 'Despesa adicionada com sucesso!' })
      setIsModalOpen(false)
      form.reset()
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

  const isSubmitting = form.formState.isSubmitting

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto h-full flex flex-col">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 shrink-0">
        <Card className="shadow-sm border-red-200 dark:border-red-900 bg-red-50/30 dark:bg-red-950/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-red-800 dark:text-red-400">
              Total a Pagar
            </CardTitle>
            <DollarSign className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-900 dark:text-red-300">
              {formatCurrency(totalAPagar)}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-emerald-200 dark:border-emerald-900 bg-emerald-50/30 dark:bg-emerald-950/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-emerald-800 dark:text-emerald-400">
              Total Pago
            </CardTitle>
            <Wallet className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-900 dark:text-emerald-300">
              {formatCurrency(totalPago)}
            </div>
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
              className="pl-8 h-9 bg-background"
              value={searchCategoria}
              onChange={(e) => setSearchCategoria(e.target.value)}
            />
          </div>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Nova Despesa
        </Button>
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
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
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
        <DialogContent className="sm:max-w-[425px] bg-card">
          <DialogHeader>
            <DialogTitle>Adicionar Nova Despesa</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
              <FormField
                control={form.control}
                name="descricao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="valor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor *</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="data_vencimento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vencimento *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="categoria"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Energia" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fornecedor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fornecedor</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Enel" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter className="pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />} Salvar
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
