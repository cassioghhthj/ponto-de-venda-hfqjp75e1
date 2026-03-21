import { useEffect, useRef, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Loader2 } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface Props {
  open: boolean
  onClose: () => void
  onScan: (code: string) => void
}

declare global {
  interface Window {
    Html5Qrcode: any
  }
}

export function BarcodeScannerModal({ open, onClose, onScan }: Props) {
  const [loading, setLoading] = useState(true)
  const scannerRef = useRef<any>(null)

  useEffect(() => {
    if (!open) {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(console.error)
        scannerRef.current = null
      }
      return
    }

    let isMounted = true

    const startScanner = async () => {
      try {
        if (!window.Html5Qrcode) {
          await new Promise((resolve, reject) => {
            const script = document.createElement('script')
            script.src = 'https://unpkg.com/html5-qrcode'
            script.async = true
            script.onload = resolve
            script.onerror = reject
            document.body.appendChild(script)
          })
        }

        if (!isMounted) return
        setLoading(false)

        const html5QrCode = new window.Html5Qrcode('reader')
        scannerRef.current = html5QrCode

        await html5QrCode.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 250, height: 150 } },
          (decodedText: string) => {
            if (isMounted) {
              html5QrCode
                .stop()
                .then(() => {
                  scannerRef.current = null
                  onScan(decodedText)
                  onClose()
                })
                .catch(console.error)
            }
          },
          () => {
            // Ignore continuous errors
          },
        )
      } catch (err) {
        console.error(err)
        if (isMounted) {
          toast({
            title: 'Erro na câmera',
            description:
              'Não foi possível acessar a câmera do dispositivo. Verifique as permissões.',
            variant: 'destructive',
          })
          onClose()
        }
      }
    }

    setTimeout(() => {
      if (isMounted) startScanner()
    }, 100)

    return () => {
      isMounted = false
      if (scannerRef.current) {
        try {
          scannerRef.current.stop().catch(() => {
            /* ignore */
          })
          scannerRef.current = null
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    }
  }, [open, onClose, onScan])

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Escanear Código</DialogTitle>
          <DialogDescription>Aponte a câmera para o código de barras do produto.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center min-h-[300px] bg-black/5 rounded-md overflow-hidden relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-background/80 backdrop-blur-sm">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          <div id="reader" className="w-full h-full min-h-[300px]"></div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
