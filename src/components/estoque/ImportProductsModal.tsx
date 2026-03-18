import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'
import { Loader2, UploadCloud, Info } from 'lucide-react'

interface Props {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export function ImportProductsModal({ open, onClose, onSuccess }: Props) {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const handleImport = async () => {
    if (!file) return
    setLoading(true)

    try {
      const text = await file.text()
      const rows = text.split('\n').filter((r) => r.trim().length > 0)
      if (rows.length < 2) throw new Error('Arquivo vazio ou sem dados válidos.')

      const itemsToInsert = rows
        .slice(1)
        .map((row) => {
          // Simple split, handles comma or semicolon
          const cols = row.split(/[,;]/).map((c) => c.trim().replace(/^"|"$/g, ''))
          const nome = cols[0]
          if (!nome) return null

          const preco_custo = parseFloat(cols[3]?.replace(',', '.') || '0')
          const preco_venda = parseFloat(cols[4]?.replace(',', '.') || '0')

          return {
            nome,
            codigo: cols[1] || null,
            categoria: cols[2] || null,
            preco_custo,
            preco_venda,
            preco: preco_venda, // legacy sync
            estoque: parseInt(cols[5]) || 0,
            tamanho: cols[6] || null,
          }
        })
        .filter(Boolean) as any[]

      if (itemsToInsert.length === 0) throw new Error('Nenhum produto válido encontrado.')

      // Check for duplicates
      const { data: existing } = await supabase.from('produtos').select('nome')
      const existingNames = new Set(existing?.map((p) => p.nome.toLowerCase()) || [])

      const toInsert = itemsToInsert.filter((i) => !existingNames.has(i.nome.toLowerCase()))
      const duplicatesCount = itemsToInsert.length - toInsert.length

      if (toInsert.length > 0) {
        const { error } = await supabase.from('produtos').insert(toInsert)
        if (error) throw error
      }

      toast({
        title: 'Importação Concluída',
        description: `${toInsert.length} inseridos com sucesso. ${duplicatesCount} ignorados por duplicidade de nome.`,
      })
      onSuccess()
      onClose()
    } catch (error: any) {
      toast({
        title: 'Erro na importação',
        description: error.message || 'Falha ao processar arquivo.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
      setFile(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Importar Produtos em Lote</DialogTitle>
          <DialogDescription>
            Faça upload de um arquivo CSV. Para planilhas do Excel, clique em "Salvar Como" e
            escolha o formato "CSV (UTF-8) delimitado por vírgulas".
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="text-sm bg-muted p-4 rounded-md border border-border">
            <p className="font-semibold mb-2 flex items-center gap-2">
              <Info className="h-4 w-4 text-primary" /> Colunas Esperadas (nessa ordem):
            </p>
            <p className="text-muted-foreground font-mono text-xs bg-background p-2 rounded border border-border">
              Nome, Codigo, Categoria, Preco_Custo, Preco_Venda, Estoque, Tamanho
            </p>
            <p className="text-xs text-muted-foreground mt-3 italic">
              * A primeira linha será ignorada (cabeçalho). Produtos com nomes idênticos aos
              existentes no sistema serão pulados para evitar duplicações.
            </p>
          </div>
          <div className="space-y-2">
            <Input
              type="file"
              accept=".csv"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="cursor-pointer"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleImport} disabled={!file || loading}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <UploadCloud className="mr-2 h-4 w-4" />
            )}
            Iniciar Importação
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
