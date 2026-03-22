import { useState, useMemo } from 'react'
import { createPortal } from 'react-dom'
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
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Printer, Search, Loader2 } from 'lucide-react'
import { formatCurrency } from '@/lib/format'
import { Product } from '@/types'

interface EstoqueEtiquetasProps {
  products: Product[]
  categories: string[]
  loading: boolean
}

export default function EstoqueEtiquetas({ products, categories, loading }: EstoqueEtiquetasProps) {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('Todas')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [useStockQuantity, setUseStockQuantity] = useState(false)

  const filteredProducts = useMemo(() => {
    return products.filter(
      (p) =>
        (p.nome.toLowerCase().includes(search.toLowerCase()) || p.codigo?.includes(search)) &&
        (categoryFilter === 'Todas' || p.categoria === categoryFilter),
    )
  }, [products, search, categoryFilter])

  const handleSelectAll = (checked: boolean) => {
    const newSelected = new Set(selectedIds)
    filteredProducts.forEach((p) => {
      if (checked) {
        newSelected.add(p.id)
      } else {
        newSelected.delete(p.id)
      }
    })
    setSelectedIds(newSelected)
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

  const labelsToPrint = useMemo(() => {
    return products
      .filter((p) => selectedIds.has(p.id))
      .flatMap((p) => Array(useStockQuantity ? Math.max(0, p.estoque || 0) : 1).fill(p))
  }, [products, selectedIds, useStockQuantity])

  const chunks = useMemo(
    () =>
      Array.from({ length: Math.ceil(labelsToPrint.length / 65) }, (_, i) =>
        labelsToPrint.slice(i * 65, (i + 1) * 65),
      ),
    [labelsToPrint],
  )

  const printContent = useMemo(() => {
    if (labelsToPrint.length === 0) return null
    return (
      <div className="print-only">
        {chunks.map((chunk, index) => (
          <div key={index} className="pimaco-a4251-sheet">
            {chunk.map((p, i) => (
              <div key={`${p.id}-${i}`} className="pimaco-label">
                {p.codigo ? (
                  <img
                    src={`https://bwipjs-api.metafloor.com/?bcid=code128&text=${encodeURIComponent(
                      p.codigo,
                    )}&scale=1&height=5&includetext=false`}
                    className="barcode-img"
                    alt={p.codigo}
                    crossOrigin="anonymous"
                  />
                ) : (
                  <div className="no-barcode">Sem Cód.</div>
                )}
                <span className="pimaco-label-name">{p.nome}</span>
                <span className="pimaco-label-price">
                  {formatCurrency(p.preco_venda || p.preco)}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    )
  }, [chunks, labelsToPrint.length])

  if (loading)
    return (
      <div className="flex justify-center py-12 h-full items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media print {
          @page { size: A4; margin: 0; }
          body, html { margin: 0; padding: 0; background: #fff; }
          #root { display: none !important; }
          .print-only { display: block !important; width: 210mm; margin: 0 auto; background: #fff; }
          
          .pimaco-a4251-sheet {
            display: grid !important;
            grid-template-columns: repeat(5, 38.2mm) !important;
            grid-template-rows: repeat(13, 21.2mm) !important;
            justify-content: space-between !important;
            padding: 10.7mm 4mm !important;
            width: 210mm !important;
            height: 297mm !important;
            box-sizing: border-box !important;
            page-break-after: always !important;
            break-after: page !important;
            gap: 0 !important;
          }
          
          .pimaco-label {
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
            align-items: center !important;
            width: 38.2mm !important;
            height: 21.2mm !important;
            padding: 1mm !important;
            box-sizing: border-box !important;
            text-align: center !important;
            overflow: hidden !important;
            background: #fff !important;
          }
          
          .barcode-img {
            max-width: 90% !important;
            height: 8mm !important;
            object-fit: contain !important;
            margin-bottom: 0.5mm !important;
          }
          
          .no-barcode {
            font-size: 6pt !important;
            color: #666 !important;
            margin-bottom: 0.5mm !important;
            height: 8mm !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
          
          .pimaco-label-name {
            font-size: 6.5pt !important;
            font-weight: 600 !important;
            line-height: 1.1 !important;
            max-height: 14pt !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            white-space: nowrap !important;
            width: 100% !important;
            display: block !important;
          }
          
          .pimaco-label-price {
            font-size: 8.5pt !important;
            font-weight: 800 !important;
            margin-top: 0.5mm !important;
            display: block !important;
          }
        }
        @media screen {
          .print-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
          }
        }
      `,
        }}
      />

      <div className="no-print space-y-4 h-full flex flex-col min-h-0 animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar produto..."
                className="pl-9 bg-background h-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-background h-10">
                <SelectValue placeholder="Categoria" />
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

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto ml-auto">
            {selectedIds.size > 0 && (
              <div className="flex items-center space-x-2 bg-card border border-border px-3 py-2 rounded-md shadow-sm h-10">
                <Switch
                  id="use-stock"
                  checked={useStockQuantity}
                  onCheckedChange={setUseStockQuantity}
                />
                <Label htmlFor="use-stock" className="text-sm font-medium cursor-pointer">
                  Usar qtd. estoque
                </Label>
              </div>
            )}
            {selectedIds.size > 0 && (
              <Button onClick={() => window.print()} className="w-full sm:w-auto h-10">
                <Printer className="h-4 w-4 mr-2" />
                Imprimir Etiquetas ({labelsToPrint.length})
              </Button>
            )}
          </div>
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
                  <TableHead>Categoria</TableHead>
                  <TableHead className="text-center">Estoque</TableHead>
                  <TableHead className="text-right">Preço</TableHead>
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
                    <TableCell>{p.categoria || '-'}</TableCell>
                    <TableCell className="text-center">{p.estoque || 0}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(p.preco_venda || p.preco)}
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
      </div>

      {printContent && createPortal(printContent, document.body)}
    </>
  )
}
