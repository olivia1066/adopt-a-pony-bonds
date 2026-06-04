import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    // Corps brut : indispensable pour vérifier la signature HMAC.
    const rawBody = await request.text()

    // === 1. Vérification HMAC (c'est bien DocuSign qui appelle) ===
    const hmacKey = process.env.DOCUSIGN_CONNECT_HMAC_KEY
    if (!hmacKey) {
      console.error('❌ DOCUSIGN_CONNECT_HMAC_KEY manquante')
      return NextResponse.json({ error: 'config' }, { status: 500 })
    }

    const signature = request.headers.get('x-docusign-signature-1') || ''
    const computed = crypto.createHmac('sha256', hmacKey).update(rawBody, 'utf8').digest('base64')

    const sigBuf = Buffer.from(signature)
    const cmpBuf = Buffer.from(computed)
    const valid = sigBuf.length === cmpBuf.length && crypto.timingSafeEqual(sigBuf, cmpBuf)

    if (!valid) {
      console.error('❌ Signature HMAC invalide')
      return NextResponse.json({ error: 'invalid signature' }, { status: 401 })
    }

    // === 2. Lecture du contenu ===
    const payload = JSON.parse(rawBody)
    const envelopeId =
      payload?.data?.envelopeId ||
      payload?.envelopeId ||
      payload?.data?.envelopeSummary?.envelopeId

    const status = String(
      payload?.data?.envelopeSummary?.status ||
        payload?.status ||
        payload?.data?.status ||
        ''
    ).toLowerCase()

    if (!envelopeId) {
      return NextResponse.json({ received: true, note: 'no envelopeId' })
    }

    // === 3. Mise à jour de l'investissement (matching par envelope_id) ===
    // Idempotent : recevoir deux fois le même événement ne change rien.
    if (status === 'completed') {
      const { error } = await supabaseAdmin
        .from('investments')
        .update({ signature_status: 'completed' })
        .eq('envelope_id', envelopeId)
      if (error) console.error('❌ Erreur update investment:', error)
      else console.log('✅ Signature confirmée pour enveloppe', envelopeId)
    } else if (status === 'declined' || status === 'voided') {
      await supabaseAdmin
        .from('investments')
        .update({ signature_status: status })
        .eq('envelope_id', envelopeId)
    }

    return NextResponse.json({ received: true })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue'
    console.error('❌ Erreur webhook DocuSign:', error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}