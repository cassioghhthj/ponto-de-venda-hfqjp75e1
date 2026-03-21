import { useState, useEffect } from 'react'
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
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { UserProfile, useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'

interface Props {
  open: boolean
  onClose: () => void
  usuario: UserProfile | null
  onSuccess: () => void
}

const PERMISSION_OPTIONS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'pdv', label: 'Vendas (PDV)' },
  { id: 'estoque', label: 'Produtos e Estoque' },
  { id: 'clientes', label: 'Clientes' },
  { id: 'contas_receber', label: 'Contas a Receber' },
  { id: 'contas_pagar', label: 'Contas a Pagar' },
  { id: 'caixa', label: 'Caixa' },
  { id: 'relatorios', label: 'Relatórios' },
]

export function UsuarioFormModal({ open, onClose, usuario, onSuccess }: Props) {
  const { session } = useAuth()
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [permissions, setPermissions] = useState<Record<string, boolean>>({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (usuario) {
      setNome(usuario.nome || '')
      setEmail(usuario.email || '')
      setPassword('')
      setPermissions(usuario.permissions || {})
    } else {
      setNome('')
      setEmail('')
      setPassword('')
      setPermissions({ pdv: true, caixa: true }) // Permissões padrão para novos
    }
  }, [usuario, open])

  const togglePermission = (id: string, checked: boolean) => {
    setPermissions((prev) => ({ ...prev, [id]: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      if (usuario) {
        // Atualiza senha se preenchida
        if (password) {
          const { error: passError } = await supabase.functions.invoke('manage-users', {
            body: { action: 'update_password', payload: { id: usuario.id, password } },
            headers: { Authorization: `Bearer ${session?.access_token}` },
          })
          if (passError) throw passError
        }

        // Atualiza perfil e permissões
        const { error: updateError } = await supabase
          .from('users')
          .update({ nome, permissions })
          .eq('id', usuario.id)

        if (updateError) throw updateError

        toast({ title: 'Sucesso', description: 'Usuário atualizado com sucesso!' })
      } else {
        // Cria novo usuário via Edge Function
        if (!password) throw new Error('A senha é obrigatória para novos usuários.')

        const { data, error } = await supabase.functions.invoke('manage-users', {
          body: { action: 'create', payload: { email, password, nome, permissions } },
          headers: { Authorization: `Bearer ${session?.access_token}` },
        })

        if (error || data?.error) throw error || new Error(data?.error)

        toast({ title: 'Sucesso', description: 'Usuário criado com sucesso!' })
      }

      onSuccess()
      onClose()
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao salvar.',
        variant: 'destructive',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{usuario ? 'Editar Colaborador' : 'Novo Colaborador'}</DialogTitle>
          <DialogDescription>
            {usuario
              ? 'Altere as informações e controle as permissões de acesso.'
              : 'Crie um novo acesso para o seu funcionário e defina suas permissões.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo</Label>
              <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail de Acesso</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={!!usuario}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">
                Senha {usuario && '(deixe em branco para manter a atual)'}
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={!usuario}
                minLength={6}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-border mt-4">
            <h4 className="font-semibold mb-4 text-sm text-foreground">
              Permissões de Acesso (Módulos)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {PERMISSION_OPTIONS.map((opt) => (
                <div key={opt.id} className="flex items-center space-x-3">
                  <Checkbox
                    id={`perm-${opt.id}`}
                    checked={!!permissions[opt.id]}
                    onCheckedChange={(checked) => togglePermission(opt.id, checked as boolean)}
                    disabled={usuario?.role === 'admin'}
                  />
                  <Label
                    htmlFor={`perm-${opt.id}`}
                    className="font-medium cursor-pointer text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {opt.label}
                  </Label>
                </div>
              ))}
            </div>
            {usuario?.role === 'admin' && (
              <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 rounded-lg text-sm border border-purple-200 dark:border-purple-800">
                Este usuário é o administrador principal e possui acesso irrestrito ao sistema. As
                permissões específicas não se aplicam.
              </div>
            )}
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {usuario ? 'Salvar Alterações' : 'Cadastrar Usuário'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
