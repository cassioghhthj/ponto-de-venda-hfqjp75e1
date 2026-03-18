import { formatCurrency } from '@/lib/format'

export function PrintableReport({ contas, clientName, startDate, endDate }: any) {
  const total = contas.reduce((acc: number, c: any) => acc + Number(c.valor), 0)

  return (
    <div className="hidden print:block fixed inset-0 bg-white z-[9999] p-8 text-black print:overflow-visible">
      <div className="mb-8 border-b-2 border-black pb-4">
        <h1 className="text-3xl font-bold mb-2">Relatório de Carteira - Contas a Receber</h1>
        <p className="text-gray-600">Gerado em: {new Date().toLocaleString('pt-BR')}</p>

        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Cliente:</strong> {clientName || 'Todos'}
          </div>
          <div>
            <strong>Período:</strong>{' '}
            {startDate ? new Date(startDate).toLocaleDateString('pt-BR') : 'Início'} até{' '}
            {endDate ? new Date(endDate).toLocaleDateString('pt-BR') : 'Fim'}
          </div>
        </div>
      </div>

      <table className="w-full text-left border-collapse mb-8 text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-2 border-b border-gray-300">Cliente</th>
            <th className="py-2 px-2 border-b border-gray-300">Venda</th>
            <th className="py-2 px-2 border-b border-gray-300">Vencimento</th>
            <th className="py-2 px-2 border-b border-gray-300">Status</th>
            <th className="py-2 px-2 border-b border-gray-300 text-right">Valor</th>
          </tr>
        </thead>
        <tbody>
          {contas.length > 0 ? (
            contas.map((c: any) => (
              <tr key={c.id} className="border-b border-gray-200">
                <td className="py-2 px-2">{c.cliente?.nome || 'Sem Cliente'}</td>
                <td className="py-2 px-2">
                  {new Date(c.venda?.data || c.data_vencimento).toLocaleDateString('pt-BR')}
                </td>
                <td className="py-2 px-2 font-medium">
                  {new Date(c.data_vencimento).toLocaleDateString('pt-BR')}
                </td>
                <td className="py-2 px-2 capitalize">{c.status}</td>
                <td className="py-2 px-2 text-right">{formatCurrency(c.valor)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="py-4 text-center">
                Nenhum registro encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex justify-end border-t-2 border-black pt-4">
        <div className="text-right">
          <span className="text-lg text-gray-600 mr-4">Total do Relatório:</span>
          <span className="text-2xl font-bold">{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  )
}
