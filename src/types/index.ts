export interface Product {
  id: string
  codigo: string
  nome: string
  preco: number
  preco_custo?: number
  preco_venda?: number
  tamanho?: string
  categoria: string
  imagem_url: string
  estoque: number
  estoque_minimo: number
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

export interface MovimentacaoEstoque {
  id: string
  produto_id: string
  tipo: 'entrada' | 'saida'
  quantidade: number
  motivo: string
  data: string
  user_id: string
  produto?: { nome: string }
  user?: { nome: string }
}

export interface Cliente {
  id: string
  nome: string
  email: string | null
  telefone: string | null
  cpf: string | null
  endereco: string | null
  data_cadastro: string
}

export interface SaleRecord {
  id: string
  data: string
  total: number
  desconto?: number
  metodo_pagamento: string
  items: {
    nome: string
    quantidade: number
    preco_unitario: number
  }[]
}
