import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Banknote, CreditCard, QrCode, CalendarClock, Loader2, Tag } from 'lucide-react'
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

type PaymentMethod = 'Dinheiro' | 'Débito' | 'Crédito' | 'PIX' | 'A Prazo' | null

export function CheckoutModal({ open, onOpenChange }: CheckoutModalProps) {
  const { items, subtotal, total, discount, setDiscount, clearCart } = useCart()
  const { user } = useAuth()
  const [method, setMethod] = useState<PaymentMethod>(null)
  const [amountReceived, setAmountReceived] = useState<string>('')
  const [discountInput, setDiscountInput] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [receipt, setReceipt] = useState<SaleRecord | null>(null)
  const [selectedCustomer, setSelectedCustomer] = useState<Cliente | null>(null)

  useEffect(() => {
    if (open) {
      setMethod(null)
      setAmountReceived('')
      setReceipt(null)
      setSelectedCustomer(null)
      setDiscountInput(discount > 0 ? discount.toString() : '')
    }
  }, [open, discount])

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && receipt) clearCart()
    onOpenChange(newOpen)
  }

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setDiscountInput(val)
    setDiscount(Number(val) || 0)
  }

  const handleConfirm = async () => {
    if (!method || !user) return
    if (method === 'A Prazo' && !selectedCustomer) {
      toast({
        title: 'Atenção',
        description: 'Vendas A Prazo exigem cliente associado.',
        variant: 'destructive',
      })
      return
    }
    const numericReceived = parseFloat(amountReceived.replace(',', '.')) || 0
    if (method === 'Dinheiro' && numericReceived < total) {
      toast({
        title: 'Atenção',
        description: 'Valor recebido insuficiente.',
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Security Validation: Ensure the user actually has an open cashier session
      const { data: caixa, error: caixaError } = await supabase
        .from('caixa')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'aberto')
        .maybeSingle()

      if (caixaError || !caixa) {
        toast({
          title: 'Caixa Fechado',
          description: 'Abra o caixa antes de realizar uma venda.',
          variant: 'destructive',
        })
        setIsSubmitting(false)
        return
      }

      const { data: venda, error: vendaError } = await supabase
        .from('vendas')
        .insert({
          user_id: user.id,
          cliente_id: selectedCustomer?.id || null,
          total,
          desconto: discount,
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

      if (method === 'A Prazo') {
        const d = new Date()
        d.setDate(d.getDate() + 30)
        await (supabase as any).from('contas_receber').insert({
          venda_id: venda.id,
          cliente_id: selectedCustomer?.id || null,
          valor: total,
          data_vencimento: d.toISOString(),
          status: 'pendente',
        })
      } else {
        await (supabase as any).from('contas_receber').insert({
          venda_id: venda.id,
          cliente_id: selectedCustomer?.id || null,
          valor: total,
          data_vencimento: new Date().toISOString(),
          status: 'pago',
          data_pagamento: new Date().toISOString(),
        })
      }

      for (const item of items) {
        await supabase.rpc('decrement_stock', { p_id: item.id, qty: item.quantity })
      }

      const receiptData: SaleRecord = {
        id: venda.id,
        data: venda.data || new Date().toISOString(),
        total,
        desconto: discount,
        metodo_pagamento: method,
        items: items.map((i) => ({
          nome: i.nome,
          quantidade: i.quantity,
          preco_unitario: i.preco,
        })),
      }
      setReceipt(receiptData)
      toast({ title: 'Venda realizada com sucesso!' })
    } catch (error) {
      toast({ title: 'Erro', description: 'Falha ao salvar a venda.', variant: 'destructive' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const change =
    (parseFloat(amountReceived.replace(',', '.')) || 0) > total
      ? (parseFloat(amountReceived.replace(',', '.')) || 0) - total
      : 0

  if (receipt)
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-md bg-card">
          <ReceiptView
            receipt={receipt}
            change={change}
            onNewSale={() => handleOpenChange(false)}
          />
        </DialogContent>
      </Dialog>
    )

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl sm:rounded-2xl bg-card">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Finalizar Venda</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-8 py-2">
          <div className="space-y-8">
            <CustomerSelect onSelect={setSelectedCustomer} />
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Forma de Pagamento
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'Dinheiro', icon: Banknote },
                  { id: 'Débito', icon: CreditCard },
                  { id: 'Crédito', icon: CreditCard },
                  { id: 'PIX', icon: QrCode },
                  { id: 'A Prazo', icon: CalendarClock },
                ].map((m) => (
                  <Button
                    key={m.id}
                    variant={method === m.id ? 'default' : 'outline'}
                    className={`h-16 flex flex-col gap-1 ${method === m.id ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                    onClick={() => setMethod(m.id as PaymentMethod)}
                  >
                    <m.icon className="h-5 w-5" /> <span>{m.id}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-muted/50 p-6 rounded-xl border border-border flex flex-col shadow-sm">
            <div className="space-y-5 flex-1">
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>Subtotal dos Itens</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="space-y-2 pb-4 border-b border-border/50">
                <Label htmlFor="discount" className="flex items-center gap-2">
                  <Tag className="h-4 w-4" /> Desconto Aplicado (R$)
                </Label>
                <Input
                  id="discount"
                  type="number"
                  placeholder="0.00"
                  min="0"
                  max={subtotal}
                  value={discountInput}
                  onChange={handleDiscountChange}
                  className="bg-background font-medium"
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-medium text-lg">Total a Pagar</span>
                <span className="font-bold text-4xl text-foreground">{formatCurrency(total)}</span>
              </div>
              {method === 'Dinheiro' && (
                <div className="space-y-4 pt-4 animate-in fade-in">
                  <div className="space-y-2">
                    <Label>Valor Recebido (R$)</Label>
                    <Input
                      type="number"
                      className="text-xl h-12 font-semibold bg-background"
                      value={amountReceived}
                      onChange={(e) => setAmountReceived(e.target.value)}
                      autoFocus
                    />
                  </div>
                  <div className="flex justify-between items-center text-lg text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg border border-emerald-100 dark:border-emerald-900/50">
                    <span>Troco</span>
                    <span>{formatCurrency(change)}</span>
                  </div>
                </div>
              )}
            </div>
            <Button
              className="w-full h-14 text-lg font-bold mt-8"
              disabled={
                !method ||
                (method === 'Dinheiro' &&
                  (parseFloat(amountReceived.replace(',', '.')) || 0) < total) ||
                isSubmitting
              }
              onClick={handleConfirm}
            >
              {isSubmitting && <Loader2 className="h-5 w-5 animate-spin mr-2" />} Confirmar
              Pagamento
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
