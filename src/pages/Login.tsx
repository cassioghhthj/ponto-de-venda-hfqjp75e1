import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Store, Loader2, LockKeyhole, Mail } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await signIn(email, password)

    if (error) {
      toast({
        title: 'Acesso Negado',
        description: 'Credenciais inválidas. Verifique seu e-mail e senha.',
        variant: 'destructive',
      })
    } else {
      navigate('/')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900 p-4 font-sans">
      <Card className="w-full max-w-md shadow-2xl border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        <div className="bg-primary h-2 w-full"></div>
        <CardHeader className="text-center space-y-3 pb-6 pt-8">
          <div className="mx-auto bg-primary/10 dark:bg-primary/20 w-20 h-20 flex items-center justify-center rounded-full mb-2 ring-8 ring-primary/5">
            <Store className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            CHARME PDV
          </CardTitle>
          <CardDescription className="text-base">Acesse o seu painel de controle</CardDescription>
        </CardHeader>
        <CardContent className="pb-8 px-6 sm:px-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 dark:text-slate-300 font-semibold">
                E-mail de Acesso
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="contato.lojacharmeluiziana@gmail.com"
                  className="pl-10 h-12 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus-visible:ring-primary"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Senha
                </Label>
              </div>
              <div className="relative">
                <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="pl-10 h-12 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus-visible:ring-primary"
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full h-12 text-base font-bold mt-4 shadow-md hover:shadow-lg transition-all"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Entrando...
                </>
              ) : (
                'Entrar no Sistema'
              )}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-6">
            <p>
              Acesso exclusivo para administradores e operadores da <strong>Loja Charme</strong>.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
