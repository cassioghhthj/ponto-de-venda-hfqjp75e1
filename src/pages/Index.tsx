import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { mockProducts } from '@/data/mock'
import { ProductCard } from '@/components/pdv/ProductCard'
import { Search } from 'lucide-react'

export default function Index() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Todos')

  const categories = ['Todos', 'Bebidas', 'Alimentos', 'Limpeza', 'Doces']

  const filteredProducts = mockProducts.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) || p.code.includes(search)
    const matchesCategory = category === 'Todos' || p.category === category
    return matchesSearch && matchesCategory
  })

  return (
    <div className="h-full flex flex-col animate-fade-in">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou código..."
            className="pl-10 h-12 text-base shadow-sm border-slate-200"
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
          <TabsList className="h-12 p-1 bg-slate-100/80 border">
            {categories.map((cat) => (
              <TabsTrigger key={cat} value={cat} className="px-6 py-2 rounded-md font-medium">
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 overflow-y-auto pb-4">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
        {filteredProducts.length === 0 && (
          <div className="col-span-full py-20 text-center text-muted-foreground">
            <p className="text-lg font-medium">Nenhum produto encontrado.</p>
          </div>
        )}
      </div>
    </div>
  )
}
