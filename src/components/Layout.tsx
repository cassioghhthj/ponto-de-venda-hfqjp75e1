import { Outlet, useLocation } from 'react-router-dom'
import { AppSidebar } from './Sidebar'
import { Header } from './Header'
import { CartSidebar } from './pdv/CartSidebar'

export default function Layout() {
  const location = useLocation()
  const isPdv = location.pathname === '/'

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden font-sans text-slate-900">
      <AppSidebar />

      <div className="flex flex-col flex-1 min-w-0 transition-all duration-300">
        <Header />
        <main className="flex-1 overflow-auto p-4 sm:p-6 pb-24 sm:pb-6 relative">
          <Outlet />
        </main>
      </div>

      {isPdv && <CartSidebar />}
    </div>
  )
}
