import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'
import { Loader2, Plus, Edit2, Trash2, Check, X } from 'lucide-react'

interface Category {
  id: string
  nome: string
}

interface Props {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export function CategoriaFormModal({ open, onClose, onSuccess }: Props) {
  const [categories, setCategories] = useState<Category[]>([])
  const [nome, setNome] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)

  const fetchCategories = async () => {
    setFetching(true)
    const { data } = await supabase.from('categorias').select('*').order('nome')
    if (data) setCategories(data)
    setFetching(false)
  }

  useEffect(() => {
    if (open) {
      fetchCategories()
      setNome('')
      setEditingId(null)
    }
  }, [open])

  const handleAdd = async (e: React.FormEvent) => {
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
      fetchCategories()
      onSuccess()
    }
    setLoading(false)
  }

  const handleUpdate = async (id: string, oldName: string) => {
    if (!editValue.trim() || editValue.trim() === oldName) {
      setEditingId(null)
      return
    }

    setActionLoadingId(id)
    const newName = editValue.trim()
    const { error } = await supabase.from('categorias').update({ nome: newName }).eq('id', id)

    if (error) {
      if (error.code === '23505') {
        toast({
          title: 'Atenção',
          description: 'Já existe uma categoria com este nome.',
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Erro',
          description: 'Erro ao atualizar categoria.',
          variant: 'destructive',
        })
      }
    } else {
      // Atualizar também nos produtos que usavam este nome
      await supabase.from('produtos').update({ categoria: newName }).eq('categoria', oldName)

      toast({ title: 'Sucesso', description: 'Categoria atualizada.' })
      setEditingId(null)
      fetchCategories()
      onSuccess()
    }
    setActionLoadingId(null)
  }

  const handleDelete = async (id: string, name: string) => {
    if (
      !window.confirm(
        `Deseja realmente excluir a categoria "${name}"? Os produtos vinculados ficarão sem categoria.`,
      )
    )
      return

    setActionLoadingId(id)
    const { error } = await supabase.from('categorias').delete().eq('id', id)

    if (error) {
      toast({ title: 'Erro', description: 'Erro ao excluir categoria.', variant: 'destructive' })
    } else {
      // Remover categoria dos produtos vinculados
      await supabase.from('produtos').update({ categoria: null }).eq('categoria', name)

      toast({ title: 'Sucesso', description: 'Categoria excluída.' })
      fetchCategories()
      onSuccess()
    }
    setActionLoadingId(null)
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Gerenciar Categorias</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          <form onSubmit={handleAdd} className="flex gap-2 items-center">
            <Input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome da nova categoria..."
              disabled={loading}
              className="flex-1"
            />
            <Button type="submit" disabled={loading || !nome.trim()}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              <span className="ml-2 hidden sm:inline">Adicionar</span>
            </Button>
          </form>

          <div className="border rounded-md">
            <div className="bg-muted/50 px-4 py-2 text-sm font-medium border-b">
              Categorias Cadastradas
            </div>
            <div className="max-h-[300px] overflow-y-auto p-2 space-y-2">
              {fetching ? (
                <div className="flex justify-center p-4">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : categories.length === 0 ? (
                <div className="text-center p-4 text-sm text-muted-foreground">
                  Nenhuma categoria cadastrada.
                </div>
              ) : (
                categories.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between p-2 hover:bg-accent/50 rounded-md transition-colors border border-transparent hover:border-border group"
                  >
                    {editingId === c.id ? (
                      <div className="flex items-center gap-2 flex-1">
                        <Input
                          autoFocus
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="h-8 text-sm"
                          onKeyDown={(e) => e.key === 'Enter' && handleUpdate(c.id, c.nome)}
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-100"
                          onClick={() => handleUpdate(c.id, c.nome)}
                          disabled={actionLoadingId === c.id}
                        >
                          {actionLoadingId === c.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Check className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-muted-foreground"
                          onClick={() => setEditingId(null)}
                          disabled={actionLoadingId === c.id}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <span className="text-sm font-medium">{c.nome}</span>
                        <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => {
                              setEditingId(c.id)
                              setEditValue(c.nome)
                            }}
                            disabled={!!actionLoadingId}
                          >
                            <Edit2 className="h-4 w-4 text-blue-600" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => handleDelete(c.id, c.nome)}
                            disabled={!!actionLoadingId}
                          >
                            {actionLoadingId === c.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4 text-destructive" />
                            )}
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
