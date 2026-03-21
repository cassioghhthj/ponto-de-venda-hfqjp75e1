import { useState, useEffect } from 'react'
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
import { Plus, Edit, Trash2, ShieldCheck, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'
import { useAuth, UserProfile } from '@/hooks/use-auth'
import { UsuarioFormModal } from '@/components/usuarios/UsuarioFormModal'

export default function Usuarios() {
  const { session } = useAuth()
  const [usuarios, setUsuarios] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editingUsuario, setEditingUsuario] = useState<UserProfile | null>(null)

  const fetchUsuarios = async () => {
    setLoading(true)
    const { data } = await supabase.from('users').select('*').order('nome')
    setUsuarios((data || []) as UserProfile[])
    setLoading(false)
  }

  useEffect(() => {
    fetchUsuarios()
  }, [])

  const handleDelete = async (id: string, role: string | null) => {
    if (role === 'admin') {
      toast({
        title: 'Ação Bloqueada',
        description: 'Não é possível excluir o administrador principal.',
        variant: 'destructive',
      })
      return
    }
    if (
      !confirm(
        'Atenção: Ao excluir este usuário, ele perderá permanentemente o acesso ao sistema. Deseja continuar?',
      )
    )
      return

    try {
      const { data, error } = await supabase.functions.invoke('manage-users', {
        body: { action: 'delete', payload: { id } },
        headers: { Authorization: `Bearer ${session?.access_token}` },
      })

      if (error || data?.error) throw error || new Error(data?.error)

      toast({ title: 'Sucesso', description: 'Usuário removido com sucesso.' })
      fetchUsuarios()
    } catch (err: any) {
      toast({
        title: 'Erro ao excluir',
        description: err.message || 'Verifique sua conexão ou tente novamente.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-primary" /> Equipe e Acessos
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie os acessos e permissões dos colaboradores na sua loja.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingUsuario(null)
            setFormOpen(true)
          }}
        >
          <Plus className="h-4 w-4 mr-2" /> Cadastrar Colaborador
        </Button>
      </div>

      <Card className="shadow-sm border-slate-200 dark:border-slate-800 flex-1 flex flex-col min-h-0 bg-card">
        <CardContent className="p-0 flex-1 overflow-auto">
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader className="sticky top-0 bg-muted/80 backdrop-blur-md z-10 shadow-sm border-b">
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email de Acesso</TableHead>
                  <TableHead>Nível de Acesso</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usuarios.map((usuario) => (
                  <TableRow key={usuario.id}>
                    <TableCell className="font-medium text-foreground">
                      {usuario.nome || 'Sem Nome'}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{usuario.email}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          usuario.role === 'admin'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
                        }`}
                      >
                        {usuario.role === 'admin' ? 'Administrador' : 'Operador'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingUsuario(usuario)
                          setFormOpen(true)
                        }}
                      >
                        <Edit className="h-4 w-4 mr-1" /> Editar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(usuario.id, usuario.role)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <UsuarioFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        usuario={editingUsuario}
        onSuccess={fetchUsuarios}
      />
    </div>
  )
}
