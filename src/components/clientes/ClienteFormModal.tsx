import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { supabase } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'
import { Cliente } from '@/types'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const clienteSchema = z.object({
  nome: z.string().min(2, 'O nome é obrigatório'),
  cpf: z.string().optional(),
  telefone: z
    .string()
    .refine(
      (val) => !val || val.replace(/\D/g, '').length >= 10,
      'Telefone deve ter ao menos 10 dígitos',
    )
    .optional(),
  email: z.union([z.literal(''), z.string().email('E-mail inválido')]).optional(),
  endereco: z.string().optional(),
})

interface Props {
  open: boolean
  onClose: () => void
  cliente: Cliente | null
  onSuccess: () => void
}

export function ClienteFormModal({ open, onClose, cliente, onSuccess }: Props) {
  const [loading, setLoading] = useState(false)
  const form = useForm<z.infer<typeof clienteSchema>>({
    resolver: zodResolver(clienteSchema),
    defaultValues: { nome: '', cpf: '', telefone: '', email: '', endereco: '' },
  })

  useEffect(() => {
    if (cliente && open) {
      form.reset({
        nome: cliente.nome,
        cpf: cliente.cpf || '',
        telefone: cliente.telefone || '',
        email: cliente.email || '',
        endereco: cliente.endereco || '',
      })
    } else if (open) {
      form.reset({ nome: '', cpf: '', telefone: '', email: '', endereco: '' })
    }
  }, [cliente, open, form])

  const onSubmit = async (data: z.infer<typeof clienteSchema>) => {
    setLoading(true)
    const payload = {
      nome: data.nome,
      cpf: data.cpf || null,
      telefone: data.telefone || null,
      email: data.email || null,
      endereco: data.endereco || null,
    }

    if (cliente) {
      const { error } = await supabase.from('clientes').update(payload).eq('id', cliente.id)
      if (error)
        toast({ title: 'Erro', description: 'Não foi possível atualizar.', variant: 'destructive' })
      else {
        toast({ title: 'Sucesso', description: 'Cliente atualizado.' })
        onSuccess()
        onClose()
      }
    } else {
      const { error } = await supabase.from('clientes').insert(payload)
      if (error)
        toast({ title: 'Erro', description: 'Não foi possível cadastrar.', variant: 'destructive' })
      else {
        toast({ title: 'Sucesso', description: 'Cliente cadastrado com sucesso.' })
        onSuccess()
        onClose()
      }
    }
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-card text-card-foreground">
        <DialogHeader>
          <DialogTitle>{cliente ? 'Editar Cliente' : 'Novo Cliente'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cpf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPF</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="telefone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endereco"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereço</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Salvar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
