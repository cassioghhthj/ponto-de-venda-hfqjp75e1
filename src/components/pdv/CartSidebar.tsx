import { useCart } from '@/context/CartContext'
import { formatCurrency } from '@/lib/format'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react'
import { CheckoutModal } from './CheckoutModal'
import { useState } from 'react'

export function CartSidebar() {
  const { items, subtotal, total, updateQuantity, removeItem, clearCart } = useCart()
  const [isCheckoutOpen, setCheckoutOpen] = useState(false)

  return (
    <div className="w-80 bg-white border-l shadow-xl flex flex-col h-full shrink-0 z-20">
      <div className="p-4 border-b bg-slate-50 flex items-center justify-between">
        <h2 className="font-bold flex items-center gap-2 text-lg">
          <ShoppingCart className="h-5 w-5 text-primary" /> Carrinho
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearCart}
          className="text-red-500 text-xs h-8 hover:text-red-600 hover:bg-red-50"
        >
          Limpar
        </Button>
      </div>
      <ScrollArea className="flex-1 p-4">
        {items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground mt-20 gap-3">
            <ShoppingCart className="h-12 w-12 opacity-20" />
            <p className="font-medium">O carrinho está vazio</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-3 border-b pb-4 last:border-0">
                <div className="h-16 w-16 bg-slate-100 rounded-md p-1.5 shrink-0 flex items-center justify-center border">
                  <img
                    src={item.imagem_url}
                    alt={item.nome}
                    className="h-full w-full object-contain mix-blend-multiply"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold line-clamp-2 leading-tight mb-1">
                    {item.nome}
                  </h4>
                  <div className="text-primary font-bold text-sm mb-2">
                    {formatCurrency(item.preco)}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-7 w-7 rounded-full"
                      onClick={() => updateQuantity(item.id, -1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="text-sm w-6 text-center font-semibold">{item.quantity}</span>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-7 w-7 rounded-full"
                      onClick={() => updateQuantity(item.id, 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 ml-auto text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
      <div className="p-5 bg-slate-50 border-t space-y-4 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
        <div className="flex justify-between text-sm text-slate-500">
          <span>Subtotal</span>
          <span className="font-medium text-slate-700">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-xl font-bold items-center">
          <span>Total</span>
          <span className="text-primary text-2xl">{formatCurrency(total)}</span>
        </div>
        <Button
          className="w-full h-14 text-lg font-bold shadow-sm"
          disabled={items.length === 0}
          onClick={() => setCheckoutOpen(true)}
        >
          Finalizar Venda
        </Button>
      </div>
      <CheckoutModal open={isCheckoutOpen} onOpenChange={setCheckoutOpen} />
    </div>
  )
}
