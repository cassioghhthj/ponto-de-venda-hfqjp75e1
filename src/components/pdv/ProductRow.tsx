import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { formatCurrency } from '@/lib/format'
import { Product } from '@/types'
import { useCart } from '@/context/CartContext'

export function ProductRow({ product }: { product: Product }) {
  const { addItem } = useCart()

  return (
    <div className="flex items-center p-3 sm:p-4 bg-card border border-border rounded-xl shadow-sm hover:border-primary/50 transition-colors group relative w-full">
      <div className="relative h-14 w-14 sm:h-16 sm:w-16 shrink-0 bg-muted/30 rounded-lg overflow-hidden flex items-center justify-center mr-3 sm:mr-4">
        <img
          src={
            product.imagem_url ||
            `https://img.usecurling.com/p/200/200?q=${encodeURIComponent(product.nome)}`
          }
          alt={product.nome}
          className="object-contain h-full w-full mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-300"
        />
        {product.estoque <= 0 && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px] flex items-center justify-center z-10">
            <span className="text-[10px] font-bold text-destructive px-1 text-center leading-tight">
              ESGOTADO
            </span>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 mr-3">
        <div className="text-[10px] sm:text-xs font-medium text-muted-foreground mb-0.5 uppercase tracking-wider line-clamp-1">
          {product.categoria || 'Sem categoria'}
        </div>
        <h3 className="font-semibold text-sm sm:text-base leading-tight text-foreground truncate">
          {product.nome}
        </h3>
        {product.estoque > 0 && product.estoque <= 5 && (
          <div className="text-[10px] sm:text-xs text-orange-500 mt-1 font-medium">
            Restam {product.estoque} na loja
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 sm:gap-6 shrink-0">
        <div className="text-right flex flex-col">
          <span className="font-bold text-sm sm:text-lg text-primary leading-none">
            {formatCurrency(product.preco_venda || product.preco)}
          </span>
        </div>

        <Button
          size="icon"
          className="h-11 w-11 sm:h-12 sm:w-12 rounded-full shrink-0 shadow-sm"
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
