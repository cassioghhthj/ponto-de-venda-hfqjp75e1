-- Adiciona a coluna estoque_minimo na tabela produtos
ALTER TABLE public.produtos
ADD COLUMN estoque_minimo INTEGER NOT NULL DEFAULT 0;

-- Cria a tabela de movimentações de estoque
CREATE TABLE public.movimentacoes_estoque (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    produto_id UUID NOT NULL REFERENCES public.produtos(id) ON DELETE CASCADE,
    tipo TEXT NOT NULL CHECK (tipo IN ('entrada', 'saida')),
    quantidade INTEGER NOT NULL,
    motivo TEXT NOT NULL,
    data TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    user_id UUID NOT NULL REFERENCES public.users(id)
);

-- Habilita RLS
ALTER TABLE public.movimentacoes_estoque ENABLE ROW LEVEL SECURITY;

-- Cria política para permitir acesso total a usuários autenticados
CREATE POLICY "auth_all_movimentacoes_estoque" ON public.movimentacoes_estoque
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Atualiza a função decrement_stock para registrar a saída no histórico (venda automatizada)
CREATE OR REPLACE FUNCTION public.decrement_stock(p_id UUID, qty INTEGER)
RETURNS VOID AS $$
DECLARE
    v_user_id UUID;
BEGIN
    -- Decrementa o estoque
    UPDATE public.produtos
    SET estoque = estoque - qty
    WHERE id = p_id;

    -- Obtém o ID do usuário autenticado atual
    v_user_id := auth.uid();

    -- Se houver um usuário logado (o que é esperado via app), registra o histórico da venda
    IF v_user_id IS NOT NULL THEN
        INSERT INTO public.movimentacoes_estoque (produto_id, tipo, quantidade, motivo, user_id)
        VALUES (p_id, 'saida', qty, 'venda', v_user_id);
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
