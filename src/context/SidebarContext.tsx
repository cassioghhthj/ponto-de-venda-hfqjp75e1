import React, { createContext, useContext, useState, ReactNode } from 'react'

interface SidebarContextType {
  collapsed: boolean
  toggle: () => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)

  const value = {
    collapsed,
    toggle: () => setCollapsed((prev) => !prev),
  }

  return React.createElement(SidebarContext.Provider, { value }, children)
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (!context) throw new Error('useSidebar must be used within a SidebarProvider')
  return context
}
