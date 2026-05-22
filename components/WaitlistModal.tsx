'use client'

import { useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { supabase } from '@/lib/supabase'

type Props = {
  isOpen: boolean
  onClose: () => void
  /** Optional source label, e.g. 'home_hero', 'campaign_card', etc. */
  source?: string
}

export default function WaitlistModal({ isOpen, onClose, source }: Props) {
  const t = useTranslations('waitlist')
  const locale = useLocale()

  const [form, setForm] = useState({ prenom: '', nom: '', email: '', telephone: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setForm({ prenom: '', nom: '', email: '', telephone: '' })
        setError('')
        setSuccess(false)
        setSubmitting(false)
      }, 300)
    }
  }, [isOpen])

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  async function handleSubmit() {
    setError('')

    // Validation
    if (!form.prenom.trim() || !form.nom.trim() || !form.email.trim()) {
      setError(t('errorFillRequired'))
      return
    }
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
    if (!emailValid) {
      setError(t('errorInvalidEmail'))
      return
    }

    setSubmitting(true)
    try {
      const { error: insertError } = await supabase
        .from('waitlist_signups')
        .insert({
          prenom: form.prenom.trim(),
          nom: form.nom.trim(),
          email: form.email.trim().toLowerCase(),
          telephone: form.telephone.trim() || null,
          locale,
          source: source ?? null,
        })

      if (insertError) throw insertError
      setSuccess(true)
    } catch (err: any) {
      setError(err.message || t('errorGeneric'))
    } finally {
      setSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        backgroundColor: 'rgba(13,11,32,0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="waitlist-modal"
        style={{
          width: '100%', maxWidth: '480px',
          backgroundColor: '#1E1B4B',
          borderRadius: '24px',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,255,255,0.05)',
          padding: '32px',
          position: 'relative',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute', top: '16px', right: '16px',
            width: '32px', height: '32px', borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.06)',
            border: 'none', color: 'white', cursor: 'pointer',
            fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >×</button>

        {!success ? (
          <>
            <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '8px', color: 'white', paddingRight: '32px' }}>
              🔔 {t('title')}
            </h2>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginBottom: '24px', lineHeight: 1.5 }}>
              {t('subtitle')}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
              {[
                { key: 'prenom', label: t('firstName'), required: true, type: 'text' },
                { key: 'nom', label: t('lastName'), required: true, type: 'text' },
                { key: 'email', label: t('email'), required: true, type: 'email' },
                { key: 'telephone', label: t('phone'), required: false, type: 'tel' },
              ].map(field => (
                <div key={field.key}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'white', marginBottom: '6px' }}>
                    {field.label}{field.required ? ' *' : ''}
                  </label>
                  <input
                    type={field.type}
                    value={form[field.key as keyof typeof form]}
                    onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                    disabled={submitting}
                    style={{
                      width: '100%', padding: '12px 14px', borderRadius: '10px',
                      backgroundColor: 'rgba(0,0,0,0.2)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: 'white', fontSize: '14px', outline: 'none',
                    }}
                  />
                </div>
              ))}
            </div>

            {error && (
              <div style={{
                fontSize: '13px', padding: '10px 14px', borderRadius: '10px',
                backgroundColor: 'rgba(255,80,80,0.1)',
                border: '1px solid rgba(255,80,80,0.3)',
                color: '#FF8080', marginBottom: '16px',
              }}>
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={submitting}
              style={{
                width: '100%', padding: '14px', borderRadius: '12px',
                backgroundColor: '#00FFFF', color: '#13102B',
                fontSize: '14px', fontWeight: 800, border: 'none',
                cursor: submitting ? 'not-allowed' : 'pointer',
                opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting ? t('submitting') : t('submit')}
            </button>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              backgroundColor: 'rgba(0,255,255,0.15)',
              color: '#00FFFF', fontSize: '32px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
            }}>✓</div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '12px', color: 'white' }}>
              {t('successTitle')}
            </h2>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginBottom: '24px', lineHeight: 1.5 }}>
              {t('successDesc')}
            </p>
            <button
              onClick={onClose}
              style={{
                width: '100%', padding: '14px', borderRadius: '12px',
                backgroundColor: '#00FFFF', color: '#13102B',
                fontSize: '14px', fontWeight: 800, border: 'none',
                cursor: 'pointer',
              }}
            >
              {t('close')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}