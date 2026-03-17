import { useEffect } from 'react'
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
import { Product } from '@/types'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const schema = z.object({
  nome: z.string().min(2, 'O nome é obrigatório'),
  codigo: z.string().min(1, 'Código (SKU) é obrigatório'),
  preco: z.coerce.number().min(0.01, 'Preço deve ser maior que 0'),
  estoque: z.coerce.number().min(0, 'Estoque não pode ser negativo'),
  estoque_minimo: z.coerce.number().min(0, 'Estoque mínimo inválido'),
  categoria: z.string().optional(),
})

interface Props {
  open: boolean
  onClose: () => void
  product: Product | null
  onSuccess: () => void
}

export function ProdutoFormModal({ open, onClose, product, onSuccess }: Props) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { nome: '', codigo: '', preco: 0, estoque: 0, estoque_minimo: 0, categoria: '' },
  })

  useEffect(() => {
    if (product && open) {
      form.reset({
        nome: product.nome,
        codigo: product.codigo || '',
        preco: product.preco,
        estoque: product.estoque,
        estoque_minimo: product.estoque_minimo,
        categoria: product.categoria || '',
      })
    } else if (open) {
      form.reset({ nome: '', codigo: '', preco: 0, estoque: 0, estoque_minimo: 0, categoria: '' })
    }
  }, [product, open, form])

  const onSubmit = async (data: z.infer<typeof schema>) => {
    let query = supabase.from('produtos').select('id').eq('codigo', data.codigo)
    if (product) query = query.neq('id', product.id)

    const { data: existing } = await query
    if (existing && existing.length > 0) {
      form.setError('codigo', { message: 'Este código já está em uso' })
      return
    }

    const payload = {
      ...data,
      categoria: data.categoria || null,
    }

    if (product) {
      const { error } = await supabase.from('produtos').update(payload).eq('id', product.id)
      if (error)
        toast({ title: 'Erro', description: 'Não foi possível atualizar.', variant: 'destructive' })
      else {
        toast({ title: 'Sucesso', description: 'Produto atualizado.' })
        onSuccess()
        onClose()
      }
    } else {
      const { error } = await supabase.from('produtos').insert(payload)
      if (error)
        toast({ title: 'Erro', description: 'Não foi possível cadastrar.', variant: 'destructive' })
      else {
        toast({ title: 'Sucesso', description: 'Produto cadastrado com sucesso.' })
        onSuccess()
        onClose()
      }
    }
  }

  const isSubmitting = form.formState.isSubmitting

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-card text-card-foreground">
        <DialogHeader>
          <DialogTitle>{product ? 'Editar Produto' : 'Novo Produto'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Produto *</FormLabel>
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
                name="codigo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código (SKU) *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categoria"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="preco"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço (R$) *</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="estoque"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estoque</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="estoque_minimo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Est. Min.</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Salvar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
