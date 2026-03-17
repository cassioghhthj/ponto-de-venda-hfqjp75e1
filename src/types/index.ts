export interface Product {
  id: string
  codigo: string
  nome: string
  preco: number
  categoria: string
  imagem_url: string
  estoque: number
}

export interface CartItem extends Product {
  quantity: number
}

export interface Transaction {
  id: string
  data: string
  total: number
  metodo_pagamento: string
  status: 'Concluído' | 'Cancelado' | string
}
