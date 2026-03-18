-- Add formal foreign key relationship between contas_receber and clientes
ALTER TABLE public.contas_receber
  DROP CONSTRAINT IF EXISTS contas_receber_cliente_id_fkey;

ALTER TABLE public.contas_receber
  ADD CONSTRAINT contas_receber_cliente_id_fkey
  FOREIGN KEY (cliente_id)
  REFERENCES public.clientes(id)
  ON DELETE SET NULL;
