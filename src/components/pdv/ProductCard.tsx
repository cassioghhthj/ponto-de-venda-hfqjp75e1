import { Product } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { formatCurrency } from '@/lib/format'
import { useCart } from '@/context/CartContext'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()

  return (
    <Card
      className="group overflow-hidden hover:shadow-md transition-all duration-200 hover:scale-[1.02] cursor-pointer bg-white"
      onClick={() => addItem(product)}
    >
      <div className="aspect-square bg-muted p-4 flex items-center justify-center">
        <img
          src={product.image}
          alt={product.name}
          className="object-contain w-full h-full mix-blend-multiply drop-shadow-sm group-hover:scale-105 transition-transform"
        />
      </div>
      <CardContent className="p-4">
        <div className="text-xs text-muted-foreground mb-1 font-mono">{product.code}</div>
        <h3 className="font-semibold text-sm leading-tight line-clamp-2 h-10 mb-2">
          {product.name}
        </h3>
        <div className="flex items-center justify-between mt-auto">
          <span className="font-bold text-lg text-primary">{formatCurrency(product.price)}</span>
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 rounded-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
