import { useState, useEffect, useMemo } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Printer, Search, Loader2 } from 'lucide-react'
import { formatCurrency } from '@/lib/format'
import { Product } from '@/types'

export default function EstoqueEtiquetas() {
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    supabase
      .from('produtos')
      .select('*')
      .order('nome')
      .then(({ data }) => {
        setProducts(data || [])
        setLoading(false)
      })
  }, [])

  const filteredProducts = useMemo(() => {
    return products.filter(
      (p) => p.nome.toLowerCase().includes(search.toLowerCase()) || p.codigo?.includes(search),
    )
  }, [products, search])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const newSelected = new Set(selectedIds)
      filteredProducts.forEach((p) => newSelected.add(p.id))
      setSelectedIds(newSelected)
    } else {
      const newSelected = new Set(selectedIds)
      filteredProducts.forEach((p) => newSelected.delete(p.id))
      setSelectedIds(newSelected)
    }
  }

  const handleSelectProduct = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds)
    if (checked) {
      newSelected.add(id)
    } else {
      newSelected.delete(id)
    }
    setSelectedIds(newSelected)
  }

  const isAllVisibleSelected =
    filteredProducts.length > 0 && filteredProducts.every((p) => selectedIds.has(p.id))

  const handlePrint = () => {
    window.print()
  }

  const selectedProductsList = products.filter((p) => selectedIds.has(p.id))

  // Split into chunks of 65 for Pimaco A4251 (5 columns x 13 rows)
  const chunks = []
  for (let i = 0; i < selectedProductsList.length; i += 65) {
    chunks.push(selectedProductsList.slice(i, i + 65))
  }

  if (loading)
    return (
      <div className="flex justify-center py-12 h-full items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )

  return (
    <>
      <div className="no-print space-y-4 h-full flex flex-col min-h-0 animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar produto..."
              className="pl-9 bg-background"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {selectedIds.size > 0 && (
            <Button onClick={handlePrint} className="w-full sm:w-auto">
              <Printer className="h-4 w-4 mr-2" />
              Imprimir Etiquetas ({selectedIds.size})
            </Button>
          )}
        </div>

        <Card className="shadow-sm bg-card border-border flex-1 flex flex-col min-h-0">
          <CardHeader className="py-4 shrink-0 border-b border-border">
            <CardTitle className="text-lg">Seleção de Produtos para Etiquetas</CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-auto">
            <Table>
              <TableHeader className="bg-muted/50 sticky top-0 z-10 shadow-sm">
                <TableRow>
                  <TableHead className="w-[60px] text-center px-4">
                    <Checkbox
                      checked={isAllVisibleSelected}
                      onCheckedChange={handleSelectAll}
                      aria-label="Selecionar todos"
                    />
                  </TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Preço</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="text-center px-4">
                      <Checkbox
                        checked={selectedIds.has(p.id)}
                        onCheckedChange={(checked) => handleSelectProduct(p.id, checked as boolean)}
                        aria-label={`Selecionar ${p.nome}`}
                      />
                    </TableCell>
                    <TableCell className="font-mono text-xs">{p.codigo || '-'}</TableCell>
                    <TableCell className="font-medium">{p.nome}</TableCell>
                    <TableCell>{formatCurrency(p.preco_venda || p.preco)}</TableCell>
                  </TableRow>
                ))}
                {filteredProducts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      Nenhum produto encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="print-only">
        {chunks.map((chunk, index) => (
          <div key={index} className="pimaco-a4251-sheet">
            {chunk.map((p, i) => (
              <div key={`${p.id}-${i}`} className="pimaco-label">
                <span className="pimaco-label-name">{p.nome}</span>
                <span className="pimaco-label-price">
                  {formatCurrency(p.preco_venda || p.preco)}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  )
}
