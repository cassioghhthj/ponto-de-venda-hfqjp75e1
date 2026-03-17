import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'
import { Cliente } from '@/types'
import { Loader2 } from 'lucide-react'

interface Props {
  open: boolean
  onClose: () => void
  cliente: Cliente | null
  onSuccess: () => void
}

export function ClienteFormModal({ open, onClose, cliente, onSuccess }: Props) {
  const [form, setForm] = useState({ nome: '', email: '', telefone: '', cpf: '', endereco: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (cliente && open) {
      setForm({
        nome: cliente.nome,
        email: cliente.email || '',
        telefone: cliente.telefone || '',
        cpf: cliente.cpf || '',
        endereco: cliente.endereco || '',
      })
    } else if (open) {
      setForm({ nome: '', email: '', telefone: '', cpf: '', endereco: '' })
    }
  }, [cliente, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const dataToSave = {
      nome: form.nome,
      email: form.email || null,
      telefone: form.telefone || null,
      cpf: form.cpf || null,
      endereco: form.endereco || null,
    }

    if (cliente) {
      const { error } = await supabase.from('clientes').update(dataToSave).eq('id', cliente.id)
      if (error) {
        toast({ title: 'Erro', description: 'Não foi possível atualizar.', variant: 'destructive' })
      } else {
        toast({ title: 'Sucesso', description: 'Cliente atualizado com sucesso.' })
        onSuccess()
        onClose()
      }
    } else {
      const { error } = await supabase.from('clientes').insert(dataToSave)
      if (error) {
        toast({ title: 'Erro', description: 'Não foi possível cadastrar.', variant: 'destructive' })
      } else {
        toast({ title: 'Sucesso', description: 'Cliente cadastrado com sucesso.' })
        onSuccess()
        onClose()
      }
    }
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{cliente ? 'Editar Cliente' : 'Novo Cliente'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Nome *</Label>
            <Input
              required
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              placeholder="Nome completo"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>CPF</Label>
              <Input
                value={form.cpf}
                onChange={(e) => setForm({ ...form, cpf: e.target.value })}
                placeholder="000.000.000-00"
              />
            </div>
            <div className="space-y-2">
              <Label>Telefone</Label>
              <Input
                value={form.telefone}
                onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                placeholder="(00) 00000-0000"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="email@exemplo.com"
            />
          </div>
          <div className="space-y-2">
            <Label>Endereço</Label>
            <Input
              value={form.endereco}
              onChange={(e) => setForm({ ...form, endereco: e.target.value })}
              placeholder="Rua, Número, Bairro"
            />
          </div>
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
