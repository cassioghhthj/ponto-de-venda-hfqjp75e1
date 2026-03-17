import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProductCard } from '@/components/pdv/ProductCard'
import { Search, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { Product } from '@/types'

export default function Index() {
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Todos')
  const [loading, setLoading] = useState(true)

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

  return (
    <div className="h-full flex flex-col animate-fade-in">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou código..."
            className="pl-10 h-12 text-base shadow-sm border-border bg-background"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
        </div>

        <Tabs
          defaultValue="Todos"
          className="w-full sm:w-auto overflow-x-auto"
          onValueChange={setCategory}
        >
          <TabsList className="h-12 p-1 bg-muted/50 border border-border">
            {categories.map((cat) => (
              <TabsTrigger
                key={cat}
                value={cat}
                className="px-6 py-2 rounded-md font-medium capitalize"
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 overflow-y-auto pb-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          {filteredProducts.length === 0 && (
            <div className="col-span-full py-20 text-center text-muted-foreground">
              <p className="text-lg font-medium">Nenhum produto disponível encontrado.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
