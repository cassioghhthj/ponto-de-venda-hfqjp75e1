import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle } from 'lucide-react'

interface Props {
  data: any[]
}

export function TableCriticalStock({ data }: Props) {
  return (
    <Card className="shadow-sm border-red-200">
      <CardHeader className="bg-red-50/50 border-b border-red-100 pb-4">
        <CardTitle className="text-lg flex items-center text-red-900">
          <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
          Alerta de Estoque Crítico (Em Tempo Real)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50">
              <TableHead>Produto</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead className="text-right">Estoque Mínimo</TableHead>
              <TableHead className="text-right">Estoque Atual</TableHead>
              <TableHead className="text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.nome}</TableCell>
                <TableCell>{item.categoria || '-'}</TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {item.estoque_minimo}
                </TableCell>
                <TableCell className="text-right font-bold text-red-600">{item.estoque}</TableCell>
                <TableCell className="text-center">
                  <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-200">
                    Crítico
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Nenhum produto com estoque abaixo do mínimo.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
