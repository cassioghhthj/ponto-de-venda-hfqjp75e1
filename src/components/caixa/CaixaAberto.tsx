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
import { Wallet, TrendingUp, ArrowDownRight, CheckSquare, Plus, Printer } from 'lucide-react'

interface Props {
  caixa: CaixaRecord
  movements: MovimentacaoCaixa[]
  sales: any[]
  recebimentos: any[]
  pagamentos: any[]
  onFechar: (saldoFinal: number) => Promise<void>
  onNovaMov: (tipo: string, valor: number, descricao: string) => Promise<void>
}

export default function CaixaAberto({
  caixa,
  movements,
  sales,
  recebimentos,
  pagamentos,
  onFechar,
  onNovaMov,
}: Props) {
  const [movOpen, setMovOpen] = useState(false)
  const [closeOpen, setCloseOpen] = useState(false)
  const [form, setForm] = useState({ tipo: 'entrada', valor: '', descricao: '' })

  const totals = useMemo(() => {
    const autoPrefix = '[Auto]'

    // Vendas
    const vDinheiro = sales
      .filter((s) => s.metodo_pagamento === 'Dinheiro')
      .reduce((acc, s) => acc + Number(s.total), 0)
    const vCartao = sales
      .filter((s) => s.metodo_pagamento === 'Cartão')
      .reduce((acc, s) => acc + Number(s.total), 0)
    const vPix = sales
      .filter((s) => s.metodo_pagamento === 'Pix')
      .reduce((acc, s) => acc + Number(s.total), 0)
    const vTotal = vDinheiro + vCartao + vPix

    // Recebimentos (Contas a Receber)
    const rDinheiro = recebimentos
      .filter((r) => r.metodo_pagamento === 'Dinheiro')
      .reduce((a, b) => a + Number(b.valor), 0)
    const rCartao = recebimentos
      .filter((r) => r.metodo_pagamento === 'Cartão')
      .reduce((a, b) => a + Number(b.valor), 0)
    const rPix = recebimentos
      .filter((r) => r.metodo_pagamento === 'Pix')
      .reduce((a, b) => a + Number(b.valor), 0)

    // Pagamentos (Contas a Pagar)
    const pDinheiro = pagamentos
      .filter((p) => p.metodo_pagamento === 'Dinheiro')
      .reduce((a, b) => a + Number(b.valor), 0)
    const pCartao = pagamentos
      .filter((p) => p.metodo_pagamento === 'Cartão')
      .reduce((a, b) => a + Number(b.valor), 0)
    const pPix = pagamentos
      .filter((p) => p.metodo_pagamento === 'Pix')
      .reduce((a, b) => a + Number(b.valor), 0)

    // Movimentações Manuais (ignora os que começam com [Auto] pois já estão nos recebimentos/pagamentos)
    const manualMovements = movements.filter((m) => !m.descricao.startsWith(autoPrefix))
    const supManuais = manualMovements
      .filter((m) => m.tipo === 'entrada')
      .reduce((acc, m) => acc + Number(m.valor), 0)
    const sangManuais = manualMovements
      .filter((m) => m.tipo === 'saida')
      .reduce((acc, m) => acc + Number(m.valor), 0)

    // Saldo em Gaveta (só dinheiro físico)
    const saldoInicial = Number(caixa.saldo_inicial)
    const atual = saldoInicial + vDinheiro + rDinheiro + supManuais - pDinheiro - sangManuais

    return {
      vTotal,
      vDinheiro,
      vCartao,
      vPix,
      rDinheiro,
      rCartao,
      rPix,
      pDinheiro,
      pCartao,
      pPix,
      supManuais,
      sangManuais,
      atual,
      saldoInicial,
    }
  }, [caixa, movements, sales, recebimentos, pagamentos])

  const handleMov = async () => {
    if (!form.valor || !form.descricao) return
    await onNovaMov(form.tipo, Number(form.valor), form.descricao)
    setMovOpen(false)
    setForm({ tipo: 'entrada', valor: '', descricao: '' })
  }

  return (
    <div className="space-y-6">
      <div className="print:hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Saldo Inicial
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {formatCurrency(totals.saldoInicial)}
            </div>
          </CardContent>
        </Card>
        <Card className="border-blue-200 bg-blue-50/30">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-blue-700">Vendas (Sessão)</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{formatCurrency(totals.vTotal)}</div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Movimentações Manuais
            </CardTitle>
            <ArrowDownRight className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-sm text-emerald-600 font-medium">
              +{formatCurrency(totals.supManuais)} (Suprimentos)
            </div>
            <div className="text-sm text-destructive font-medium">
              -{formatCurrency(totals.sangManuais)} (Sangrias)
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

      <div className="print:hidden flex flex-col sm:flex-row gap-4">
        <Button onClick={() => setMovOpen(true)} variant="outline">
          <Plus className="mr-2 h-4 w-4" /> Nova Movimentação
        </Button>
        <Button onClick={() => setCloseOpen(true)} variant="destructive">
          Fechar Caixa
        </Button>
      </div>

      <Tabs defaultValue="vendas" className="print:hidden">
        <TabsList>
          <TabsTrigger value="vendas">Vendas ({sales.length})</TabsTrigger>
          <TabsTrigger value="movimentacoes">Todas Movimentações ({movements.length})</TabsTrigger>
        </TabsList>
        <TabsContent
          value="vendas"
          className="mt-4 border border-border rounded-lg bg-card overflow-hidden"
        >
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Hora</TableHead>
                <TableHead>ID</TableHead>
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
                    Nenhuma venda registrada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TabsContent>
        <TabsContent
          value="movimentacoes"
          className="mt-4 border border-border rounded-lg bg-card overflow-hidden"
        >
          <Table>
            <TableHeader className="bg-muted/50">
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
                      className={m.tipo === 'entrada' ? 'bg-emerald-100 text-emerald-800' : ''}
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
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>

      {/* Relatório de Fechamento de Caixa para Impressão */}
      <div className="hidden print:block bg-white text-black w-full max-w-[80mm] mx-auto text-sm">
        <div className="text-center font-bold text-lg mb-2 border-b-2 border-black pb-2">
          FECHAMENTO DE CAIXA
          <br />
          CHARME PDV
        </div>
        <div className="mb-4">
          <p>
            <strong>Abertura:</strong> {new Date(caixa.data_abertura).toLocaleString('pt-BR')}
          </p>
          <p>
            <strong>Operador:</strong> {caixa.user_id.split('-')[0]}
          </p>
        </div>

        <div className="border-t border-black pt-2 mb-2 font-bold">SALDO INICIAL</div>
        <div className="flex justify-between mb-4">
          <span>Troco em Gaveta:</span>
          <span>{formatCurrency(totals.saldoInicial)}</span>
        </div>

        <div className="border-t border-black pt-2 mb-2 font-bold">ENTRADAS (DINHEIRO)</div>
        <div className="flex justify-between">
          <span>Vendas:</span> <span>{formatCurrency(totals.vDinheiro)}</span>
        </div>
        <div className="flex justify-between">
          <span>Recebimentos:</span> <span>{formatCurrency(totals.rDinheiro)}</span>
        </div>
        <div className="flex justify-between mb-4">
          <span>Suprimentos (Manual):</span> <span>{formatCurrency(totals.supManuais)}</span>
        </div>

        <div className="border-t border-black pt-2 mb-2 font-bold">SAÍDAS (DINHEIRO)</div>
        <div className="flex justify-between">
          <span>Pagamentos:</span> <span>{formatCurrency(totals.pDinheiro)}</span>
        </div>
        <div className="flex justify-between mb-4">
          <span>Sangrias (Manual):</span> <span>{formatCurrency(totals.sangManuais)}</span>
        </div>

        <div className="border-t-2 border-black pt-2 mb-4 font-bold text-lg flex justify-between">
          <span>TOTAL NA GAVETA:</span>
          <span>{formatCurrency(totals.atual)}</span>
        </div>

        <div className="border-t border-dashed border-gray-400 pt-2 mb-2 font-bold text-xs text-gray-600">
          OUTROS MÉTODOS (NÃO FÍSICO)
        </div>
        <div className="flex justify-between text-xs text-gray-600">
          <span>Vendas (Cartão):</span> <span>{formatCurrency(totals.vCartao)}</span>
        </div>
        <div className="flex justify-between text-xs text-gray-600">
          <span>Vendas (Pix):</span> <span>{formatCurrency(totals.vPix)}</span>
        </div>
        <div className="flex justify-between text-xs text-gray-600">
          <span>Receb. (Cartão):</span> <span>{formatCurrency(totals.rCartao)}</span>
        </div>
        <div className="flex justify-between text-xs text-gray-600">
          <span>Receb. (Pix):</span> <span>{formatCurrency(totals.rPix)}</span>
        </div>
        <div className="flex justify-between text-xs text-gray-600">
          <span>Pagtos. (Cartão):</span> <span>{formatCurrency(totals.pCartao)}</span>
        </div>
        <div className="flex justify-between text-xs text-gray-600 mb-4">
          <span>Pagtos. (Pix):</span> <span>{formatCurrency(totals.pPix)}</span>
        </div>

        <div className="text-center text-xs mt-6 border-t border-black pt-2">
          Assinatura do Operador
          <br />
          <br />
          <br />
          _______________________________
        </div>
      </div>

      <Dialog open={movOpen} onOpenChange={setMovOpen}>
        <DialogContent className="print:hidden">
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
                placeholder="Ex: Reforço de troco"
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
        <DialogContent className="max-w-3xl print:hidden">
          <DialogHeader>
            <DialogTitle>Fechamento de Caixa - CHARME PDV</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
            <div className="space-y-6 md:border-r pr-0 md:pr-8">
              <div>
                <h4 className="font-semibold text-sm text-emerald-700 dark:text-emerald-400 mb-3 border-b pb-1">
                  Entradas (Dinheiro)
                </h4>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Saldo Inicial:</span>{' '}
                    <span className="font-medium">{formatCurrency(totals.saldoInicial)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Vendas:</span>{' '}
                    <span className="font-medium">{formatCurrency(totals.vDinheiro)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Recebimentos:</span>{' '}
                    <span className="font-medium">{formatCurrency(totals.rDinheiro)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Suprimentos:</span>{' '}
                    <span className="font-medium">{formatCurrency(totals.supManuais)}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-red-700 dark:text-red-400 mb-3 border-b pb-1">
                  Saídas (Dinheiro)
                </h4>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Pagamentos:</span>{' '}
                    <span className="font-medium">{formatCurrency(totals.pDinheiro)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Sangrias:</span>{' '}
                    <span className="font-medium">{formatCurrency(totals.sangManuais)}</span>
                  </div>
                </div>
              </div>
              <div className="pt-2">
                <h4 className="font-semibold text-sm text-blue-700 dark:text-blue-400 mb-3 border-b pb-1">
                  Outros Métodos (Não afetam gaveta)
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Cartão
                    </p>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Vendas:</span>{' '}
                      <span className="font-medium">{formatCurrency(totals.vCartao)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Receb.:</span>{' '}
                      <span className="font-medium">{formatCurrency(totals.rCartao)}</span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Pix
                    </p>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Vendas:</span>{' '}
                      <span className="font-medium">{formatCurrency(totals.vPix)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Receb.:</span>{' '}
                      <span className="font-medium">{formatCurrency(totals.rPix)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center items-center text-center space-y-6 bg-muted/30 p-8 rounded-2xl border border-border">
              <div>
                <p className="text-muted-foreground font-semibold uppercase tracking-wider text-xs mb-2">
                  Total Calculado na Gaveta
                </p>
                <p className="text-5xl font-black text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(totals.atual)}
                </p>
              </div>
              <p className="text-sm text-muted-foreground max-w-[250px]">
                Confira o valor físico na gaveta antes de confirmar o fechamento.
              </p>
              <Button
                variant="outline"
                onClick={() => window.print()}
                className="mt-4 w-full max-w-[200px] bg-background"
              >
                <Printer className="mr-2 h-4 w-4" /> Imprimir Resumo
              </Button>
            </div>
          </div>
          <DialogFooter className="border-t pt-4 mt-2">
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
