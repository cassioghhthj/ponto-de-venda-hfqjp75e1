import { formatCurrency } from '@/lib/format'

export function PrintableReport({ contas, clientName, startDate, endDate }: any) {
  const total = contas.reduce((acc: number, c: any) => acc + Number(c.valor), 0)

  return (
    <div className="hidden print:block bg-white text-black w-full print:overflow-visible mx-auto max-w-[210mm]">
      <div className="mb-6 border-b-2 border-black pb-4">
        <h1 className="text-2xl font-bold uppercase tracking-tight">
          CHARME PDV - Relatório de Contas a Receber
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Gerado em: {new Date().toLocaleString('pt-BR')}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-4 text-sm bg-gray-50 p-3 rounded border border-gray-200">
          <div>
            <span className="font-semibold">Filtro de Cliente:</span>{' '}
            {clientName || 'Todos os clientes'}
          </div>
          <div>
            <span className="font-semibold">Período de Vencimento:</span>{' '}
            {startDate ? new Date(startDate).toLocaleDateString('pt-BR') : 'Início'} até{' '}
            {endDate ? new Date(endDate).toLocaleDateString('pt-BR') : 'Fim'}
          </div>
        </div>
      </div>

      <table className="w-full text-left border-collapse mb-8 text-sm">
        <thead>
          <tr className="bg-gray-100 border-b-2 border-black">
            <th className="py-2 px-3 font-semibold border-b border-gray-300">Cliente</th>
            <th className="py-2 px-3 font-semibold border-b border-gray-300">Data Venda</th>
            <th className="py-2 px-3 font-semibold border-b border-gray-300">Vencimento</th>
            <th className="py-2 px-3 font-semibold border-b border-gray-300">Status</th>
            <th className="py-2 px-3 font-semibold border-b border-gray-300 text-right">Valor</th>
          </tr>
        </thead>
        <tbody>
          {contas.length > 0 ? (
            contas.map((c: any) => (
              <tr key={c.id} className="border-b border-gray-200 print:break-inside-avoid">
                <td className="py-2 px-3">{c.cliente?.nome || 'Sem Cliente'}</td>
                <td className="py-2 px-3">
                  {c.venda?.data
                    ? new Date(c.venda.data).toLocaleDateString('pt-BR')
                    : new Date(c.data_vencimento).toLocaleDateString('pt-BR')}
                </td>
                <td className="py-2 px-3 font-medium">
                  {new Date(c.data_vencimento).toLocaleDateString('pt-BR')}
                </td>
                <td className="py-2 px-3 capitalize">{c.status}</td>
                <td className="py-2 px-3 text-right font-medium">{formatCurrency(c.valor)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="py-6 text-center text-gray-500 italic">
                Nenhum registro encontrado para os filtros atuais.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex justify-end border-t-2 border-black pt-4 print:break-inside-avoid">
        <div className="text-right bg-gray-50 p-4 rounded border border-gray-200 w-64">
          <div className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-1">
            Total do Relatório
          </div>
          <div className="text-2xl font-bold text-black">{formatCurrency(total)}</div>
        </div>
      </div>
    </div>
  )
}
