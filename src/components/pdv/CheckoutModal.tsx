import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Banknote, CreditCard, QrCode, Loader2 } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { formatCurrency } from '@/lib/format'
import { toast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { Cliente, SaleRecord } from '@/types'
import { ReceiptView } from './ReceiptView'
import { CustomerSelect } from './CustomerSelect'

interface CheckoutModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type PaymentMethod = 'Dinheiro' | 'Débito' | 'Crédito' | 'PIX' | null

export function CheckoutModal({ open, onOpenChange }: CheckoutModalProps) {
  const { items, total, clearCart } = useCart()
  const { user } = useAuth()
  const [method, setMethod] = useState<PaymentMethod>(null)
  const [amountReceived, setAmountReceived] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [receipt, setReceipt] = useState<SaleRecord | null>(null)
  const [selectedCustomer, setSelectedCustomer] = useState<Cliente | null>(null)

  useEffect(() => {
    if (open) {
      setMethod(null)
      setAmountReceived('')
      setReceipt(null)
      setSelectedCustomer(null)
    }
  }, [open])

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && receipt) clearCart()
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
          cliente_id: selectedCustomer?.id || null,
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
        cliente_id: selectedCustomer?.id || null,
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
        description: `Pagamento via ${method} registrado.`,
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
      toast({ title: 'Erro', description: 'Falha ao salvar a venda.', variant: 'destructive' })
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
          <ReceiptView
            receipt={receipt}
            change={change}
            onNewSale={() => handleOpenChange(false)}
          />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-3xl sm:rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Finalizar Venda</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-2">
          <div className="space-y-8">
            <CustomerSelect onSelect={setSelectedCustomer} />

            <div className="space-y-4">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
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
                    className={`h-20 flex flex-col gap-2 ${method === m.id ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                    onClick={() => setMethod(m.id as PaymentMethod)}
                  >
                    <m.icon className="h-6 w-6" />
                    <span>{m.id}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 flex flex-col justify-between shadow-sm">
            <div className="space-y-4">
              <div className="flex justify-between items-center text-lg">
                <span className="text-muted-foreground font-medium">Total a Pagar</span>
                <span className="font-bold text-3xl text-slate-900">{formatCurrency(total)}</span>
              </div>

              {method === 'Dinheiro' && (
                <div className="space-y-4 pt-6 border-t border-slate-200 animate-in fade-in slide-in-from-top-2">
                  <div className="space-y-2">
                    <Label htmlFor="received" className="text-slate-600 font-medium">
                      Valor Recebido
                    </Label>
                    <Input
                      id="received"
                      type="number"
                      placeholder="0.00"
                      className="text-xl h-14 font-semibold text-slate-900 bg-white"
                      value={amountReceived}
                      onChange={(e) => setAmountReceived(e.target.value)}
                      autoFocus
                    />
                  </div>
                  <div className="flex justify-between items-center text-lg text-emerald-600 font-bold bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                    <span>Troco</span>
                    <span>{formatCurrency(change)}</span>
                  </div>
                </div>
              )}
            </div>

            <Button
              className="w-full h-14 text-lg font-bold mt-8 shadow-sm"
              disabled={
                !method || (method === 'Dinheiro' && numericReceived < total) || isSubmitting
              }
              onClick={handleConfirm}
            >
              {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
              {isSubmitting ? 'Processando...' : 'Confirmar Pagamento'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
