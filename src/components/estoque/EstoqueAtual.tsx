import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { Product } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { toast } from '@/hooks/use-toast'
import { Loader2, PenBox } from 'lucide-react'

export default function EstoqueAtual() {
  const { user } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState('Todas')

  const [adjustProduct, setAdjustProduct] = useState<Product | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ quantidade: '', tipo: '', motivo: '' })

  const fetchProducts = async () => {
    setLoading(true)
    const { data } = await supabase.from('produtos').select('*').order('nome')
    if (data) setProducts(data as Product[])
    setLoading(false)
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const categories = [
    'Todas',
    ...Array.from(new Set(products.map((p) => p.categoria).filter(Boolean))),
  ]
  const filteredProducts = products.filter(
    (p) => categoryFilter === 'Todas' || p.categoria === categoryFilter,
  )

  const handleAdjust = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!adjustProduct || !user) return
    setSubmitting(true)

    const qty = parseInt(form.quantidade)
    const newEstoque =
      form.tipo === 'entrada' ? adjustProduct.estoque + qty : adjustProduct.estoque - qty

    const { error: err1 } = await supabase
      .from('produtos')
      .update({ estoque: newEstoque })
      .eq('id', adjustProduct.id)

    const { error: err2 } = await supabase.from('movimentacoes_estoque').insert({
      produto_id: adjustProduct.id,
      tipo: form.tipo,
      quantidade: qty,
      motivo: form.motivo,
      user_id: user.id,
    })

    setSubmitting(false)

    if (err1 || err2) {
      toast({
        title: 'Erro',
        description: 'Erro ao registrar ajuste de estoque.',
        variant: 'destructive',
      })
    } else {
      toast({ title: 'Sucesso', description: 'Estoque ajustado com sucesso!' })
      setAdjustProduct(null)
      fetchProducts()
    }
  }

  const openAdjustDialog = (product: Product) => {
    setAdjustProduct(product)
    setForm({ quantidade: '', tipo: 'entrada', motivo: 'ajuste' })
  }

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-64">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar Categoria" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead className="text-center">Estoque Atual</TableHead>
                <TableHead className="text-center">Estoque Mínimo</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.nome}</TableCell>
                  <TableCell>{p.categoria}</TableCell>
                  <TableCell className="text-center">
                    {p.estoque <= p.estoque_minimo ? (
                      <Badge variant="destructive" className="px-2">
                        {p.estoque}
                      </Badge>
                    ) : (
                      <span className="font-semibold text-slate-700">{p.estoque}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center text-muted-foreground">
                    {p.estoque_minimo}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline" onClick={() => openAdjustDialog(p)}>
                      <PenBox className="h-4 w-4 mr-2" /> Ajustar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!adjustProduct} onOpenChange={(open) => !open && setAdjustProduct(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Ajuste Manual de Estoque</DialogTitle>
          </DialogHeader>
          {adjustProduct && (
            <form onSubmit={handleAdjust} className="space-y-4 py-4">
              <div className="text-sm font-medium mb-4 pb-2 border-b">
                Produto: {adjustProduct.nome}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo de Ajuste</Label>
                  <Select
                    required
                    value={form.tipo}
                    onValueChange={(v) => setForm({ ...form, tipo: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entrada">Entrada (+)</SelectItem>
                      <SelectItem value="saida">Saída (-)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Quantidade</Label>
                  <Input
                    type="number"
                    min="1"
                    required
                    value={form.quantidade}
                    onChange={(e) => setForm({ ...form, quantidade: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Motivo</Label>
                <Select
                  required
                  value={form.motivo}
                  onValueChange={(v) => setForm({ ...form, motivo: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ajuste">Ajuste de Inventário</SelectItem>
                    <SelectItem value="devolução">Devolução</SelectItem>
                    <SelectItem value="perda">Perda / Quebra</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setAdjustProduct(null)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null} Salvar
                  Ajuste
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
