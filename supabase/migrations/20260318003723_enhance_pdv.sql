-- Add new columns to produtos table
ALTER TABLE public.produtos ADD COLUMN preco_custo NUMERIC DEFAULT 0;
ALTER TABLE public.produtos ADD COLUMN preco_venda NUMERIC DEFAULT 0;
ALTER TABLE public.produtos ADD COLUMN tamanho TEXT;

-- Migrate existing prices to preco_venda
UPDATE public.produtos SET preco_venda = preco;

-- Add discount to vendas table
ALTER TABLE public.vendas ADD COLUMN desconto NUMERIC DEFAULT 0;
