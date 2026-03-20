-- Add metodo_pagamento to contas_receber
ALTER TABLE public.contas_receber ADD COLUMN IF NOT EXISTS metodo_pagamento TEXT;

-- Add metodo_pagamento to contas_pagar
ALTER TABLE public.contas_pagar ADD COLUMN IF NOT EXISTS metodo_pagamento TEXT;
