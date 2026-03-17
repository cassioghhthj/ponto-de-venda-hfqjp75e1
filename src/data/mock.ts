import { Product, Transaction } from '../types'

export const mockProducts: Product[] = [
  {
    id: '1',
    codigo: '78910001',
    nome: 'Coca-Cola 2L',
    preco: 10.5,
    categoria: 'Bebidas',
    imagem_url: 'https://img.usecurling.com/p/200/200?q=coca-cola&color=red',
    estoque: 100,
  },
  {
    id: '2',
    codigo: '78910002',
    nome: 'Guaraná Antarctica 2L',
    preco: 9.0,
    categoria: 'Bebidas',
    imagem_url: 'https://img.usecurling.com/p/200/200?q=guarana&color=green',
    estoque: 80,
  },
]

export const mockTransactions: Transaction[] = [
  {
    id: 'TRX-1001',
    data: '2023-10-24 14:30',
    total: 45.9,
    metodo_pagamento: 'PIX',
    status: 'Concluído',
  },
  {
    id: 'TRX-1002',
    data: '2023-10-24 14:15',
    total: 12.5,
    metodo_pagamento: 'Dinheiro',
    status: 'Concluído',
  },
]

export const mockChartDataLine = [
  { time: '08:00', sales: 120 },
  { time: '10:00', sales: 300 },
  { time: '12:00', sales: 450 },
  { time: '14:00', sales: 380 },
  { time: '16:00', sales: 520 },
  { time: '18:00', sales: 600 },
]

export const mockChartDataBar = [
  { category: 'Bebidas', value: 850 },
  { category: 'Alimentos', value: 620 },
  { category: 'Limpeza', value: 340 },
  { category: 'Doces', value: 210 },
]
