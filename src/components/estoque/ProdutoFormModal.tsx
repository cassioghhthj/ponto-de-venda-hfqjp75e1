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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { supabase } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'
import { Product } from '@/types'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const schema = z.object({
  nome: z.string().min(2, 'O nome é obrigatório'),
  codigo: z.string().min(1, 'Código é obrigatório'),
  preco_custo: z.coerce.number().min(0, 'Custo inválido'),
  preco_venda: z.coerce.number().min(0.01, 'Preço de venda deve ser maior que 0'),
  estoque: z.coerce.number().min(0, 'Estoque não pode ser negativo'),
  estoque_minimo: z.coerce.number().min(0, 'Estoque mínimo inválido'),
  tamanho: z.string().optional(),
  categoria: z.string().optional(),
})

interface Props {
  open: boolean
  onClose: () => void
  product: Product | null
  onSuccess: () => void
}

const TAMANHOS = ['10', '12', '14', '16', 'P', 'M', 'G', 'GG', 'EG', 'Único']

export function ProdutoFormModal({ open, onClose, product, onSuccess }: Props) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: '',
      codigo: '',
      preco_custo: 0,
      preco_venda: 0,
      estoque: 0,
      estoque_minimo: 0,
      categoria: '',
      tamanho: '',
    },
  })

  useEffect(() => {
    if (product && open) {
      form.reset({
        nome: product.nome,
        codigo: product.codigo || '',
        preco_custo: product.preco_custo || 0,
        preco_venda: product.preco_venda || product.preco || 0,
        estoque: product.estoque,
        estoque_minimo: product.estoque_minimo,
        categoria: product.categoria || '',
        tamanho: product.tamanho || '',
      })
    } else if (open) {
      form.reset({
        nome: '',
        codigo: '',
        preco_custo: 0,
        preco_venda: 0,
        estoque: 0,
        estoque_minimo: 0,
        categoria: '',
        tamanho: '',
      })
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
      preco: data.preco_venda, // Keep sync for backward compatibility
      categoria: data.categoria || null,
      tamanho: data.tamanho || null,
    }

    const request = product
      ? supabase.from('produtos').update(payload).eq('id', product.id)
      : supabase.from('produtos').insert(payload)

    const { error } = await request
    if (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar o produto.',
        variant: 'destructive',
      })
    } else {
      toast({ title: 'Sucesso', description: 'Produto salvo com sucesso.' })
      onSuccess()
      onClose()
    }
  }

  const isSubmitting = form.formState.isSubmitting

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[500px] bg-card text-card-foreground">
        <DialogHeader>
          <DialogTitle>{product ? 'Editar Produto' : 'Novo Produto'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
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
                name="preco_custo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço Custo</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="preco_venda"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço Venda *</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tamanho"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tamanho</FormLabel>
                    <Select value={field.value || ''} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {TAMANHOS.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
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
                    <FormLabel>Estoque Mínimo</FormLabel>
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
