CREATE TABLE public.contas_receber (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    venda_id UUID NOT NULL REFERENCES public.vendas(id) ON DELETE CASCADE,
    cliente_id UUID,
    valor NUMERIC NOT NULL,
    data_vencimento TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'pendente',
    data_pagamento TIMESTAMPTZ
);

ALTER TABLE public.contas_receber ENABLE ROW LEVEL SECURITY;

CREATE POLICY "auth_all_contas_receber" ON public.contas_receber
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
