ALTER TABLE public.users ADD COLUMN IF NOT EXISTS permissions JSONB DEFAULT '{}'::jsonb;

-- Garante que o administrador principal e outros admins já existentes tenham permissão total
UPDATE public.users 
SET role = 'admin', 
    permissions = '{"dashboard": true, "pdv": true, "estoque": true, "clientes": true, "contas_receber": true, "contas_pagar": true, "caixa": true, "relatorios": true, "usuarios": true}'::jsonb 
WHERE email = 'contato.lojacharmeluiziana@gmail.com' OR role = 'admin';
