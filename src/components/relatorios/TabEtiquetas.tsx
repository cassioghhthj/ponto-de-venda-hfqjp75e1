import { useState, useEffect } from 'react'
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
import { Printer, Search, Loader2 } from 'lucide-react'
import { formatCurrency } from '@/lib/format'
import { Product } from '@/types'

export function TabEtiquetas() {
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

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

  const filtered = products.filter(
    (p) => p.nome.toLowerCase().includes(search.toLowerCase()) || p.codigo?.includes(search),
  )

  const handlePrint = (p: Product) => {
    // Placeholder for actual label printing logic
    alert(
      `Impressão de etiqueta para: ${p.nome}\nEm uma implementação futura isso enviaria comandos ZPL para a impressora ou abriria um layout PDF focado em etiquetas.`,
    )
  }

  if (loading)
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )

  return (
    <Card className="shadow-sm bg-card border-border">
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <CardTitle className="text-lg">Impressão de Etiquetas de Preço</CardTitle>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar produto..."
            className="pl-9 bg-background"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Produto</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead className="text-right">Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.slice(0, 50).map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-mono text-xs">{p.codigo || '-'}</TableCell>
                <TableCell className="font-medium">{p.nome}</TableCell>
                <TableCell>{formatCurrency(p.preco_venda || p.preco)}</TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="secondary" onClick={() => handlePrint(p)}>
                    <Printer className="h-4 w-4 mr-2" /> Imprimir
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  Nenhum produto encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="p-3 text-xs text-muted-foreground text-center border-t border-border">
          Mostrando até 50 resultados.
        </div>
      </CardContent>
    </Card>
  )
}
