import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { formatCurrency } from '@/lib/format'
import { Product } from '@/types'
import { useCart } from '@/context/CartContext'

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()

  return (
    <Card className="overflow-hidden flex flex-col hover:border-primary/50 transition-colors bg-card group relative">
      <div className="aspect-square bg-muted/30 p-4 flex items-center justify-center relative">
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
            <Badge variant="destructive" className="text-sm px-3 py-1">
              Esgotado
            </Badge>
          </div>
        )}
      </div>
      <CardContent className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="text-xs text-muted-foreground mb-1">
            {product.categoria || 'Sem categoria'}
          </div>
          <h3 className="font-semibold line-clamp-2 text-sm leading-tight mb-2 text-foreground">
            {product.nome}
          </h3>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="font-bold text-primary">{formatCurrency(product.preco)}</span>
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 rounded-full"
            onClick={() => addItem(product)}
            disabled={product.estoque <= 0}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
