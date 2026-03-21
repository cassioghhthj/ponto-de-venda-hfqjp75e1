import React, { createContext, useContext, useState, ReactNode } from 'react'

interface SidebarContextType {
  collapsed: boolean
  toggle: () => void
  mobileOpen: boolean
  setMobileOpen: (open: boolean) => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const value = {
    collapsed,
    toggle: () => setCollapsed((prev) => !prev),
    mobileOpen,
    setMobileOpen,
  }

  return React.createElement(SidebarContext.Provider, { value }, children)
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (!context) throw new Error('useSidebar must be used within a SidebarProvider')
  return context
}
