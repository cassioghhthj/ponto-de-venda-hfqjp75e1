import { useState, useEffect } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase/client'
import { formatCurrency } from '@/lib/format'
import { Loader2, ShoppingBag } from 'lucide-react'
import { Cliente } from '@/types'

interface Props {
  cliente: Cliente | null
  open: boolean
  onClose: () => void
}

export function ClienteHistorySheet({ cliente, open, onClose }: Props) {
  const [vendas, setVendas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!cliente || !open) return
    setLoading(true)
    const fetchVendas = async () => {
      const { data } = await supabase
        .from('vendas')
        .select('*, itens_venda(quantidade, preco_unitario, produto:produtos(nome))')
        .eq('cliente_id', cliente.id)
        .order('data', { ascending: false })
      setVendas(data || [])
      setLoading(false)
    }
    fetchVendas()
  }, [cliente, open])

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto bg-slate-50/50">
        <SheetHeader className="mb-6">
          <SheetTitle className="flex items-center gap-2 text-2xl">
            <ShoppingBag className="h-6 w-6 text-primary" />
            Histórico de Compras
          </SheetTitle>
          <SheetDescription>
            Exibindo transações do cliente{' '}
            <strong className="text-slate-800">{cliente?.nome}</strong>.
          </SheetDescription>
        </SheetHeader>

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : vendas.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground bg-white rounded-lg border border-dashed border-slate-300 shadow-sm">
            Nenhuma compra registrada para este cliente.
          </div>
        ) : (
          <div className="space-y-4">
            {vendas.map((venda) => (
              <div key={venda.id} className="border rounded-xl p-5 shadow-sm space-y-4 bg-white">
                <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                  <div>
                    <p className="font-mono text-xs text-muted-foreground mb-1">
                      ID: {venda.id.split('-')[0]}
                    </p>
                    <p className="font-semibold text-sm">
                      {new Date(venda.data).toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-primary">{formatCurrency(venda.total)}</p>
                    <Badge variant="secondary" className="mt-1 font-medium bg-slate-100">
                      {venda.metodo_pagamento}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                    Itens Comprados
                  </p>
                  <ul className="text-sm space-y-1.5">
                    {venda.itens_venda.map((item: any, idx: number) => (
                      <li key={idx} className="flex justify-between items-center text-slate-700">
                        <span className="truncate pr-2">
                          <span className="text-muted-foreground mr-1">-</span>
                          {item.produto?.nome || 'Produto Indisponível'}
                        </span>
                        <span className="shrink-0 font-medium">
                          {item.quantidade}x {formatCurrency(item.preco_unitario)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
