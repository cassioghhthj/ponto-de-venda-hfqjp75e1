import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { LockKeyhole, Loader2 } from 'lucide-react'

export default function CaixaFechado({ onAbrir }: { onAbrir: (saldo: number) => Promise<void> }) {
  const [open, setOpen] = useState(false)
  const [saldo, setSaldo] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleConfirm = async () => {
    setSubmitting(true)
    await onAbrir(Number(saldo) || 0)
    setSubmitting(false)
    setOpen(false)
  }

  return (
    <div className="flex items-center justify-center h-full p-6">
      <Card className="max-w-md w-full text-center shadow-md bg-card">
        <CardHeader>
          <div className="mx-auto bg-muted w-16 h-16 flex items-center justify-center rounded-full mb-4">
            <LockKeyhole className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl">Caixa Fechado</CardTitle>
          <CardDescription>Não há nenhuma sessão de caixa aberta no momento.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full" size="lg" onClick={() => setOpen(true)}>
            Abrir Caixa Agora
          </Button>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Abrir Caixa</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2 text-left">
              <Label>Saldo Inicial (Troco em Gaveta)</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={saldo}
                onChange={(e) => setSaldo(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={submitting}>
              Cancelar
            </Button>
            <Button onClick={handleConfirm} disabled={submitting}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
