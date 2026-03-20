// AVOID UPDATING THIS FILE DIRECTLY. It is automatically generated.
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.4'
  }
  public: {
    Tables: {
      caixa: {
        Row: {
          data_abertura: string
          data_fechamento: string | null
          id: string
          saldo_final: number | null
          saldo_inicial: number
          status: string
          user_id: string
        }
        Insert: {
          data_abertura?: string
          data_fechamento?: string | null
          id?: string
          saldo_final?: number | null
          saldo_inicial: number
          status?: string
          user_id: string
        }
        Update: {
          data_abertura?: string
          data_fechamento?: string | null
          id?: string
          saldo_final?: number | null
          saldo_inicial?: number
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'caixa_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      categorias: {
        Row: {
          created_at: string
          id: string
          nome: string
        }
        Insert: {
          created_at?: string
          id?: string
          nome: string
        }
        Update: {
          created_at?: string
          id?: string
          nome?: string
        }
        Relationships: []
      }
      clientes: {
        Row: {
          cpf: string | null
          data_cadastro: string
          email: string | null
          endereco: string | null
          id: string
          nome: string
          telefone: string | null
        }
        Insert: {
          cpf?: string | null
          data_cadastro?: string
          email?: string | null
          endereco?: string | null
          id?: string
          nome: string
          telefone?: string | null
        }
        Update: {
          cpf?: string | null
          data_cadastro?: string
          email?: string | null
          endereco?: string | null
          id?: string
          nome?: string
          telefone?: string | null
        }
        Relationships: []
      }
      contas_pagar: {
        Row: {
          categoria: string | null
          data_pagamento: string | null
          data_vencimento: string
          descricao: string
          fornecedor: string | null
          id: string
          metodo_pagamento: string | null
          status: string
          valor: number
        }
        Insert: {
          categoria?: string | null
          data_pagamento?: string | null
          data_vencimento: string
          descricao: string
          fornecedor?: string | null
          id?: string
          metodo_pagamento?: string | null
          status?: string
          valor: number
        }
        Update: {
          categoria?: string | null
          data_pagamento?: string | null
          data_vencimento?: string
          descricao?: string
          fornecedor?: string | null
          id?: string
          metodo_pagamento?: string | null
          status?: string
          valor?: number
        }
        Relationships: []
      }
      contas_receber: {
        Row: {
          cliente_id: string | null
          data_pagamento: string | null
          data_vencimento: string
          id: string
          metodo_pagamento: string | null
          status: string
          valor: number
          venda_id: string
        }
        Insert: {
          cliente_id?: string | null
          data_pagamento?: string | null
          data_vencimento: string
          id?: string
          metodo_pagamento?: string | null
          status?: string
          valor: number
          venda_id: string
        }
        Update: {
          cliente_id?: string | null
          data_pagamento?: string | null
          data_vencimento?: string
          id?: string
          metodo_pagamento?: string | null
          status?: string
          valor?: number
          venda_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'contas_receber_cliente_id_fkey'
            columns: ['cliente_id']
            isOneToOne: false
            referencedRelation: 'clientes'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'contas_receber_venda_id_fkey'
            columns: ['venda_id']
            isOneToOne: false
            referencedRelation: 'vendas'
            referencedColumns: ['id']
          },
        ]
      }
      itens_venda: {
        Row: {
          id: string
          preco_unitario: number
          produto_id: string | null
          quantidade: number
          venda_id: string | null
        }
        Insert: {
          id?: string
          preco_unitario: number
          produto_id?: string | null
          quantidade: number
          venda_id?: string | null
        }
        Update: {
          id?: string
          preco_unitario?: number
          produto_id?: string | null
          quantidade?: number
          venda_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'itens_venda_produto_id_fkey'
            columns: ['produto_id']
            isOneToOne: false
            referencedRelation: 'produtos'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'itens_venda_venda_id_fkey'
            columns: ['venda_id']
            isOneToOne: false
            referencedRelation: 'vendas'
            referencedColumns: ['id']
          },
        ]
      }
      movimentacoes_caixa: {
        Row: {
          caixa_id: string
          data: string
          descricao: string
          id: string
          tipo: string
          valor: number
        }
        Insert: {
          caixa_id: string
          data?: string
          descricao: string
          id?: string
          tipo: string
          valor: number
        }
        Update: {
          caixa_id?: string
          data?: string
          descricao?: string
          id?: string
          tipo?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: 'movimentacoes_caixa_caixa_id_fkey'
            columns: ['caixa_id']
            isOneToOne: false
            referencedRelation: 'caixa'
            referencedColumns: ['id']
          },
        ]
      }
      movimentacoes_estoque: {
        Row: {
          data: string
          id: string
          motivo: string
          produto_id: string
          quantidade: number
          tipo: string
          user_id: string
        }
        Insert: {
          data?: string
          id?: string
          motivo: string
          produto_id: string
          quantidade: number
          tipo: string
          user_id: string
        }
        Update: {
          data?: string
          id?: string
          motivo?: string
          produto_id?: string
          quantidade?: number
          tipo?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'movimentacoes_estoque_produto_id_fkey'
            columns: ['produto_id']
            isOneToOne: false
            referencedRelation: 'produtos'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'movimentacoes_estoque_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      produtos: {
        Row: {
          categoria: string | null
          codigo: string | null
          descricao: string | null
          estoque: number | null
          estoque_minimo: number
          id: string
          imagem_url: string | null
          nome: string
          preco: number
          preco_custo: number | null
          preco_venda: number | null
          tamanho: string | null
        }
        Insert: {
          categoria?: string | null
          codigo?: string | null
          descricao?: string | null
          estoque?: number | null
          estoque_minimo?: number
          id?: string
          imagem_url?: string | null
          nome: string
          preco: number
          preco_custo?: number | null
          preco_venda?: number | null
          tamanho?: string | null
        }
        Update: {
          categoria?: string | null
          codigo?: string | null
          descricao?: string | null
          estoque?: number | null
          estoque_minimo?: number
          id?: string
          imagem_url?: string | null
          nome?: string
          preco?: number
          preco_custo?: number | null
          preco_venda?: number | null
          tamanho?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          email: string | null
          id: string
          nome: string | null
          role: string | null
        }
        Insert: {
          email?: string | null
          id: string
          nome?: string | null
          role?: string | null
        }
        Update: {
          email?: string | null
          id?: string
          nome?: string | null
          role?: string | null
        }
        Relationships: []
      }
      vendas: {
        Row: {
          cliente_id: string | null
          data: string | null
          desconto: number | null
          id: string
          metodo_pagamento: string | null
          status: string | null
          total: number
          user_id: string | null
        }
        Insert: {
          cliente_id?: string | null
          data?: string | null
          desconto?: number | null
          id?: string
          metodo_pagamento?: string | null
          status?: string | null
          total: number
          user_id?: string | null
        }
        Update: {
          cliente_id?: string | null
          data?: string | null
          desconto?: number | null
          id?: string
          metodo_pagamento?: string | null
          status?: string | null
          total?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'vendas_cliente_id_fkey'
            columns: ['cliente_id']
            isOneToOne: false
            referencedRelation: 'clientes'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'vendas_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      decrement_stock: {
        Args: { p_id: string; qty: number }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

// ====== DATABASE EXTENDED CONTEXT (auto-generated) ======
// This section contains actual PostgreSQL column types, constraints, RLS policies,
// functions, triggers, indexes and materialized views not present in the type definitions above.
// IMPORTANT: The TypeScript types above map UUID, TEXT, VARCHAR all to "string".
// Use the COLUMN TYPES section below to know the real PostgreSQL type for each column.
// Always use the correct PostgreSQL type when writing SQL migrations.

// --- COLUMN TYPES (actual PostgreSQL types) ---
// Use this to know the real database type when writing migrations.
// "string" in TypeScript types above may be uuid, text, varchar, timestamptz, etc.
// Table: caixa
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (not null)
//   data_abertura: timestamp with time zone (not null, default: now())
//   data_fechamento: timestamp with time zone (nullable)
//   saldo_inicial: numeric (not null)
//   saldo_final: numeric (nullable)
//   status: text (not null, default: 'aberto'::text)
// Table: categorias
//   id: uuid (not null, default: gen_random_uuid())
//   nome: text (not null)
//   created_at: timestamp with time zone (not null, default: now())
// Table: clientes
//   id: uuid (not null, default: gen_random_uuid())
//   nome: text (not null)
//   email: text (nullable)
//   telefone: text (nullable)
//   cpf: text (nullable)
//   endereco: text (nullable)
//   data_cadastro: timestamp with time zone (not null, default: now())
// Table: contas_pagar
//   id: uuid (not null, default: gen_random_uuid())
//   descricao: text (not null)
//   valor: numeric (not null)
//   data_vencimento: timestamp with time zone (not null)
//   categoria: text (nullable)
//   status: text (not null, default: 'pendente'::text)
//   data_pagamento: timestamp with time zone (nullable)
//   fornecedor: text (nullable)
//   metodo_pagamento: text (nullable)
// Table: contas_receber
//   id: uuid (not null, default: gen_random_uuid())
//   venda_id: uuid (not null)
//   cliente_id: uuid (nullable)
//   valor: numeric (not null)
//   data_vencimento: timestamp with time zone (not null)
//   status: text (not null, default: 'pendente'::text)
//   data_pagamento: timestamp with time zone (nullable)
//   metodo_pagamento: text (nullable)
// Table: itens_venda
//   id: uuid (not null, default: gen_random_uuid())
//   venda_id: uuid (nullable)
//   produto_id: uuid (nullable)
//   quantidade: integer (not null)
//   preco_unitario: numeric (not null)
// Table: movimentacoes_caixa
//   id: uuid (not null, default: gen_random_uuid())
//   caixa_id: uuid (not null)
//   tipo: text (not null)
//   valor: numeric (not null)
//   descricao: text (not null)
//   data: timestamp with time zone (not null, default: now())
// Table: movimentacoes_estoque
//   id: uuid (not null, default: gen_random_uuid())
//   produto_id: uuid (not null)
//   tipo: text (not null)
//   quantidade: integer (not null)
//   motivo: text (not null)
//   data: timestamp with time zone (not null, default: now())
//   user_id: uuid (not null)
// Table: produtos
//   id: uuid (not null, default: gen_random_uuid())
//   codigo: text (nullable)
//   nome: text (not null)
//   descricao: text (nullable)
//   preco: numeric (not null)
//   estoque: integer (nullable, default: 0)
//   imagem_url: text (nullable)
//   categoria: text (nullable)
//   estoque_minimo: integer (not null, default: 0)
//   preco_custo: numeric (nullable, default: 0)
//   preco_venda: numeric (nullable, default: 0)
//   tamanho: text (nullable)
// Table: users
//   id: uuid (not null)
//   email: text (nullable)
//   nome: text (nullable)
//   role: text (nullable, default: 'operador'::text)
// Table: vendas
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (nullable)
//   data: timestamp with time zone (nullable, default: now())
//   total: numeric (not null)
//   metodo_pagamento: text (nullable)
//   status: text (nullable, default: 'Concluído'::text)
//   cliente_id: uuid (nullable)
//   desconto: numeric (nullable, default: 0)

// --- CONSTRAINTS ---
// Table: caixa
//   PRIMARY KEY caixa_pkey: PRIMARY KEY (id)
//   CHECK caixa_status_check: CHECK ((status = ANY (ARRAY['aberto'::text, 'fechado'::text])))
//   FOREIGN KEY caixa_user_id_fkey: FOREIGN KEY (user_id) REFERENCES users(id)
// Table: categorias
//   UNIQUE categorias_nome_key: UNIQUE (nome)
//   PRIMARY KEY categorias_pkey: PRIMARY KEY (id)
// Table: clientes
//   PRIMARY KEY clientes_pkey: PRIMARY KEY (id)
// Table: contas_pagar
//   PRIMARY KEY contas_pagar_pkey: PRIMARY KEY (id)
// Table: contas_receber
//   FOREIGN KEY contas_receber_cliente_id_fkey: FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE SET NULL
//   PRIMARY KEY contas_receber_pkey: PRIMARY KEY (id)
//   FOREIGN KEY contas_receber_venda_id_fkey: FOREIGN KEY (venda_id) REFERENCES vendas(id) ON DELETE CASCADE
// Table: itens_venda
//   PRIMARY KEY itens_venda_pkey: PRIMARY KEY (id)
//   FOREIGN KEY itens_venda_produto_id_fkey: FOREIGN KEY (produto_id) REFERENCES produtos(id)
//   FOREIGN KEY itens_venda_venda_id_fkey: FOREIGN KEY (venda_id) REFERENCES vendas(id) ON DELETE CASCADE
// Table: movimentacoes_caixa
//   FOREIGN KEY movimentacoes_caixa_caixa_id_fkey: FOREIGN KEY (caixa_id) REFERENCES caixa(id) ON DELETE CASCADE
//   PRIMARY KEY movimentacoes_caixa_pkey: PRIMARY KEY (id)
//   CHECK movimentacoes_caixa_tipo_check: CHECK ((tipo = ANY (ARRAY['entrada'::text, 'saida'::text])))
// Table: movimentacoes_estoque
//   PRIMARY KEY movimentacoes_estoque_pkey: PRIMARY KEY (id)
//   FOREIGN KEY movimentacoes_estoque_produto_id_fkey: FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE
//   CHECK movimentacoes_estoque_tipo_check: CHECK ((tipo = ANY (ARRAY['entrada'::text, 'saida'::text])))
//   FOREIGN KEY movimentacoes_estoque_user_id_fkey: FOREIGN KEY (user_id) REFERENCES users(id)
// Table: produtos
//   PRIMARY KEY produtos_pkey: PRIMARY KEY (id)
// Table: users
//   FOREIGN KEY users_id_fkey: FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
//   PRIMARY KEY users_pkey: PRIMARY KEY (id)
// Table: vendas
//   FOREIGN KEY vendas_cliente_id_fkey: FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE SET NULL
//   PRIMARY KEY vendas_pkey: PRIMARY KEY (id)
//   FOREIGN KEY vendas_user_id_fkey: FOREIGN KEY (user_id) REFERENCES users(id)

// --- ROW LEVEL SECURITY POLICIES ---
// Table: caixa
//   Policy "auth_all_caixa" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: categorias
//   Policy "auth_all_categorias" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: clientes
//   Policy "auth_all_clientes" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: contas_pagar
//   Policy "auth_all_contas_pagar" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: contas_receber
//   Policy "auth_all_contas_receber" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: itens_venda
//   Policy "auth_all_itens_venda" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: movimentacoes_caixa
//   Policy "auth_all_movimentacoes_caixa" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: movimentacoes_estoque
//   Policy "auth_all_movimentacoes_estoque" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: produtos
//   Policy "auth_all_produtos" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: users
//   Policy "auth_all_users" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: vendas
//   Policy "auth_all_vendas" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true

// --- DATABASE FUNCTIONS ---
// FUNCTION decrement_stock(uuid, integer)
//   CREATE OR REPLACE FUNCTION public.decrement_stock(p_id uuid, qty integer)
//    RETURNS void
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   DECLARE
//       v_user_id UUID;
//   BEGIN
//       -- Decrementa o estoque
//       UPDATE public.produtos
//       SET estoque = estoque - qty
//       WHERE id = p_id;
//
//       -- Obtém o ID do usuário autenticado atual
//       v_user_id := auth.uid();
//
//       -- Se houver um usuário logado (o que é esperado via app), registra o histórico da venda
//       IF v_user_id IS NOT NULL THEN
//           INSERT INTO public.movimentacoes_estoque (produto_id, tipo, quantidade, motivo, user_id)
//           VALUES (p_id, 'saida', qty, 'venda', v_user_id);
//       END IF;
//   END;
//   $function$
//
// FUNCTION handle_new_user()
//   CREATE OR REPLACE FUNCTION public.handle_new_user()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   BEGIN
//     INSERT INTO public.users (id, email, nome)
//     VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'nome', 'Operador'));
//     RETURN NEW;
//   END;
//   $function$
//

// --- INDEXES ---
// Table: categorias
//   CREATE UNIQUE INDEX categorias_nome_key ON public.categorias USING btree (nome)
