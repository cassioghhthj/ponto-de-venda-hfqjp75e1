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
      produtos: {
        Row: {
          categoria: string | null
          codigo: string | null
          descricao: string | null
          estoque: number | null
          id: string
          imagem_url: string | null
          nome: string
          preco: number
        }
        Insert: {
          categoria?: string | null
          codigo?: string | null
          descricao?: string | null
          estoque?: number | null
          id?: string
          imagem_url?: string | null
          nome: string
          preco: number
        }
        Update: {
          categoria?: string | null
          codigo?: string | null
          descricao?: string | null
          estoque?: number | null
          id?: string
          imagem_url?: string | null
          nome?: string
          preco?: number
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
          data: string | null
          id: string
          metodo_pagamento: string | null
          status: string | null
          total: number
          user_id: string | null
        }
        Insert: {
          data?: string | null
          id?: string
          metodo_pagamento?: string | null
          status?: string | null
          total: number
          user_id?: string | null
        }
        Update: {
          data?: string | null
          id?: string
          metodo_pagamento?: string | null
          status?: string | null
          total?: number
          user_id?: string | null
        }
        Relationships: [
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
// Table: itens_venda
//   id: uuid (not null, default: gen_random_uuid())
//   venda_id: uuid (nullable)
//   produto_id: uuid (nullable)
//   quantidade: integer (not null)
//   preco_unitario: numeric (not null)
// Table: produtos
//   id: uuid (not null, default: gen_random_uuid())
//   codigo: text (nullable)
//   nome: text (not null)
//   descricao: text (nullable)
//   preco: numeric (not null)
//   estoque: integer (nullable, default: 0)
//   imagem_url: text (nullable)
//   categoria: text (nullable)
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

// --- CONSTRAINTS ---
// Table: itens_venda
//   PRIMARY KEY itens_venda_pkey: PRIMARY KEY (id)
//   FOREIGN KEY itens_venda_produto_id_fkey: FOREIGN KEY (produto_id) REFERENCES produtos(id)
//   FOREIGN KEY itens_venda_venda_id_fkey: FOREIGN KEY (venda_id) REFERENCES vendas(id) ON DELETE CASCADE
// Table: produtos
//   PRIMARY KEY produtos_pkey: PRIMARY KEY (id)
// Table: users
//   FOREIGN KEY users_id_fkey: FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
//   PRIMARY KEY users_pkey: PRIMARY KEY (id)
// Table: vendas
//   PRIMARY KEY vendas_pkey: PRIMARY KEY (id)
//   FOREIGN KEY vendas_user_id_fkey: FOREIGN KEY (user_id) REFERENCES users(id)

// --- ROW LEVEL SECURITY POLICIES ---
// Table: itens_venda
//   Policy "auth_all_itens_venda" (ALL, PERMISSIVE) roles={authenticated}
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
//   BEGIN
//     UPDATE public.produtos
//     SET estoque = estoque - qty
//     WHERE id = p_id;
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
