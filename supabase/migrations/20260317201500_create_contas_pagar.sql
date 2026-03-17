CREATE TABLE public.contas_pagar (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    descricao TEXT NOT NULL,
    valor NUMERIC NOT NULL,
    data_vencimento TIMESTAMPTZ NOT NULL,
    categoria TEXT,
    status TEXT NOT NULL DEFAULT 'pendente',
    data_pagamento TIMESTAMPTZ,
    fornecedor TEXT
);

ALTER TABLE public.contas_pagar ENABLE ROW LEVEL SECURITY;

CREATE POLICY "auth_all_contas_pagar" ON public.contas_pagar
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
