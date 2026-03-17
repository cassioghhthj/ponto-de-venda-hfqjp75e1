import { useEffect, useState } from 'react'
import { useCart } from '@/context/CartContext'
import { formatCurrency } from '@/lib/format'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Minus, Plus, Trash2, ShoppingCart, Banknote } from 'lucide-react'
import { CheckoutModal } from './CheckoutModal'

export function CartSidebar() {
  const { items, total, subtotal, discount, updateQuantity, removeItem, clearCart, setDiscount } =
    useCart()
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F4') {
        e.preventDefault()
        if (items.length > 0) setCheckoutOpen(true)
      }
      if (e.key === 'F2') {
        e.preventDefault()
        clearCart()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [items.length, clearCart])

  return (
    <>
      <aside className="w-[380px] bg-white border-l flex flex-col h-full shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)] z-10 relative">
        <div className="p-4 bg-primary text-primary-foreground flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <ShoppingCart className="h-5 w-5" />
            Venda Atual
          </div>
          <span className="bg-primary-foreground/20 px-2 py-0.5 rounded text-sm font-medium">
            {items.length} itens
          </span>
        </div>

        <ScrollArea className="flex-1 p-2">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground pt-20">
              <ShoppingCart className="h-16 w-16 mb-4 opacity-20" />
              <p>Carrinho vazio</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-50 p-3 rounded-lg border group animate-slide-in-right"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-sm leading-tight pr-4">{item.name}</span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 bg-white rounded-md border h-8">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="px-2 hover:text-primary"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="px-2 hover:text-primary"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <span className="font-semibold text-primary">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="border-t bg-slate-50 p-4 space-y-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between items-center text-muted-foreground">
              <span>Desconto (R$)</span>
              <Input
                type="number"
                className="w-24 h-8 text-right bg-white"
                value={discount || ''}
                onChange={(e) => setDiscount(Number(e.target.value))}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="bg-primary text-primary-foreground p-4 rounded-xl flex justify-between items-center shadow-lg">
            <span className="text-sm font-medium opacity-80 uppercase tracking-wider">Total</span>
            <span className="text-3xl font-bold tracking-tight">{formatCurrency(total)}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <Button
              variant="outline"
              className="h-12 w-full text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
              onClick={clearCart}
            >
              F2 - Remover
            </Button>
            <Button
              className="h-12 w-full font-bold shadow-md hover:shadow-lg transition-all"
              disabled={items.length === 0}
              onClick={() => setCheckoutOpen(true)}
            >
              F4 - Finalizar
            </Button>
          </div>
        </div>
      </aside>

      <CheckoutModal open={checkoutOpen} onOpenChange={setCheckoutOpen} />
    </>
  )
}
