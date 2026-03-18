CREATE TABLE public.categorias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;

CREATE POLICY "auth_all_categorias" ON public.categorias
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Seed existing categories from produtos table
INSERT INTO public.categorias (nome)
SELECT DISTINCT categoria FROM public.produtos WHERE categoria IS NOT NULL AND categoria != ''
ON CONFLICT (nome) DO NOTHING;
