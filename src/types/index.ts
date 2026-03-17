export interface Product {
  id: string
  code: string
  name: string
  price: number
  category: string
  image: string
}

export interface CartItem extends Product {
  quantity: number
}

export interface Transaction {
  id: string
  date: string
  total: number
  method: string
  status: 'Concluído' | 'Cancelado'
}
