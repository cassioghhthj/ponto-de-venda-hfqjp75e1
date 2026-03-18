import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'

interface Props {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export function CategoriaFormModal({ open, onClose, onSuccess }: Props) {
  const [nome, setNome] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nome.trim()) return

    setLoading(true)
    const { error } = await supabase.from('categorias').insert({ nome: nome.trim() })

    if (error) {
      if (error.code === '23505') {
        toast({
          title: 'Atenção',
          description: 'Esta categoria já existe.',
          variant: 'destructive',
        })
      } else {
        toast({ title: 'Erro', description: 'Erro ao salvar categoria.', variant: 'destructive' })
      }
    } else {
      toast({ title: 'Sucesso', description: 'Categoria criada com sucesso.' })
      setNome('')
      onSuccess()
      onClose()
    }
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Nova Categoria</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome da Categoria *</Label>
            <Input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Bebidas"
              required
              autoFocus
            />
          </div>
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || !nome.trim()}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
