import { useState, useMemo } from 'react'
import { CaixaRecord, MovimentacaoCaixa } from '@/types/caixa'
import { formatCurrency } from '@/lib/format'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Wallet, TrendingUp, ArrowDownRight, CheckSquare, Plus } from 'lucide-react'

interface Props {
  caixa: CaixaRecord
  movements: MovimentacaoCaixa[]
  sales: any[]
  onFechar: (saldoFinal: number) => Promise<void>
  onNovaMov: (tipo: string, valor: number, descricao: string) => Promise<void>
}

export default function CaixaAberto({ caixa, movements, sales, onFechar, onNovaMov }: Props) {
  const [movOpen, setMovOpen] = useState(false)
  const [closeOpen, setCloseOpen] = useState(false)
  const [form, setForm] = useState({ tipo: 'entrada', valor: '', descricao: '' })

  const totals = useMemo(() => {
    const v = sales.reduce((acc, s) => acc + Number(s.total), 0)
    const e = movements
      .filter((m) => m.tipo === 'entrada')
      .reduce((acc, m) => acc + Number(m.valor), 0)
    const s = movements
      .filter((m) => m.tipo === 'saida')
      .reduce((acc, m) => acc + Number(m.valor), 0)
    const atual = Number(caixa.saldo_inicial) + v + e - s
    return { vendas: v, entradas: e, saidas: s, atual }
  }, [caixa, movements, sales])

  const handleMov = async () => {
    if (!form.valor || !form.descricao) return
    await onNovaMov(form.tipo, Number(form.valor), form.descricao)
    setMovOpen(false)
    setForm({ tipo: 'entrada', valor: '', descricao: '' })
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-200">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-slate-500">Saldo Inicial</CardTitle>
            <Wallet className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(Number(caixa.saldo_inicial))}</div>
          </CardContent>
        </Card>
        <Card className="border-blue-100 bg-blue-50/30">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-blue-700">Vendas (Sessão)</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{formatCurrency(totals.vendas)}</div>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-slate-500">
              Movimentações Manuais
            </CardTitle>
            <ArrowDownRight className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-sm text-emerald-600 font-medium">
              +{formatCurrency(totals.entradas)} (Entradas)
            </div>
            <div className="text-sm text-red-600 font-medium">
              -{formatCurrency(totals.saidas)} (Saídas)
            </div>
          </CardContent>
        </Card>
        <Card className="border-emerald-200 bg-emerald-50 shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold text-emerald-800">
              Saldo Atual (Gaveta)
            </CardTitle>
            <CheckSquare className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-emerald-900">
              {formatCurrency(totals.atual)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={() => setMovOpen(true)} variant="outline" className="bg-white">
          <Plus className="mr-2 h-4 w-4" /> Nova Movimentação
        </Button>
        <Button onClick={() => setCloseOpen(true)} variant="destructive">
          Fechar Caixa
        </Button>
      </div>

      <Tabs defaultValue="vendas">
        <TabsList>
          <TabsTrigger value="vendas">Vendas ({sales.length})</TabsTrigger>
          <TabsTrigger value="movimentacoes">Movimentações ({movements.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="vendas" className="mt-4 border rounded-lg bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hora</TableHead>
                <TableHead>ID Venda</TableHead>
                <TableHead>Método</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>{new Date(s.data).toLocaleTimeString('pt-BR')}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {s.id.split('-')[0]}
                  </TableCell>
                  <TableCell>{s.metodo_pagamento}</TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatCurrency(s.total)}
                  </TableCell>
                </TableRow>
              ))}
              {sales.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                    Nenhuma venda registrada nesta sessão.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TabsContent>
        <TabsContent
          value="movimentacoes"
          className="mt-4 border rounded-lg bg-card overflow-hidden"
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hora</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {movements.map((m) => (
                <TableRow key={m.id}>
                  <TableCell>{new Date(m.data).toLocaleTimeString('pt-BR')}</TableCell>
                  <TableCell>
                    <Badge
                      variant={m.tipo === 'entrada' ? 'default' : 'destructive'}
                      className={
                        m.tipo === 'entrada'
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : ''
                      }
                    >
                      {m.tipo === 'entrada' ? 'Entrada' : 'Saída'}
                    </Badge>
                  </TableCell>
                  <TableCell>{m.descricao}</TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatCurrency(m.valor)}
                  </TableCell>
                </TableRow>
              ))}
              {movements.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                    Nenhuma movimentação manual registrada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>

      <Dialog open={movOpen} onOpenChange={setMovOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Movimentação de Caixa</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select value={form.tipo} onValueChange={(v) => setForm({ ...form, tipo: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entrada">Entrada (Suprimento)</SelectItem>
                    <SelectItem value="saida">Saída (Sangria)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Valor</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={form.valor}
                  onChange={(e) => setForm({ ...form, valor: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Input
                value={form.descricao}
                onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                placeholder="Ex: Reforço de troco, Pagamento de água"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMovOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleMov}>Registrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={closeOpen} onOpenChange={setCloseOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Fechamento de Caixa</DialogTitle>
          </DialogHeader>
          <div className="py-6 text-center space-y-2">
            <p className="text-slate-500">O saldo atual calculado para gaveta é de:</p>
            <p className="text-4xl font-bold text-emerald-700">{formatCurrency(totals.atual)}</p>
            <p className="text-sm text-slate-400 mt-4">
              Confira se os valores físicos em gaveta batem com o saldo acima antes de confirmar o
              fechamento.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCloseOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={() => onFechar(totals.atual)}>
              Confirmar Fechamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
