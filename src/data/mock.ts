import { Product, Transaction } from '../types'

export const mockProducts: Product[] = [
  {
    id: '1',
    code: '78910001',
    name: 'Coca-Cola 2L',
    price: 10.5,
    category: 'Bebidas',
    image: 'https://img.usecurling.com/p/200/200?q=coca-cola&color=red',
  },
  {
    id: '2',
    code: '78910002',
    name: 'Guaraná Antarctica 2L',
    price: 9.0,
    category: 'Bebidas',
    image: 'https://img.usecurling.com/p/200/200?q=guarana&color=green',
  },
  {
    id: '3',
    code: '78910003',
    name: 'Pão de Forma',
    price: 6.5,
    category: 'Alimentos',
    image: 'https://img.usecurling.com/p/200/200?q=sliced-bread&color=orange',
  },
  {
    id: '4',
    code: '78910004',
    name: 'Manteiga Qualy',
    price: 12.9,
    category: 'Alimentos',
    image: 'https://img.usecurling.com/p/200/200?q=butter&color=yellow',
  },
  {
    id: '5',
    code: '78910005',
    name: 'Detergente Omo',
    price: 2.8,
    category: 'Limpeza',
    image: 'https://img.usecurling.com/p/200/200?q=detergent&color=blue',
  },
  {
    id: '6',
    code: '78910006',
    name: 'Esponja Assolan',
    price: 1.5,
    category: 'Limpeza',
    image: 'https://img.usecurling.com/p/200/200?q=sponge&color=yellow',
  },
  {
    id: '7',
    code: '78910007',
    name: 'Chocolate Laka',
    price: 5.5,
    category: 'Doces',
    image: 'https://img.usecurling.com/p/200/200?q=chocolate-bar&color=white',
  },
  {
    id: '8',
    code: '78910008',
    name: 'Biscoito Oreo',
    price: 3.9,
    category: 'Doces',
    image: 'https://img.usecurling.com/p/200/200?q=oreo-cookie&color=blue',
  },
]

export const mockTransactions: Transaction[] = [
  { id: 'TRX-1001', date: '2023-10-24 14:30', total: 45.9, method: 'PIX', status: 'Concluído' },
  {
    id: 'TRX-1002',
    date: '2023-10-24 14:15',
    total: 12.5,
    method: 'Dinheiro',
    status: 'Concluído',
  },
  {
    id: 'TRX-1003',
    date: '2023-10-24 13:50',
    total: 110.0,
    method: 'Cartão de Crédito',
    status: 'Concluído',
  },
  { id: 'TRX-1004', date: '2023-10-24 13:10', total: 8.9, method: 'Débito', status: 'Cancelado' },
  { id: 'TRX-1005', date: '2023-10-24 12:45', total: 55.4, method: 'PIX', status: 'Concluído' },
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
