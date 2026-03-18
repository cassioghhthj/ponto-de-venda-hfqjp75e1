import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ThemeProvider } from '@/components/ThemeProvider'
import Index from './pages/Index'
import Dashboard from './pages/Dashboard'
import ContasReceber from './pages/ContasReceber'
import ContasPagar from './pages/ContasPagar'
import CaixaPage from './pages/Caixa'
import Estoque from './pages/Estoque'
import Clientes from './pages/Clientes'
import Relatorios from './pages/Relatorios'
import NotFound from './pages/NotFound'
import Layout from './components/Layout'
import Login from './pages/Login'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './hooks/use-auth'
import { ProtectedRoute } from './components/ProtectedRoute'
import { SidebarProvider } from './context/SidebarContext'

const App = () => (
  <ThemeProvider defaultTheme="system" storageKey="nexus-theme">
    <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
      <AuthProvider>
        <SidebarProvider>
          <CartProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <Routes>
                <Route path="/login" element={<Login />} />

                <Route element={<ProtectedRoute />}>
                  <Route element={<Layout />}>
                    <Route path="/" element={<Index />} />
                    <Route path="/caixa" element={<CaixaPage />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/clientes" element={<Clientes />} />
                    <Route path="/contas-receber" element={<ContasReceber />} />
                    <Route path="/contas-pagar" element={<ContasPagar />} />
                    <Route path="/estoque" element={<Estoque />} />
                    <Route path="/relatorios" element={<Relatorios />} />
                  </Route>
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </TooltipProvider>
          </CartProvider>
        </SidebarProvider>
      </AuthProvider>
    </BrowserRouter>
  </ThemeProvider>
)

export default App
