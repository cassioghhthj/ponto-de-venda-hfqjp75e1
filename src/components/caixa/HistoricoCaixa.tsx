import { CaixaRecord } from '@/types/caixa'
import { formatCurrency } from '@/lib/format'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

export default function HistoricoCaixa({ history }: { history: CaixaRecord[] }) {
  return (
    <Card className="border-slate-200 overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead>Data Abertura</TableHead>
            <TableHead>Data Fechamento</TableHead>
            <TableHead>Saldo Inicial</TableHead>
            <TableHead>Saldo Final</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.map((h) => (
            <TableRow key={h.id}>
              <TableCell>{new Date(h.data_abertura).toLocaleString('pt-BR')}</TableCell>
              <TableCell>
                {h.data_fechamento ? new Date(h.data_fechamento).toLocaleString('pt-BR') : '-'}
              </TableCell>
              <TableCell>{formatCurrency(Number(h.saldo_inicial))}</TableCell>
              <TableCell className="font-semibold text-emerald-700">
                {h.saldo_final !== null ? formatCurrency(Number(h.saldo_final)) : '-'}
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-0">
                  Fechado
                </Badge>
              </TableCell>
            </TableRow>
          ))}
          {history.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                Nenhum histórico de caixa encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  )
}
