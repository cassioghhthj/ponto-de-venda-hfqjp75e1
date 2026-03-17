import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Banknote, CreditCard, QrCode, Loader2, CheckCircle2 } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { formatCurrency } from '@/lib/format'
import { toast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'

interface CheckoutModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type PaymentMethod = 'Dinheiro' | 'Débito' | 'Crédito' | 'PIX' | null

interface SaleRecord {
  id: string
  data: string
  total: number
  metodo_pagamento: string
  items: {
    nome: string
    quantidade: number
    preco_unitario: number
  }[]
}

export function CheckoutModal({ open, onOpenChange }: CheckoutModalProps) {
  const { items, total, clearCart } = useCart()
  const { user } = useAuth()
  const [method, setMethod] = useState<PaymentMethod>(null)
  const [amountReceived, setAmountReceived] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [receipt, setReceipt] = useState<SaleRecord | null>(null)

  useEffect(() => {
    if (open) {
      setMethod(null)
      setAmountReceived('')
      setReceipt(null)
    }
  }, [open])

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && receipt) {
      clearCart()
    }
    onOpenChange(newOpen)
  }

  const handleConfirm = async () => {
    if (!method || !user) return
    setIsSubmitting(true)

    try {
      const { data: venda, error: vendaError } = await supabase
        .from('vendas')
        .insert({
          user_id: user.id,
          total,
          metodo_pagamento: method,
          status: 'Concluído',
        })
        .select()
        .single()

      if (vendaError) throw vendaError

      const itensVenda = items.map((item) => ({
        venda_id: venda.id,
        produto_id: item.id,
        quantidade: item.quantity,
        preco_unitario: item.preco,
      }))

      const { error: itemsError } = await supabase.from('itens_venda').insert(itensVenda)
      if (itemsError) throw itemsError

      const dataVencimento = new Date()
      dataVencimento.setDate(dataVencimento.getDate() + 30)

      const { error: contasError } = await (supabase as any).from('contas_receber').insert({
        venda_id: venda.id,
        valor: total,
        data_vencimento: dataVencimento.toISOString(),
        status: 'pendente',
      })
      if (contasError) throw contasError

      for (const item of items) {
        await supabase.rpc('decrement_stock', { p_id: item.id, qty: item.quantity })
      }

      toast({
        title: 'Venda realizada com sucesso!',
        description: `Pagamento de ${formatCurrency(total)} via ${method} registrado.`,
        className: 'bg-emerald-50 border-emerald-200 text-emerald-900',
      })

      setReceipt({
        id: venda.id,
        data: venda.data || new Date().toISOString(),
        total,
        metodo_pagamento: method,
        items: items.map((i) => ({
          nome: i.nome,
          quantidade: i.quantity,
          preco_unitario: i.preco,
        })),
      })
    } catch (error) {
      console.error(error)
      toast({
        title: 'Erro ao processar',
        description: 'Não foi possível salvar a venda no banco de dados. Tente novamente.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const numericReceived = parseFloat(amountReceived.replace(',', '.')) || 0
  const change = numericReceived > total ? numericReceived - total : 0

  if (receipt) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-md sm:rounded-2xl">
          <DialogHeader className="text-center sm:text-center">
            <div className="mx-auto w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <DialogTitle className="text-2xl font-bold text-center">Venda Concluída!</DialogTitle>
          </DialogHeader>

          <div className="bg-slate-50 p-6 rounded-lg border text-sm space-y-4 font-mono mt-2 shadow-inner">
            <div className="text-center border-b border-dashed pb-4 mb-4 border-slate-300">
              <h3 className="font-bold text-lg mb-1">RECIBO DE VENDA</h3>
              <p className="text-slate-500 text-xs truncate">ID: {receipt.id}</p>
              <p className="text-slate-500 text-xs">
                {new Date(receipt.data).toLocaleString('pt-BR')}
              </p>
            </div>

            <div className="space-y-3 mb-4 max-h-[40vh] overflow-y-auto pr-2">
              {receipt.items.map((item, idx) => (
                <div key={idx} className="flex justify-between">
                  <div className="flex-1 pr-4">
                    <span className="block font-semibold line-clamp-1">{item.nome}</span>
                    <span className="text-xs text-slate-500">
                      {item.quantidade}x {formatCurrency(item.preco_unitario)}
                    </span>
                  </div>
                  <span className="font-medium">
                    {formatCurrency(item.quantidade * item.preco_unitario)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-dashed pt-4 mb-2 border-slate-300">
              <div className="flex justify-between font-bold text-xl mb-2">
                <span>TOTAL</span>
                <span>{formatCurrency(receipt.total)}</span>
              </div>
              <div className="flex justify-between text-slate-600 text-base">
                <span>Método</span>
                <span className="font-semibold">{receipt.metodo_pagamento}</span>
              </div>
              {receipt.metodo_pagamento === 'Dinheiro' && change > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium mt-1">
                  <span>Troco</span>
                  <span>{formatCurrency(change)}</span>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="mt-4 sm:justify-center">
            <Button
              className="w-full h-12 text-lg font-bold"
              onClick={() => handleOpenChange(false)}
            >
              Nova Venda
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl sm:rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Finalizar Venda</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6 py-4">
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Forma de Pagamento
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'Dinheiro', icon: Banknote },
                { id: 'Débito', icon: CreditCard },
                { id: 'Crédito', icon: CreditCard },
                { id: 'PIX', icon: QrCode },
              ].map((m) => (
                <Button
                  key={m.id}
                  variant={method === m.id ? 'default' : 'outline'}
                  className={`h-24 flex flex-col gap-2 ${method === m.id ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                  onClick={() => setMethod(m.id as PaymentMethod)}
                >
                  <m.icon className="h-8 w-8" />
                  <span>{m.id}</span>
                </Button>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-xl border flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-center text-lg">
                <span className="text-muted-foreground">Total a Pagar</span>
                <span className="font-bold text-2xl">{formatCurrency(total)}</span>
              </div>

              {method === 'Dinheiro' && (
                <div className="space-y-4 pt-4 border-t border-slate-200 animate-in fade-in slide-in-from-top-2">
                  <div className="space-y-2">
                    <Label htmlFor="received">Valor Recebido</Label>
                    <Input
                      id="received"
                      type="number"
                      placeholder="0.00"
                      className="text-lg h-12"
                      value={amountReceived}
                      onChange={(e) => setAmountReceived(e.target.value)}
                      autoFocus
                    />
                  </div>
                  <div className="flex justify-between items-center text-lg text-emerald-600 font-medium">
                    <span>Troco</span>
                    <span>{formatCurrency(change)}</span>
                  </div>
                </div>
              )}
            </div>

            <Button
              className="w-full h-14 text-lg font-bold mt-6"
              disabled={
                !method || (method === 'Dinheiro' && numericReceived < total) || isSubmitting
              }
              onClick={handleConfirm}
            >
              {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Confirmar Pagamento'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
