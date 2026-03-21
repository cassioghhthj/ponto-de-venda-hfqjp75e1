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
import { Loader2, PenBox, Plus, Edit, UploadCloud, Tags } from 'lucide-react'
import { ProdutoFormModal } from './ProdutoFormModal'
import { ImportProductsModal } from './ImportProductsModal'
import { CategoriaFormModal } from './CategoriaFormModal'
import { formatCurrency } from '@/lib/format'

export default function EstoqueAtual() {
  const { user } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState('Todas')

  const [adjustProduct, setAdjustProduct] = useState<Product | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ quantidade: '', tipo: 'entrada', motivo: 'ajuste' })

  const [formOpen, setFormOpen] = useState(false)
  const [importOpen, setImportOpen] = useState(false)
  const [catModalOpen, setCatModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const fetchData = async () => {
    setLoading(true)
    const [prodRes, catRes] = await Promise.all([
      supabase.from('produtos').select('*').order('nome'),
      supabase.from('categorias').select('nome').order('nome'),
    ])
    if (prodRes.data) setProducts(prodRes.data as Product[])
    if (catRes.data) {
      setCategories(['Todas', ...catRes.data.map((c) => c.nome)])
    } else {
      // Fallback if no table data yet
      setCategories([
        'Todas',
        ...(Array.from(
          new Set((prodRes.data || []).map((p) => p.categoria).filter(Boolean)),
        ) as string[]),
      ])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

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
    if (err1 || err2)
      toast({ title: 'Erro', description: 'Erro ao registrar ajuste.', variant: 'destructive' })
    else {
      toast({ title: 'Sucesso', description: 'Estoque ajustado com sucesso!' })
      setAdjustProduct(null)
      fetchData()
    }
  }

  if (loading)
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
        <div className="w-full sm:w-64 shrink-0">
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
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={() => setCatModalOpen(true)}
            className="flex-1 sm:flex-none"
          >
            <Tags className="h-4 w-4 mr-2" /> Categorias
          </Button>
          <Button
            variant="outline"
            onClick={() => setImportOpen(true)}
            className="flex-1 sm:flex-none"
          >
            <UploadCloud className="h-4 w-4 mr-2" /> Importar CSV
          </Button>
          <Button
            onClick={() => {
              setEditingProduct(null)
              setFormOpen(true)
            }}
            className="flex-1 sm:flex-none"
          >
            <Plus className="h-4 w-4 mr-2" /> Novo Produto
          </Button>
        </div>
      </div>

      <Card className="shadow-sm border-border bg-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Tam.</TableHead>
                <TableHead>Preço Venda</TableHead>
                <TableHead className="text-center">Estoque Atual</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-xs">{p.codigo || '-'}</TableCell>
                  <TableCell className="font-medium">{p.nome}</TableCell>
                  <TableCell>{p.tamanho || '-'}</TableCell>
                  <TableCell>{formatCurrency(p.preco_venda || p.preco)}</TableCell>
                  <TableCell className="text-center">
                    {p.estoque <= p.estoque_minimo ? (
                      <Badge variant="destructive" className="px-2">
                        {p.estoque}
                      </Badge>
                    ) : (
                      <span className="font-semibold text-foreground">{p.estoque}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        setEditingProduct(p)
                        setFormOpen(true)
                      }}
                    >
                      <Edit className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setAdjustProduct(p)
                        setForm({ quantidade: '', tipo: 'entrada', motivo: 'ajuste' })
                      }}
                    >
                      <PenBox className="h-4 w-4 mr-2" /> Ajustar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredProducts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Nenhum produto encontrado.
                  </TableCell>
                </TableRow>
              )}
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
              <div className="text-sm font-medium mb-4 pb-2 border-b border-border">
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
              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setAdjustProduct(null)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null} Salvar
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
      <ProdutoFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        product={editingProduct}
        onSuccess={fetchData}
      />
      <ImportProductsModal
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onSuccess={fetchData}
      />
      <CategoriaFormModal
        open={catModalOpen}
        onClose={() => setCatModalOpen(false)}
        onSuccess={fetchData}
      />
    </div>
  )
}
