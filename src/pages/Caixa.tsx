import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { CaixaRecord, MovimentacaoCaixa } from '@/types/caixa'
import CaixaAberto from '@/components/caixa/CaixaAberto'
import CaixaFechado from '@/components/caixa/CaixaFechado'
import HistoricoCaixa from '@/components/caixa/HistoricoCaixa'
import { toast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'

export default function CaixaPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [activeCaixa, setActiveCaixa] = useState<CaixaRecord | null>(null)
  const [history, setHistory] = useState<CaixaRecord[]>([])
  const [movements, setMovements] = useState<MovimentacaoCaixa[]>([])
  const [sales, setSales] = useState<any[]>([])

  const fetchData = useCallback(async () => {
    if (!user) return
    setLoading(true)

    // Fetch active session
    const { data: active } = await supabase
      .from('caixa')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'aberto')
      .maybeSingle()
    setActiveCaixa(active)

    if (active) {
      const { data: movs } = await supabase
        .from('movimentacoes_caixa')
        .select('*')
        .eq('caixa_id', active.id)
        .order('data', { ascending: false })
      setMovements(movs || [])

      const { data: vends } = await supabase
        .from('vendas')
        .select('*')
        .eq('user_id', user.id)
        .gte('data', active.data_abertura)
        .order('data', { ascending: false })
      setSales(vends || [])
    }

    // Fetch history
    const { data: hist } = await supabase
      .from('caixa')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'fechado')
      .order('data_fechamento', { ascending: false })
    setHistory(hist || [])

    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleAbrir = async (saldo: number) => {
    const { error } = await supabase
      .from('caixa')
      .insert({ user_id: user!.id, saldo_inicial: saldo })
    if (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível abrir o caixa.',
        variant: 'destructive',
      })
    } else {
      toast({ title: 'Sucesso', description: 'Caixa aberto com sucesso!' })
      fetchData()
    }
  }

  const handleFechar = async (saldoFinal: number) => {
    if (!activeCaixa) return
    const { error } = await supabase
      .from('caixa')
      .update({
        status: 'fechado',
        data_fechamento: new Date().toISOString(),
        saldo_final: saldoFinal,
      })
      .eq('id', activeCaixa.id)

    if (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível fechar o caixa.',
        variant: 'destructive',
      })
    } else {
      toast({ title: 'Sucesso', description: 'Caixa fechado com sucesso!' })
      fetchData()
    }
  }

  const handleNovaMov = async (tipo: string, valor: number, descricao: string) => {
    if (!activeCaixa) return
    const { error } = await supabase
      .from('movimentacoes_caixa')
      .insert({ caixa_id: activeCaixa.id, tipo, valor, descricao })

    if (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao registrar movimentação.',
        variant: 'destructive',
      })
    } else {
      toast({ title: 'Sucesso', description: 'Movimentação registrada!' })
      fetchData()
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto h-full flex flex-col">
      <div className="flex justify-between items-center shrink-0">
        <h2 className="text-2xl font-bold tracking-tight">Fluxo de Caixa</h2>
      </div>

      <Tabs defaultValue="atual" className="flex-1 flex flex-col min-h-0">
        <TabsList className="shrink-0 w-fit">
          <TabsTrigger value="atual">Caixa Atual</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="atual" className="flex-1 overflow-auto mt-4 focus-visible:outline-none">
          {activeCaixa ? (
            <CaixaAberto
              caixa={activeCaixa}
              movements={movements}
              sales={sales}
              onFechar={handleFechar}
              onNovaMov={handleNovaMov}
            />
          ) : (
            <CaixaFechado onAbrir={handleAbrir} />
          )}
        </TabsContent>

        <TabsContent
          value="historico"
          className="flex-1 overflow-auto mt-4 focus-visible:outline-none"
        >
          <HistoricoCaixa history={history} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
