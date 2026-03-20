import { useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const despesaSchema = z.object({
  descricao: z.string().min(2, 'Descrição obrigatória'),
  valor: z.coerce.number().min(0.01, 'Valor deve ser maior que zero'),
  data_vencimento: z.string().min(1, 'Data é obrigatória'),
  categoria: z.string().optional(),
  fornecedor: z.string().optional(),
})

export type DespesaFormData = z.infer<typeof despesaSchema>

interface DespesaModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: {
    descricao: string
    valor: number
    data_vencimento: string
    categoria?: string | null
    fornecedor?: string | null
  } | null
  onSubmit: (data: DespesaFormData) => Promise<void>
  title: string
}

export function DespesaModal({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  title,
}: DespesaModalProps) {
  const form = useForm<DespesaFormData>({
    resolver: zodResolver(despesaSchema),
    defaultValues: {
      descricao: '',
      valor: 0,
      data_vencimento: new Date().toISOString().split('T')[0],
      categoria: '',
      fornecedor: '',
    },
  })

  useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset({
          descricao: initialData.descricao,
          valor: initialData.valor,
          data_vencimento: initialData.data_vencimento
            ? initialData.data_vencimento.split('T')[0]
            : new Date().toISOString().split('T')[0],
          categoria: initialData.categoria || '',
          fornecedor: initialData.fornecedor || '',
        })
      } else {
        form.reset({
          descricao: '',
          valor: 0,
          data_vencimento: new Date().toISOString().split('T')[0],
          categoria: '',
          fornecedor: '',
        })
      }
    }
  }, [open, initialData, form])

  const handleSubmit = async (data: DespesaFormData) => {
    await onSubmit(data)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição *</FormLabel>
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
                name="valor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor *</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="data_vencimento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vencimento *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="categoria"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Energia" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fornecedor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fornecedor</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Enel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
