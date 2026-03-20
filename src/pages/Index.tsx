import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProductRow } from '@/components/pdv/ProductRow'
import { Search, Loader2, PackageX } from 'lucide-react'
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
    <div className="h-full flex flex-col animate-fade-in w-full max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6 shrink-0">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou código..."
            className="pl-10 h-12 text-base shadow-sm border-border bg-background rounded-xl"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
        <div className="flex flex-col gap-3 overflow-y-auto pb-4 px-1 min-h-0">
          {filteredProducts.map((product) => (
            <ProductRow key={product.id} product={product} />
          ))}
          {filteredProducts.length === 0 && (
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
