export interface CaixaRecord {
  id: string
  user_id: string
  data_abertura: string
  data_fechamento: string | null
  saldo_inicial: number
  saldo_final: number | null
  status: 'aberto' | 'fechado'
}

export interface MovimentacaoCaixa {
  id: string
  caixa_id: string
  tipo: 'entrada' | 'saida'
  valor: number
  descricao: string
  data: string
}
