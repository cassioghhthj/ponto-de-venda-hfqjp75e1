CREATE TABLE public.clientes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    email TEXT,
    telefone TEXT,
    cpf TEXT,
    endereco TEXT,
    data_cadastro TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.vendas ADD COLUMN cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL;

ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "auth_all_clientes" ON public.clientes
    FOR ALL TO authenticated USING (true) WITH CHECK (true);
