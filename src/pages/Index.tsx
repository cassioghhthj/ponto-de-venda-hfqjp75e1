import { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProductRow } from '@/components/pdv/ProductRow'
import { Search, Loader2, PackageX } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { Product } from '@/types'
import { useCart } from '@/context/CartContext'

export default function Index() {
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Todos')
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase.from('produtos').select('*').order('nome')
      if (data) setProducts(data)
      setLoading(false)
    }
    fetchProducts()
  }, [])

  const categories = [
    'Todos',
    ...Array.from(new Set(products.map((p) => p.categoria).filter(Boolean))),
  ]

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.nome.toLowerCase().includes(search.toLowerCase()) || p.codigo?.includes(search)
    const matchesCategory = category === 'Todos' || p.categoria === category
    return matchesSearch && matchesCategory && p.estoque > 0
  })

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const currentValue = (e.target as HTMLInputElement).value.trim()
      if (!currentValue) return

      const exactMatch = products.find((p) => p.codigo === currentValue && p.estoque > 0)
      if (exactMatch) {
        e.preventDefault()
        addItem(exactMatch)
        setSearch('')

        // Ensure focus remains on input for the next scan
        setTimeout(() => {
          inputRef.current?.focus()
        }, 10)
      }
    }
  }

  return (
    <div className="h-full flex flex-col animate-fade-in w-full max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6 shrink-0">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            ref={inputRef}
            placeholder="Buscar por nome ou código..."
            className="pl-10 h-12 text-base shadow-sm border-border bg-background rounded-xl"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        </div>

        <Tabs
          defaultValue="Todos"
          className="w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0"
          onValueChange={setCategory}
        >
          <TabsList className="h-12 p-1 bg-muted/50 border border-border rounded-xl">
            {categories.map((cat) => (
              <TabsTrigger
                key={cat}
                value={cat}
                className="px-5 py-2 rounded-lg font-medium capitalize"
              >
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto pb-4 min-h-0 px-1 sm:px-0">
          {filteredProducts.length > 0 ? (
            <div className="flex flex-col bg-card rounded-xl border border-border shadow-sm overflow-hidden mb-4">
              {filteredProducts.map((product) => (
                <ProductRow key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center text-muted-foreground flex flex-col items-center justify-center bg-muted/20 rounded-2xl border border-dashed border-border mt-4">
              <PackageX className="h-12 w-12 text-muted-foreground/50 mb-3" />
              <p className="text-lg font-medium text-foreground">Nenhum produto encontrado</p>
              <p className="text-sm">Tente ajustar a sua busca ou filtros.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
