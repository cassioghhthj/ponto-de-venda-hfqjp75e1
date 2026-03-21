import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Verify authentication
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) throw new Error('Missing Authorization header')

    const token = authHeader.replace('Bearer ', '')
    const {
      data: { user },
      error: verifyError,
    } = await supabase.auth.getUser(token)
    if (verifyError || !user) throw new Error('Unauthorized')

    // Verify admin role in public.users
    const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') throw new Error('Forbidden: Admins only')

    const { action, payload } = await req.json()

    if (action === 'create') {
      const { email, password, nome, permissions } = payload

      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { nome },
      })

      if (authError) throw authError

      // Update public.users (row is auto-created by the trigger handle_new_user)
      const { error: updateError } = await supabase
        .from('users')
        .update({ permissions, role: 'operador', nome })
        .eq('id', authData.user.id)

      if (updateError) throw updateError

      return new Response(JSON.stringify({ success: true, user: authData.user }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (action === 'delete') {
      const { id } = payload
      const { error } = await supabase.auth.admin.deleteUser(id)
      if (error) throw error

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (action === 'update_password') {
      const { id, password } = payload
      const { error } = await supabase.auth.admin.updateUserById(id, { password })
      if (error) throw error

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    throw new Error('Invalid action')
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
