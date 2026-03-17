import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { MovimentacaoEstoque } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Loader2 } from 'lucide-react'

export default function HistoricoEstoque() {
  const [history, setHistory] = useState<MovimentacaoEstoque[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true)
      const { data } = await supabase
        .from('movimentacoes_estoque')
        .select('*, produto:produtos(nome), user:users(nome)')
        .order('data', { ascending: false })

      if (data) setHistory(data as any[])
      setLoading(false)
    }

    fetchHistory()
  }, [])

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <Card className="shadow-sm border-slate-200">
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Data / Hora</TableHead>
              <TableHead>Produto</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-center">Quantidade</TableHead>
              <TableHead>Motivo</TableHead>
              <TableHead>Usuário</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.map((mov) => (
              <TableRow key={mov.id}>
                <TableCell className="text-muted-foreground whitespace-nowrap">
                  {new Date(mov.data).toLocaleString('pt-BR')}
                </TableCell>
                <TableCell className="font-medium">{mov.produto?.nome || '-'}</TableCell>
                <TableCell>
                  <Badge
                    variant={mov.tipo === 'entrada' ? 'default' : 'secondary'}
                    className={
                      mov.tipo === 'entrada'
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-0'
                        : 'bg-orange-100 text-orange-800 hover:bg-orange-200 border-0'
                    }
                  >
                    {mov.tipo.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell className="text-center font-semibold">
                  {mov.tipo === 'entrada' ? '+' : '-'}
                  {mov.quantidade}
                </TableCell>
                <TableCell className="capitalize">{mov.motivo}</TableCell>
                <TableCell className="text-sm text-slate-600">{mov.user?.nome || '-'}</TableCell>
              </TableRow>
            ))}
            {history.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Nenhuma movimentação registrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
