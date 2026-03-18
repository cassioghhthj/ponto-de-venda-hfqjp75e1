import { formatCurrency } from '@/lib/format'
import { Button } from '@/components/ui/button'
import { DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { CheckCircle2, Printer } from 'lucide-react'
import { SaleRecord } from '@/types'

interface Props {
  receipt: SaleRecord
  change: number
  onNewSale: () => void
}

export function ReceiptView({ receipt, change, onNewSale }: Props) {
  return (
    <>
      <DialogHeader className="text-center sm:text-center no-print">
        <div className="mx-auto w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <DialogTitle className="text-2xl font-bold text-center">Venda Concluída!</DialogTitle>
      </DialogHeader>

      <div className="thermal-receipt bg-white dark:bg-muted/30 p-6 rounded-lg border border-border text-sm space-y-4 font-mono mt-2 shadow-inner print:shadow-none print:border-none print:p-0">
        <div className="text-center border-b border-dashed border-border pb-4 mb-4">
          <h3 className="font-bold text-lg mb-1 text-foreground">NEXUS PDV</h3>
          <p className="font-bold text-md mb-1 text-foreground">RECIBO DE VENDA</p>
          <p className="text-muted-foreground text-xs truncate">ID: {receipt.id}</p>
          <p className="text-muted-foreground text-xs">
            {new Date(receipt.data).toLocaleString('pt-BR')}
          </p>
        </div>

        <div className="space-y-3 mb-4 max-h-[40vh] overflow-y-auto pr-2 print:max-h-none print:overflow-visible">
          {receipt.items.map((item, idx) => (
            <div key={idx} className="flex justify-between text-foreground">
              <div className="flex-1 pr-4">
                <span className="block font-semibold line-clamp-1 print:line-clamp-none">
                  {item.nome}
                </span>
                <span className="text-xs text-muted-foreground">
                  {item.quantidade}x {formatCurrency(item.preco_unitario)}
                </span>
              </div>
              <span className="font-medium">
                {formatCurrency(item.quantidade * item.preco_unitario)}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t border-dashed border-border pt-4 mb-2">
          {receipt.desconto > 0 && (
            <div className="flex justify-between text-muted-foreground text-sm mb-1">
              <span>Desconto</span>
              <span>-{formatCurrency(receipt.desconto)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-xl mb-2 text-foreground">
            <span>TOTAL</span>
            <span>{formatCurrency(receipt.total)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground text-base">
            <span>Pagamento</span>
            <span className="font-semibold text-foreground">{receipt.metodo_pagamento}</span>
          </div>
          {receipt.metodo_pagamento === 'Dinheiro' && change > 0 && (
            <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium mt-1">
              <span>Troco</span>
              <span>{formatCurrency(change)}</span>
            </div>
          )}
        </div>

        <div className="text-center mt-6 text-xs text-muted-foreground pt-4 border-t border-dashed border-border hidden print:block">
          <p>Obrigado pela preferência!</p>
          <p>Volte sempre.</p>
        </div>
      </div>

      <DialogFooter className="mt-4 flex-col sm:flex-row gap-2 sm:justify-center no-print">
        <Button className="w-full sm:w-auto h-12" variant="outline" onClick={() => window.print()}>
          <Printer className="w-4 h-4 mr-2" /> Imprimir Recibo
        </Button>
        <Button className="w-full sm:w-auto h-12 text-lg font-bold" onClick={onNewSale}>
          Nova Venda
        </Button>
      </DialogFooter>
    </>
  )
}
