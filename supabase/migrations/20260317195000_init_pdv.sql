CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    nome TEXT,
    role TEXT DEFAULT 'operador'
);

CREATE TABLE public.produtos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo TEXT,
    nome TEXT NOT NULL,
    descricao TEXT,
    preco NUMERIC NOT NULL,
    estoque INTEGER DEFAULT 0,
    imagem_url TEXT,
    categoria TEXT
);

CREATE TABLE public.vendas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id),
    data TIMESTAMPTZ DEFAULT NOW(),
    total NUMERIC NOT NULL,
    metodo_pagamento TEXT,
    status TEXT DEFAULT 'Concluído'
);

CREATE TABLE public.itens_venda (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    venda_id UUID REFERENCES public.vendas(id) ON DELETE CASCADE,
    produto_id UUID REFERENCES public.produtos(id),
    quantidade INTEGER NOT NULL,
    preco_unitario NUMERIC NOT NULL
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itens_venda ENABLE ROW LEVEL SECURITY;

CREATE POLICY "auth_all_users" ON public.users FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all_produtos" ON public.produtos FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all_vendas" ON public.vendas FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all_itens_venda" ON public.itens_venda FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, nome)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'nome', 'Operador'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.decrement_stock(p_id UUID, qty INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE public.produtos
  SET estoque = estoque - qty
  WHERE id = p_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

INSERT INTO public.produtos (codigo, nome, preco, estoque, imagem_url, categoria) VALUES
('78910001', 'Coca-Cola 2L', 10.50, 100, 'https://img.usecurling.com/p/200/200?q=coca-cola&color=red', 'Bebidas'),
('78910002', 'Guaraná Antarctica 2L', 9.00, 80, 'https://img.usecurling.com/p/200/200?q=guarana&color=green', 'Bebidas'),
('78910003', 'Pão de Forma', 6.50, 50, 'https://img.usecurling.com/p/200/200?q=sliced-bread&color=orange', 'Alimentos'),
('78910004', 'Manteiga Qualy', 12.90, 40, 'https://img.usecurling.com/p/200/200?q=butter&color=yellow', 'Alimentos'),
('78910005', 'Detergente Omo', 2.80, 200, 'https://img.usecurling.com/p/200/200?q=detergent&color=blue', 'Limpeza'),
('78910006', 'Esponja Assolan', 1.50, 300, 'https://img.usecurling.com/p/200/200?q=sponge&color=yellow', 'Limpeza'),
('78910007', 'Chocolate Laka', 5.50, 120, 'https://img.usecurling.com/p/200/200?q=chocolate-bar&color=white', 'Doces'),
('78910008', 'Biscoito Oreo', 3.90, 150, 'https://img.usecurling.com/p/200/200?q=oreo-cookie&color=blue', 'Doces');

DO $$
DECLARE
  new_user_id uuid := gen_random_uuid();
BEGIN
  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at,
    created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
    is_super_admin, role, aud,
    confirmation_token, recovery_token, email_change_token_new,
    email_change, email_change_token_current,
    phone, phone_change, phone_change_token, reauthentication_token
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000', 'admin@nexus.com', crypt('senha123', gen_salt('bf')), NOW(),
    NOW(), NOW(), '{"provider": "email", "providers": ["email"]}', '{"nome": "Admin Silva"}',
    false, 'authenticated', 'authenticated', '', '', '', '', '', NULL, '', '', ''
  );
END $$;
