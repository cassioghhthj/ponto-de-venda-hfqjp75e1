import { useCart } from '@/context/CartContext'
import { formatCurrency } from '@/lib/format'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Minus, Plus, Trash2, ShoppingCart, X } from 'lucide-react'
import { CheckoutModal } from './CheckoutModal'
import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { toast } from '@/hooks/use-toast'
import { useIsMobile } from '@/hooks/use-mobile'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

export function CartSidebar() {
  const { items, subtotal, discount, total, updateQuantity, removeItem, clearCart } = useCart()
  const { user } = useAuth()
  const [isCheckoutOpen, setCheckoutOpen] = useState(false)
  const isMobile = useIsMobile()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleCheckoutClick = async () => {
    if (!user) return
    const { data } = await supabase
      .from('caixa')
      .select('id')
      .eq('user_id', user.id)
      .eq('status', 'aberto')

    if (!data || data.length === 0) {
      toast({
        title: 'Venda bloqueada',
        description: 'O caixa deve estar aberto para realizar vendas.',
        variant: 'destructive',
      })
      return
    }
    setCheckoutOpen(true)
  }

  const cartItemCount = items.reduce((acc, i) => acc + i.quantity, 0)

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-background print:hidden">
      <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between shrink-0">
        <h2 className="font-bold flex items-center gap-2 text-lg text-foreground">
          <ShoppingCart className="h-5 w-5 text-primary" /> Carrinho
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearCart}
            className="text-destructive text-xs h-8 hover:text-destructive hover:bg-destructive/10"
          >
            Limpar
          </Button>
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 ml-1"
              onClick={() => setMobileOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
      <ScrollArea className="flex-1 p-4 min-h-0">
        {items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground mt-20 gap-3">
            <ShoppingCart className="h-12 w-12 opacity-20" />
            <p className="font-medium">O carrinho está vazio</p>
          </div>
        ) : (
          <div className="space-y-4 pb-10">
            {items.map((item) => (
              <div key={item.id} className="flex gap-3 border-b border-border pb-4 last:border-0">
                <div className="h-16 w-16 bg-muted/50 rounded-md p-1.5 shrink-0 flex items-center justify-center border border-border">
                  <img
                    src={
                      item.imagem_url ||
                      `https://img.usecurling.com/p/100/100?q=${encodeURIComponent(item.nome)}`
                    }
                    alt={item.nome}
                    className="h-full w-full object-contain mix-blend-multiply dark:mix-blend-normal"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold line-clamp-2 leading-tight mb-1 text-foreground">
                    {item.nome}
                  </h4>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-primary font-bold text-sm">
                      {formatCurrency(item.preco)}
                    </span>
                    {item.tamanho && (
                      <span className="text-xs bg-muted px-1.5 rounded text-muted-foreground">
                        {item.tamanho}
                      </span>
                    )}
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
                    <span className="text-sm w-6 text-center font-semibold text-foreground">
                      {item.quantity}
                    </span>
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
                      className="h-7 w-7 ml-auto text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full"
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
      <div className="p-4 sm:p-5 bg-card border-t border-border space-y-3 sm:space-y-4 shadow-[0_-4px_10px_rgba(0,0,0,0.02)] dark:shadow-none shrink-0">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Subtotal</span>
          <span className="font-medium text-foreground">{formatCurrency(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm text-emerald-600 font-medium">
            <span>Desconto</span>
            <span>-{formatCurrency(discount)}</span>
          </div>
        )}
        <div className="flex justify-between text-lg sm:text-xl font-bold items-center border-t pt-2 border-border/50">
          <span className="text-foreground">Total</span>
          <span className="text-primary text-xl sm:text-2xl">{formatCurrency(total)}</span>
        </div>
        <Button
          className="w-full h-12 sm:h-14 text-base sm:text-lg font-bold shadow-sm"
          disabled={items.length === 0}
          onClick={handleCheckoutClick}
        >
          Finalizar Venda
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {isMobile ? (
        <>
          <Button
            className={cn(
              'fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl z-40 transition-transform duration-300',
              cartItemCount > 0 ? 'animate-bounce hover:animate-none' : '',
            )}
            onClick={() => setMobileOpen(true)}
          >
            <ShoppingCart className="h-6 w-6" />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold border-2 border-background">
                {cartItemCount}
              </span>
            )}
          </Button>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetContent
              side="bottom"
              className="h-[90vh] p-0 flex flex-col rounded-t-xl [&>button]:hidden"
            >
              <SheetTitle className="sr-only">Carrinho de Compras</SheetTitle>
              <SidebarContent />
            </SheetContent>
          </Sheet>
        </>
      ) : (
        <div className="w-80 bg-background border-l border-border shadow-xl flex flex-col h-full shrink-0 z-20 transition-all duration-300 print:hidden">
          <SidebarContent />
        </div>
      )}
      <CheckoutModal
        open={isCheckoutOpen}
        onOpenChange={(open) => {
          setCheckoutOpen(open)
          if (!open && isMobile && items.length === 0) setMobileOpen(false)
        }}
      />
    </>
  )
}
