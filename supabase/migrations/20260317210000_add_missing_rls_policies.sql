-- Habilitar RLS nas tabelas restantes
ALTER TABLE public.caixa ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contas_pagar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contas_receber ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movimentacoes_caixa ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movimentacoes_estoque ENABLE ROW LEVEL SECURITY;

-- Remover políticas antigas caso existam para evitar duplicidade
DROP POLICY IF EXISTS "auth_all_caixa" ON public.caixa;
DROP POLICY IF EXISTS "auth_all_clientes" ON public.clientes;
DROP POLICY IF EXISTS "auth_all_contas_pagar" ON public.contas_pagar;
DROP POLICY IF EXISTS "auth_all_contas_receber" ON public.contas_receber;
DROP POLICY IF EXISTS "auth_all_movimentacoes_caixa" ON public.movimentacoes_caixa;
DROP POLICY IF EXISTS "auth_all_movimentacoes_estoque" ON public.movimentacoes_estoque;

-- Criar políticas permitindo todas as operações (CRUD) para usuários autenticados
CREATE POLICY "auth_all_caixa" ON public.caixa FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all_clientes" ON public.clientes FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all_contas_pagar" ON public.contas_pagar FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all_contas_receber" ON public.contas_receber FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all_movimentacoes_caixa" ON public.movimentacoes_caixa FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all_movimentacoes_estoque" ON public.movimentacoes_estoque FOR ALL TO authenticated USING (true) WITH CHECK (true);

