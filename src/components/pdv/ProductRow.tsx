import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { formatCurrency } from '@/lib/format'
import { Product } from '@/types'
import { useCart } from '@/context/CartContext'

export function ProductRow({ product }: { product: Product }) {
  const { addItem } = useCart()

  return (
    <div className="flex items-center justify-between py-3 px-4 border-b border-border last:border-0 hover:bg-muted/30 transition-colors w-full group">
      <div className="flex-1 min-w-0 pr-4">
        <h3 className="font-medium text-sm sm:text-base leading-tight text-foreground line-clamp-2">
          {product.nome}
        </h3>
      </div>

      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        <span className="font-bold text-base sm:text-lg text-primary tabular-nums whitespace-nowrap">
          {formatCurrency(product.preco_venda || product.preco)}
        </span>

        <Button
          size="icon"
          className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg shrink-0 shadow-sm"
          onClick={() => addItem(product)}
          disabled={product.estoque <= 0}
          aria-label={`Adicionar ${product.nome} ao carrinho`}
        >
          <Plus className="h-5 w-5 sm:h-6 sm:w-6" />
        </Button>
      </div>
    </div>
  )
}
