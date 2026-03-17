import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { corsHeaders } from '../_shared/cors.ts'

// REQUIRED SUPABASE SECRETS:
// - WHATSAPP_API_TOKEN: Your WhatsApp Business API Token
// - WHATSAPP_PHONE_NUMBER_ID: Your WhatsApp Phone Number ID

Deno.serve(async (req: Request) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { telefone, receipt } = await req.json()

    if (!telefone || !receipt) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: telefone or receipt' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        },
      )
    }

    const WHATSAPP_API_TOKEN = Deno.env.get('WHATSAPP_API_TOKEN')
    const WHATSAPP_PHONE_NUMBER_ID = Deno.env.get('WHATSAPP_PHONE_NUMBER_ID')

    if (!WHATSAPP_API_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) {
      console.warn('WhatsApp credentials not configured in Supabase Secrets.')
      // Return 200 so the frontend doesn't crash, but indicate it wasn't sent
      return new Response(JSON.stringify({ success: false, message: 'WhatsApp secrets missing' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    // Format the items list
    const itemsText = receipt.items
      .map((i: any) => `- ${i.quantidade}x ${i.nome} (R$ ${i.preco_unitario.toFixed(2)})`)
      .join('\n')

    // Format the date
    const dateFormatted = new Date(receipt.data).toLocaleString('pt-BR')

    // Construct the message
    const message =
      `*Recibo de Venda*\n\n` +
      `*ID da Venda:* ${receipt.id}\n` +
      `*Data:* ${dateFormatted}\n\n` +
      `*Itens:*\n${itemsText}\n\n` +
      `*Total:* R$ ${receipt.total.toFixed(2)}\n` +
      `*Pagamento:* ${receipt.metodo_pagamento}\n\n` +
      `Obrigado pela preferência!`

    // Clean phone number (keep only digits)
    const formattedPhone = telefone.replace(/\D/g, '')

    // Call WhatsApp API
    const response = await fetch(
      `https://graph.facebook.com/v17.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${WHATSAPP_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: formattedPhone,
          type: 'text',
          text: { body: message },
        }),
      },
    )

    const data = await response.json()

    if (!response.ok) {
      console.error('WhatsApp API Error:', data)
      throw new Error(data.error?.message || 'Failed to send WhatsApp message')
    }

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error: any) {
    console.error('Error in send-whatsapp-receipt:', error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
