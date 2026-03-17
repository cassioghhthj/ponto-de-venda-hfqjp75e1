import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Banknote, CreditCard, QrCode, Smartphone } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { formatCurrency } from '@/lib/format'
import { toast } from '@/hooks/use-toast'

interface CheckoutModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type PaymentMethod = 'Dinheiro' | 'Débito' | 'Crédito' | 'PIX' | null

export function CheckoutModal({ open, onOpenChange }: CheckoutModalProps) {
  const { total, clearCart } = useCart()
  const [method, setMethod] = useState<PaymentMethod>(null)
  const [amountReceived, setAmountReceived] = useState<string>('')

  // Reset state when opened
  useEffect(() => {
    if (open) {
      setMethod(null)
      setAmountReceived('')
    }
  }, [open])

  const handleConfirm = () => {
    if (!method) return
    toast({
      title: 'Venda finalizada com sucesso!',
      description: `Pagamento de ${formatCurrency(total)} via ${method} aprovado.`,
      className: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    })
    clearCart()
    onOpenChange(false)
  }

  const numericReceived = parseFloat(amountReceived.replace(',', '.')) || 0
  const change = numericReceived > total ? numericReceived - total : 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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

              {method === 'PIX' && (
                <div className="pt-4 border-t flex flex-col items-center gap-2 animate-in fade-in slide-in-from-top-2">
                  <div className="bg-white p-2 rounded-lg shadow-sm border">
                    <QrCode className="w-32 h-32 text-slate-800" />
                  </div>
                  <Button variant="link" className="text-xs">
                    Copiar Chave PIX
                  </Button>
                </div>
              )}
            </div>

            <Button
              className="w-full h-14 text-lg font-bold mt-6"
              disabled={!method || (method === 'Dinheiro' && numericReceived < total)}
              onClick={handleConfirm}
            >
              Confirmar Pagamento (Enter)
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
