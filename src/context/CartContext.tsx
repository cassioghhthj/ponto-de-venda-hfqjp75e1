import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react'
import { CartItem, Product } from '@/types'
import { toast } from '@/hooks/use-toast'

interface CartContextData {
  items: CartItem[]
  discount: number
  subtotal: number
  total: number
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, delta: number) => void
  clearCart: () => void
  setDiscount: (value: number) => void
}

const CartContext = createContext<CartContextData | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [discount, setDiscount] = useState<number>(0)

  const addItem = (product: Product) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
    toast({ title: 'Item adicionado', description: `${product.nome} foi adicionado ao carrinho.` })
  }

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== productId))
  }

  const updateQuantity = (productId: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === productId) {
          const newQuantity = Math.max(1, item.quantity + delta)
          return { ...item, quantity: newQuantity }
        }
        return item
      }),
    )
  }

  const clearCart = () => {
    setItems([])
    setDiscount(0)
  }

  const subtotal = useMemo(
    () => items.reduce((acc, item) => acc + item.preco * item.quantity, 0),
    [items],
  )

  const total = useMemo(() => Math.max(0, subtotal - discount), [subtotal, discount])

  const value = useMemo(
    () => ({
      items,
      discount,
      subtotal,
      total,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      setDiscount,
    }),
    [items, discount, subtotal, total],
  )

  return React.createElement(CartContext.Provider, { value }, children)
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}
