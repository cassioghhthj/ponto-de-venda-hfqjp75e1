import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import EstoqueAtual from '@/components/estoque/EstoqueAtual'
import HistoricoEstoque from '@/components/estoque/HistoricoEstoque'

export default function Estoque() {
  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto h-full flex flex-col">
      <div className="flex justify-between items-center shrink-0">
        <h2 className="text-2xl font-bold tracking-tight">Controle de Estoque</h2>
      </div>

      <Tabs defaultValue="atual" className="flex-1 flex flex-col min-h-0">
        <TabsList className="shrink-0 w-fit">
          <TabsTrigger value="atual">Estoque Atual</TabsTrigger>
          <TabsTrigger value="historico">Histórico de Movimentações</TabsTrigger>
        </TabsList>

        <TabsContent value="atual" className="flex-1 overflow-auto mt-4 focus-visible:outline-none">
          <EstoqueAtual />
        </TabsContent>

        <TabsContent
          value="historico"
          className="flex-1 overflow-auto mt-4 focus-visible:outline-none"
        >
          <HistoricoEstoque />
        </TabsContent>
      </Tabs>
    </div>
  )
}
