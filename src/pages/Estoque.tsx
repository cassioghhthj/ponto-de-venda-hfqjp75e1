import { useState, useEffect, useCallback } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import EstoqueAtual from '@/components/estoque/EstoqueAtual'
import HistoricoEstoque from '@/components/estoque/HistoricoEstoque'
import EstoqueEtiquetas from '@/components/estoque/EstoqueEtiquetas'
import { Tags } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { Product } from '@/types'

export default function Estoque() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    setLoading(true)
    const [prodRes, catRes] = await Promise.all([
      supabase
        .from('produtos')
        .select('*')
        .order('created_at' as any, { ascending: false }),
      supabase.from('categorias').select('nome').order('nome'),
    ])

    if (prodRes.data) {
      setProducts(prodRes.data as Product[])
    }

    if (catRes.data) {
      setCategories(['Todas', ...catRes.data.map((c) => c.nome)])
    } else if (prodRes.data) {
      setCategories([
        'Todas',
        ...(Array.from(new Set(prodRes.data.map((p) => p.categoria).filter(Boolean))) as string[]),
      ])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto h-full flex flex-col">
      <div className="flex justify-between items-center shrink-0">
        <h2 className="text-2xl font-bold tracking-tight">Controle de Estoque</h2>
      </div>

      <Tabs defaultValue="atual" className="flex-1 flex flex-col min-h-0">
        <TabsList className="shrink-0 w-fit">
          <TabsTrigger value="atual">Estoque Atual</TabsTrigger>
          <TabsTrigger value="historico">Histórico de Movimentações</TabsTrigger>
          <TabsTrigger value="etiquetas" className="gap-2">
            <Tags className="h-4 w-4" /> Etiquetas (A4251)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="atual" className="flex-1 overflow-auto mt-4 focus-visible:outline-none">
          <EstoqueAtual
            products={products}
            categories={categories}
            loading={loading}
            fetchData={fetchData}
          />
        </TabsContent>

        <TabsContent
          value="historico"
          className="flex-1 overflow-auto mt-4 focus-visible:outline-none"
        >
          <HistoricoEstoque />
        </TabsContent>

        <TabsContent
          value="etiquetas"
          className="flex-1 overflow-hidden mt-4 focus-visible:outline-none flex flex-col"
        >
          <EstoqueEtiquetas products={products} categories={categories} loading={loading} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
