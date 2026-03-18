import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Cliente } from '@/types'
import { supabase } from '@/lib/supabase/client'
import { Search, X, User, Plus } from 'lucide-react'
import { ClienteFormModal } from '../clientes/ClienteFormModal'

interface Props {
  onSelect: (c: Cliente | null) => void
}

export function CustomerSelect({ onSelect }: Props) {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<Cliente | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const fetchClientes = async () => {
    const { data } = await supabase.from('clientes').select('*').order('nome')
    setClientes(data || [])
  }

  useEffect(() => {
    fetchClientes()
  }, [])

  const handleSelect = (c: Cliente | null) => {
    setSelected(c)
    onSelect(c)
    setOpen(false)
    setSearch('')
  }

  const filtered = clientes.filter(
    (c) => c.nome.toLowerCase().includes(search.toLowerCase()) || c.cpf?.includes(search),
  )

  if (selected) {
    return (
      <div className="space-y-2">
        <Label className="text-muted-foreground uppercase text-xs font-bold tracking-wider">
          Cliente Associado
        </Label>
        <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/30 border-border">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-1.5 rounded-md">
              <User className="h-4 w-4 text-primary" />
            </div>
            <span className="font-semibold text-foreground">{selected.nome}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 rounded-full hover:bg-destructive/10 hover:text-destructive"
            onClick={() => handleSelect(null)}
            title="Remover Cliente"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2 relative">
      <div className="flex items-center justify-between">
        <Label className="text-muted-foreground uppercase text-xs font-bold tracking-wider">
          Vincular Cliente (Opcional)
        </Label>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 text-xs px-2 text-primary hover:text-primary/80"
          onClick={() => setModalOpen(true)}
        >
          <Plus className="h-3 w-3 mr-1" /> Novo
        </Button>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar cliente por nome ou CPF..."
          className="pl-9 bg-background shadow-sm"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 200)}
        />
      </div>
      {open && search && (
        <div className="absolute top-full left-0 mt-1 w-full bg-popover border border-border rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="p-3 text-sm text-muted-foreground text-center">
              Nenhum cliente encontrado.
            </div>
          ) : (
            filtered.map((c) => (
              <div
                key={c.id}
                className="p-3 hover:bg-accent cursor-pointer border-b last:border-0 border-border flex flex-col"
                onMouseDown={() => handleSelect(c)}
              >
                <span className="font-medium text-sm text-foreground">{c.nome}</span>
                {c.cpf && <span className="text-xs text-muted-foreground">CPF: {c.cpf}</span>}
              </div>
            ))
          )}
        </div>
      )}

      <ClienteFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        cliente={null}
        onSuccess={(cliente) => {
          fetchClientes()
          if (cliente) handleSelect(cliente)
        }}
      />
    </div>
  )
}
