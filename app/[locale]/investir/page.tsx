'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from '@/i18n/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { supabase } from '@/lib/supabase'
import { getActiveCampaign, isInvestmentOpen } from '@/lib/campaigns'
import { Link } from '@/i18n/navigation'

// ── DocuSign Focused View ──
// Bundle JS DocuSign. Demo/sandbox : js-d.docusign.com.
// ⚠️ Passage en PRODUCTION : remplacer par 'https://js.docusign.com/bundle.js'.
const DOCUSIGN_JS_SRC = 'https://js-d.docusign.com/bundle.js'

declare global {
  interface Window {
    DocuSign?: {
      loadDocuSign: (integrationKey: string) => Promise<{
        signing: (config: Record<string, unknown>) => {
          on: (event: string, cb: (e: { sessionEndType?: string }) => void) => void
          mount: (target: string | HTMLElement) => void
        }
      }>
    }
  }
}

let docusignScriptPromise: Promise<void> | null = null
function loadDocusignScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.reject(new Error('window indisponible'))
  if (window.DocuSign) return Promise.resolve()
  if (docusignScriptPromise) return docusignScriptPromise

  docusignScriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${DOCUSIGN_JS_SRC}"]`)
    if (existing) {
      existing.addEventListener('load', () => resolve())
      existing.addEventListener('error', () => reject(new Error('Échec chargement DocuSign JS')))
      return
    }
    const s = document.createElement('script')
    s.src = DOCUSIGN_JS_SRC
    s.async = true
    s.onload = () => resolve()
    s.onerror = () => reject(new Error('Échec chargement DocuSign JS'))
    document.head.appendChild(s)
  })
  return docusignScriptPromise
}

// ── Product terms ──
const ANNUAL_RATE = 0.085
const MONTHLY_RATE = ANNUAL_RATE / 12
const GRACE_MONTHS = 12
const PAYBACK_MONTHS = 36

function calcReturns(amount: number) {
  const capitalAfterGrace = amount * Math.pow(1 + MONTHLY_RATE, GRACE_MONTHS)
  const paybackInterest = capitalAfterGrace * ANNUAL_RATE * (PAYBACK_MONTHS / 12)
  const monthlyPayment = (capitalAfterGrace + paybackInterest) / PAYBACK_MONTHS
  const totalRepaid = capitalAfterGrace + paybackInterest
  const totalInterest = totalRepaid - amount
  return { capitalAfterGrace, paybackInterest, monthlyPayment, totalRepaid, totalInterest }
}

// ── Bilingual country list ──
const COUNTRIES: { code: string; fr: string; en: string }[] = [
  { code: 'FR', fr: 'France', en: 'France' },
  { code: 'BE', fr: 'Belgique', en: 'Belgium' },
  { code: 'CH', fr: 'Suisse', en: 'Switzerland' },
  { code: 'LU', fr: 'Luxembourg', en: 'Luxembourg' },
  { code: 'DE', fr: 'Allemagne', en: 'Germany' },
  { code: 'ES', fr: 'Espagne', en: 'Spain' },
  { code: 'IT', fr: 'Italie', en: 'Italy' },
  { code: 'PT', fr: 'Portugal', en: 'Portugal' },
  { code: 'NL', fr: 'Pays-Bas', en: 'Netherlands' },
  { code: 'GB', fr: 'Royaume-Uni', en: 'United Kingdom' },
  { code: 'IE', fr: 'Irlande', en: 'Ireland' },
  { code: 'AT', fr: 'Autriche', en: 'Austria' },
  { code: 'DK', fr: 'Danemark', en: 'Denmark' },
  { code: 'SE', fr: 'Suède', en: 'Sweden' },
  { code: 'FI', fr: 'Finlande', en: 'Finland' },
  { code: 'NO', fr: 'Norvège', en: 'Norway' },
  { code: 'PL', fr: 'Pologne', en: 'Poland' },
  { code: 'CZ', fr: 'République tchèque', en: 'Czech Republic' },
  { code: 'GR', fr: 'Grèce', en: 'Greece' },
  { code: 'HU', fr: 'Hongrie', en: 'Hungary' },
  { code: 'RO', fr: 'Roumanie', en: 'Romania' },
  { code: 'BG', fr: 'Bulgarie', en: 'Bulgaria' },
  { code: 'HR', fr: 'Croatie', en: 'Croatia' },
  { code: 'SK', fr: 'Slovaquie', en: 'Slovakia' },
  { code: 'SI', fr: 'Slovénie', en: 'Slovenia' },
  { code: 'EE', fr: 'Estonie', en: 'Estonia' },
  { code: 'LV', fr: 'Lettonie', en: 'Latvia' },
  { code: 'LT', fr: 'Lituanie', en: 'Lithuania' },
  { code: 'MT', fr: 'Malte', en: 'Malta' },
  { code: 'CY', fr: 'Chypre', en: 'Cyprus' },
  { code: 'IS', fr: 'Islande', en: 'Iceland' },
  { code: 'MC', fr: 'Monaco', en: 'Monaco' },
  { code: 'US', fr: 'États-Unis', en: 'United States' },
  { code: 'CA', fr: 'Canada', en: 'Canada' },
  { code: 'MX', fr: 'Mexique', en: 'Mexico' },
  { code: 'BR', fr: 'Brésil', en: 'Brazil' },
  { code: 'AR', fr: 'Argentine', en: 'Argentina' },
  { code: 'CL', fr: 'Chili', en: 'Chile' },
  { code: 'CO', fr: 'Colombie', en: 'Colombia' },
  { code: 'PE', fr: 'Pérou', en: 'Peru' },
  { code: 'UY', fr: 'Uruguay', en: 'Uruguay' },
  { code: 'AU', fr: 'Australie', en: 'Australia' },
  { code: 'NZ', fr: 'Nouvelle-Zélande', en: 'New Zealand' },
  { code: 'JP', fr: 'Japon', en: 'Japan' },
  { code: 'KR', fr: 'Corée du Sud', en: 'South Korea' },
  { code: 'CN', fr: 'Chine', en: 'China' },
  { code: 'HK', fr: 'Hong Kong', en: 'Hong Kong' },
  { code: 'SG', fr: 'Singapour', en: 'Singapore' },
  { code: 'IN', fr: 'Inde', en: 'India' },
  { code: 'ID', fr: 'Indonésie', en: 'Indonesia' },
  { code: 'TH', fr: 'Thaïlande', en: 'Thailand' },
  { code: 'VN', fr: 'Viêt Nam', en: 'Vietnam' },
  { code: 'PH', fr: 'Philippines', en: 'Philippines' },
  { code: 'MY', fr: 'Malaisie', en: 'Malaysia' },
  { code: 'AE', fr: 'Émirats arabes unis', en: 'United Arab Emirates' },
  { code: 'SA', fr: 'Arabie saoudite', en: 'Saudi Arabia' },
  { code: 'IL', fr: 'Israël', en: 'Israel' },
  { code: 'TR', fr: 'Turquie', en: 'Turkey' },
  { code: 'EG', fr: 'Égypte', en: 'Egypt' },
  { code: 'MA', fr: 'Maroc', en: 'Morocco' },
  { code: 'DZ', fr: 'Algérie', en: 'Algeria' },
  { code: 'TN', fr: 'Tunisie', en: 'Tunisia' },
  { code: 'SN', fr: 'Sénégal', en: 'Senegal' },
  { code: 'CI', fr: "Côte d'Ivoire", en: 'Ivory Coast' },
  { code: 'CM', fr: 'Cameroun', en: 'Cameroon' },
  { code: 'ZA', fr: 'Afrique du Sud', en: 'South Africa' },
  { code: 'NG', fr: 'Nigeria', en: 'Nigeria' },
  { code: 'KE', fr: 'Kenya', en: 'Kenya' },
  { code: 'OTHER', fr: 'Autre', en: 'Other' },
]

function InvestirForm() {
  const t = useTranslations('investir')
  const locale = useLocale()
  const router = useRouter()
  const searchParams = useSearchParams()
  const campaignId = searchParams.get('campaignId')
  const vipToken = searchParams.get('vip')

  // Montant borné entre 500 et 100 000
  const rawAmount = Number(searchParams.get('amount')) || 5000
  const amount = Math.min(100000, Math.max(500, rawAmount))

  // Contrôle d'accès : autorisé si campagne ongoing OU token VIP valide
  const [accessChecked, setAccessChecked] = useState(false)
  useEffect(() => {
    let active = true
    async function checkAccess() {
      const isVip = !!vipToken && vipToken === process.env.NEXT_PUBLIC_VIP_TOKEN
      if (isVip) {
        if (active) setAccessChecked(true)
        return
      }
      const campaign = await getActiveCampaign()
      const open = campaign ? isInvestmentOpen(campaign.status) : false
      if (!active) return
      if (open) {
        setAccessChecked(true)
      } else {
        router.replace('/')
      }
    }
    checkAccess()
    return () => { active = false }
  }, [vipToken, router])

  const { monthlyPayment, totalInterest, totalRepaid } = calcReturns(amount)

  const numberLocale = locale === 'fr' ? 'fr-FR' : 'en-GB'
  const fmtInt = (n: number) => new Intl.NumberFormat(numberLocale, { maximumFractionDigits: 0 }).format(n)
  const fmtDec = (n: number) => new Intl.NumberFormat(numberLocale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)

  const sortedCountries = [...COUNTRIES].sort((a, b) =>
    a.code === 'OTHER' ? 1 : b.code === 'OTHER' ? -1 : (locale === 'fr' ? a.fr.localeCompare(b.fr, 'fr') : a.en.localeCompare(b.en, 'en'))
  )

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [investorId, setInvestorId] = useState('')
  const [contractSigned, setContractSigned] = useState(false)
  const [investorIban, setInvestorIban] = useState('')
  const [copied, setCopied] = useState('')
  const [signingUrl, setSigningUrl] = useState('')
  const signingDoneRef = useRef(false)
  const signingMountedRef = useRef(false)
  const signingContainerRef = useRef<HTMLDivElement>(null)

  const [form, setForm] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    adresse: '',
  })

  const update = (field: string, value: string | boolean) =>
    setForm(prev => ({ ...prev, [field]: value }))

  async function handleSubmitKYC() {
    setError('')
    if (!form.prenom || !form.nom || !form.email || !form.telephone || !form.adresse) {
      setError(t('errorFillAll'))
      return
    }
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('investors')
        .upsert({
          prenom: form.prenom,
          nom: form.nom,
          email: form.email,
          telephone: form.telephone,
          adresse: form.adresse,
          kyc_status: 'pending',
        }, { onConflict: 'email' })
        .select()
        .single()

      if (error) throw error
      setInvestorId(data.id)
      setStep(2)
    } catch (err: any) {
      setError(err.message || t('errorGeneric'))
    }
    setLoading(false)
  }

  async function handleConfirm() {
    setStep(3)
  }

  // Étape 3a : lance la signature embarquée DocuSign
  async function handleStartSigning() {
    if (!contractSigned) {
      setError(t('errorReadContract'))
      return
    }
    setError('')
    setLoading(true)
    signingDoneRef.current = false
    signingMountedRef.current = false
    try {
      const res = await fetch('/api/docusign/create-signing-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          firstName: form.prenom,
          lastName: form.nom,
          amount,
          investorId,
          campaignId,
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.success || !data.signingUrl) {
        throw new Error(data.error || t('errorGeneric'))
      }
      setSigningUrl(data.signingUrl)
    } catch (err: any) {
      setError(err.message || t('errorGeneric'))
    }
    setLoading(false)
  }

  // Étape 3b : appelée une fois la signature confirmée par DocuSign.
  // La ligne investments est déjà créée à l'ouverture de la signature
  // (route create-signing-url) ; le webhook la passera en "signé" côté
  // serveur. Ici on ne fait qu'avancer l'écran (affichage optimiste).
  async function completeSignature() {
    setStep(4)
  }

  // Monte le Focused View DocuSign dès qu'une signingUrl est disponible.
  useEffect(() => {
    if (!signingUrl) {
      signingMountedRef.current = false
      return
    }
    if (signingMountedRef.current) return

    let cancelled = false

    async function mountFocusedView() {
      try {
        await loadDocusignScript()
        if (cancelled || !window.DocuSign) return

        const ik = process.env.NEXT_PUBLIC_DOCUSIGN_INTEGRATION_KEY
        if (!ik) throw new Error('NEXT_PUBLIC_DOCUSIGN_INTEGRATION_KEY manquante')

        const docusign = await window.DocuSign.loadDocuSign(ik)
        if (cancelled) return

        const signing = docusign.signing({
          url: signingUrl,
          displayFormat: 'focused',
          style: {
            branding: {
              primaryButton: {
                backgroundColor: '#00FFFF',
                color: '#13102B',
              },
            },
            signingNavigationButton: {
              finishText: locale === 'fr' ? 'Terminer' : 'Finish',
              position: 'bottom-center',
            },
          },
        })

        signing.on('ready', () => {})

        signing.on('sessionEnd', (event) => {
          if (cancelled) return
          if (event?.sessionEndType === 'signing_complete') {
            if (signingDoneRef.current) return
            signingDoneRef.current = true
            completeSignature()
          } else {
            signingMountedRef.current = false
            setSigningUrl('')
            setError(
              locale === 'fr'
                ? 'Signature non finalisée. Vous pouvez relancer la signature.'
                : 'Signing not completed. You can restart the signature.'
            )
          }
        })

        const container = signingContainerRef.current
        if (!container) throw new Error('Conteneur de signature introuvable')

        signing.mount(container)
        signingMountedRef.current = true
      } catch {
        if (cancelled) return
        signingMountedRef.current = false
        setSigningUrl('')
        setError(
          locale === 'fr'
            ? 'Impossible de charger la signature. Veuillez réessayer.'
            : 'Unable to load the signing session. Please try again.'
        )
      }
    }

    mountFocusedView()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signingUrl])

  function copyToClipboard(value: string, key: string) {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(key)
      setTimeout(() => setCopied(''), 1500)
    })
  }

  async function handleTransferDone() {
    setError('')
    if (!investorIban.trim()) {
      setError(t('errorFillAll'))
      return
    }
    setLoading(true)
    try {
      const { error } = await supabase
        .from('investors')
        .update({ iban: investorIban })
        .eq('id', investorId)
      if (error) throw error
      setStep(5)
    } catch (err: any) {
      setError(err.message || t('errorGeneric'))
    }
    setLoading(false)
  }
  const inputClass = "w-full rounded-xl px-4 py-3 text-sm text-white outline-none"
  const inputStyle = { backgroundColor: '#1E1B4B', border: '1px solid rgba(255,255,255,0.1)' }

  const STEPS = [
    { n: 1, label: t('steps.kyc') },
    { n: 2, label: t('steps.confirmation') },
    { n: 3, label: t('steps.signature') },
    { n: 4, label: t('steps.payment') },
    { n: 5, label: t('steps.done') },
  ]

  if (!accessChecked) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#13102B' }}>
        <p style={{ color: '#00FFFF' }}>{t('loading')}</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen font-sans" style={{ backgroundColor: '#13102B', color: 'white' }}>

      {/* Steps indicator — DESKTOP */}
      <div className="invest-stepper-desktop flex justify-center items-center gap-4 py-10">
        {STEPS.map(({ n, label }, i) => (
          <div key={n} className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                style={{
                  backgroundColor: step === n ? '#00FFFF' : step > n ? 'rgba(0,255,255,0.2)' : 'rgba(255,255,255,0.1)',
                  color: step === n ? '#13102B' : step > n ? '#00FFFF' : 'rgba(255,255,255,0.4)',
                }}>
                {step > n ? '✓' : n}
              </div>
              <span className="text-sm font-medium"
                style={{ color: step === n ? 'white' : 'rgba(255,255,255,0.3)' }}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="w-16 h-px" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
            )}
          </div>
        ))}
      </div>

      {/* Steps indicator — MOBILE */}
      <div className="invest-stepper-mobile">
        <div className="invest-stepper-mobile-header">
          <span className="invest-stepper-mobile-label">
            {STEPS[Math.min(step - 1, STEPS.length - 1)]?.label}
          </span>
          <span className="invest-stepper-mobile-count">
            {t('stepperOf', { current: step, total: STEPS.length })}
          </span>
        </div>
        <div className="invest-stepper-mobile-bar">
          <div
            className="invest-stepper-mobile-fill"
            style={{ width: `${(step / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="invest-main max-w-5xl mx-auto px-8 pb-16 grid grid-cols-3 gap-8">
        <div className="invest-content col-span-2 space-y-8">

          {/* ── STEP 1: COORDONNÉES ── */}
          {step === 1 && (
            <>
              <div>
                <h2 className="text-xl font-bold mb-4">{t('kyc.personalInfo')}</h2>
                <div className="invest-kyc-grid grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs mb-1 block" style={{ color: 'white' }}>{t('kyc.firstName')} *</label>
                    <input type="text" value={form.prenom} onChange={e => update('prenom', e.target.value)}
                      className={inputClass} style={inputStyle} />
                  </div>
                  <div>
                    <label className="text-xs mb-1 block" style={{ color: 'white' }}>{t('kyc.lastName')} *</label>
                    <input type="text" value={form.nom} onChange={e => update('nom', e.target.value)}
                      className={inputClass} style={inputStyle} />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs mb-1 block" style={{ color: 'white' }}>{t('kyc.email')} *</label>
                    <input type="email" value={form.email} onChange={e => update('email', e.target.value)}
                      className={inputClass} style={inputStyle} />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs mb-1 block" style={{ color: 'white' }}>{t('kyc.phone')} *</label>
                    <input type="tel" value={form.telephone} onChange={e => update('telephone', e.target.value)}
                      className={inputClass} style={inputStyle} />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs mb-1 block" style={{ color: 'white' }}>{t('kyc.address')} *</label>
                    <input type="text" value={form.adresse} onChange={e => update('adresse', e.target.value)}
                      className={inputClass} style={inputStyle} />
                  </div>
                </div>
              </div>

              {error && (
                <div className="rounded-xl px-4 py-3 text-sm" style={{ backgroundColor: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.3)', color: '#FF8080' }}>
                  {error}
                </div>
              )}

              <button onClick={handleSubmitKYC}
                disabled={loading}
                className="w-full py-4 rounded-xl font-bold text-sm transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#00FFFF', color: '#13102B', opacity: loading ? 0.7 : 1 }}>
                {loading ? t('processing') : t('kyc.submit')}
              </button>
            </>
          )}

          {/* ── STEP 2: CONFIRMATION ── */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">{t('confirmation.title')}</h2>
                <p className="text-sm" style={{ color: 'white' }}>
                  {t('confirmation.desc')}
                </p>
              </div>

              <div className="rounded-2xl p-6" style={{ backgroundColor: '#1E1B4B' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 className="font-bold text-sm" style={{ color: 'white', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {t('confirmation.contactTitle')}
                  </h3>
                  <button onClick={() => setStep(1)}
                    className="text-xs font-bold"
                    style={{ color: '#00FFFF', background: 'none', border: 'none', cursor: 'pointer' }}>
                    {t('confirmation.editContact')}
                  </button>
                </div>
                <div className="space-y-3 text-sm">
                  {[
                    { label: t('kyc.firstName'), value: form.prenom },
                    { label: t('kyc.lastName'), value: form.nom },
                    { label: t('kyc.email'), value: form.email },
                    { label: t('kyc.phone'), value: form.telephone },
                    { label: t('kyc.address'), value: form.adresse },
                  ].map((row, i) => (
                    <div key={i} className="flex justify-between items-center gap-4">
                      <span style={{ color: 'white' }}>{row.label}</span>
                      <span className="font-bold" style={{ color: 'white', textAlign: 'right' }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl p-6" style={{ backgroundColor: '#1E1B4B' }}>
                <h3 className="font-bold text-sm mb-4" style={{ color: 'white', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {t('confirmation.documentsTitle')}
                </h3>
                <div className="space-y-3">
                  {[
                    { icon: '📄', label: t('confirmation.doc1Label'), sublabel: t('confirmation.doc1Sublabel') },
                    { icon: '📋', label: t('confirmation.doc2Label'), sublabel: t('confirmation.doc2Sublabel') },
                    { icon: '📊', label: t('confirmation.doc3Label'), sublabel: t('confirmation.doc3Sublabel') },
                  ].map((doc, i) => (
                    <div key={i} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '14px 16px', borderRadius: '12px',
                      backgroundColor: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.06)',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '20px' }}>{doc.icon}</span>
                        <div>
                          <p style={{ fontSize: '13px', fontWeight: 600 }}>{doc.label}</p>
                          <p style={{ fontSize: '11px', color: 'white', marginTop: '2px' }}>{doc.sublabel}</p>
                        </div>
                      </div>
                      <span style={{
                        fontSize: '11px', padding: '4px 12px', borderRadius: '100px',
                        backgroundColor: 'rgba(255,200,0,0.1)',
                        border: '1px solid rgba(255,200,0,0.2)',
                        color: '#FFC800', fontWeight: 600,
                      }}>
                        {t('confirmation.comingSoon')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={handleConfirm}
                className="w-full py-4 rounded-xl font-bold text-sm transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#00FFFF', color: '#13102B' }}>
                {t('confirmation.confirmCta')}
              </button>
            </div>
          )}

          {/* ── STEP 3: SIGNATURE ── */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">{t('signature.title')}</h2>
                <p className="text-sm" style={{ color: 'white' }}>
                  {t('signature.desc')}
                </p>
              </div>

              {!signingUrl ? (
                <>
                  <div className="rounded-2xl p-6" style={{ backgroundColor: '#1E1B4B' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <h3 className="font-bold text-sm">{t('signature.contractTitle')}</h3>
                    </div>
                    <div style={{ fontSize: '13px', color: 'white' }}>
                      {t('signature.contractDoc')}{form.prenom}_{form.nom}.pdf
                    </div>
                  </div>

                  <label style={{
                    display: 'flex', alignItems: 'flex-start', gap: '12px',
                    padding: '16px', borderRadius: '12px',
                    backgroundColor: '#1E1B4B', cursor: 'pointer',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}>
                    <input type="checkbox" checked={contractSigned}
                      onChange={e => setContractSigned(e.target.checked)}
                      style={{ accentColor: '#00FFFF', marginTop: '3px' }} />
                    <span style={{ fontSize: '13px', color: 'white', lineHeight: '1.6' }}>
                      {t('signature.checkbox1')}{' '}
                      <strong style={{ color: 'white' }}>€{fmtInt(amount)}</strong>{' '}
                      {t('signature.checkbox2')}{' '}
                      <strong style={{ color: 'white' }}>Spring 2026 Fleet</strong>{' '}
                      {t('signature.checkbox3')}{' '}
                      <strong style={{ color: '#00FFFF' }}>8,5 %</strong>{' '}
                      {t('signature.checkbox4')}{' '}
                      <strong style={{ color: 'white' }}>48 {locale === 'fr' ? 'mois' : 'months'}</strong>{t('signature.checkbox5')}
                    </span>
                  </label>

                  {error && (
                    <div className="rounded-xl px-4 py-3 text-sm" style={{ backgroundColor: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.3)', color: '#FF8080' }}>
                      {error}
                    </div>
                  )}

                  <button onClick={handleStartSigning} disabled={!contractSigned || loading}
                    className="w-full py-4 rounded-xl font-bold text-sm transition-opacity"
                    style={{
                      backgroundColor: contractSigned ? '#00FFFF' : 'rgba(255,255,255,0.1)',
                      color: contractSigned ? '#13102B' : 'rgba(255,255,255,0.3)',
                      opacity: loading ? 0.7 : 1,
                      cursor: contractSigned ? 'pointer' : 'not-allowed',
                    }}>
                    {loading
                      ? t('processing')
                      : (locale === 'fr' ? 'Lancer la signature électronique' : 'Launch electronic signature')}
                  </button>
                </>
              ) : (
                <>
                  <div
                    ref={signingContainerRef}
                    id="docusign-signing-ceremony"
                    className="rounded-2xl overflow-hidden"
                    style={{ height: '85vh', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    {locale === 'fr'
                      ? 'Ne fermez pas cette fenêtre pendant la signature.'
                      : 'Please do not close this window during signing.'}
                  </p>
                </>
              )}
            </div>
          )}

          {/* ── STEP 4: PAYMENT ── */}
          {step === 4 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-2">{t('payment.title')}</h2>
                <p className="text-sm" style={{ color: 'white' }}>
                  {t('payment.desc')}
                </p>
              </div>
              <div className="rounded-2xl p-6 text-sm" style={{ backgroundColor: '#1E1B4B' }}>
                {[
                  { label: t('payment.beneficiary'), value: 'Pony Finance SA', key: 'beneficiary' },
                  { label: t('payment.iban'), value: 'FR76 XXXX XXXX XXXX XXXX', key: 'iban' },
                  { label: t('payment.bic'), value: 'XXXXXXXX', key: 'bic' },
                  { label: t('payment.reference'), value: `PONY-${investorId.slice(0, 8).toUpperCase()}`, key: 'ref', highlight: true },
                  { label: t('payment.amount'), value: `€${fmtInt(amount)}`, key: '' },
                ].map((row, i) => (
                  <div key={i}
                    style={{ display: 'grid', gridTemplateColumns: '1fr auto 28px', alignItems: 'center', columnGap: '12px', padding: '8px 0' }}>
                    <span style={{ color: 'white' }}>{row.label}</span>
                    <span className="font-bold font-mono" style={{ textAlign: 'right', color: (row as any).highlight ? '#00FFFF' : 'white' }}>{row.value}</span>
                    {row.key ? (
                      <button onClick={() => copyToClipboard(row.value, row.key)}
                        aria-label={t('payment.copy')}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: copied === row.key ? '#00FFFF' : 'rgba(255,255,255,0.5)' }}>
                        {copied === row.key ? (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                          </svg>
                        )}
                      </button>
                    ) : (
                      <span />
                    )}
                  </div>
                ))}
              </div>

              <div className="rounded-2xl p-4 text-sm"
                style={{ backgroundColor: 'rgba(255,200,0,0.08)', border: '1px solid rgba(255,200,0,0.25)', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <span style={{ flexShrink: 0, lineHeight: '1.5' }}>⚠️</span>
                <p style={{ color: '#FFC800', fontWeight: 600, lineHeight: '1.5' }}>
                  {t('payment.refWarning')}
                </p>
              </div>

              <div>
                <label className="text-xs mb-1 block" style={{ color: 'white' }}>{t('payment.yourIban')} *</label>
                <input type="text" value={investorIban} onChange={e => setInvestorIban(e.target.value)}
                  className={inputClass} style={inputStyle} placeholder="FR76 XXXX XXXX XXXX XXXX" />
                <p className="text-xs mt-1" style={{ color: 'white' }}>
                  {t('payment.yourIbanHelp')}
                </p>
              </div>

              <div className="rounded-2xl p-4 text-sm"
                style={{ backgroundColor: 'rgba(0,255,255,0.05)', border: '1px solid rgba(0,255,255,0.15)' }}>
                <p style={{ color: 'white' }}>
                  {t('payment.delayNotice1')}{' '}
                  <strong>{t('payment.delayNotice2')}</strong>{t('payment.delayNotice3')}
                </p>
              </div>

              {error && (
                <div className="rounded-xl px-4 py-3 text-sm" style={{ backgroundColor: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.3)', color: '#FF8080' }}>
                  {error}
                </div>
              )}

              <button onClick={handleTransferDone} disabled={loading}
                className="w-full py-4 rounded-xl font-bold text-sm transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#00FFFF', color: '#13102B', opacity: loading ? 0.7 : 1 }}>
                {loading ? t('processing') : t('payment.transferDone')}
              </button>
            </div>
          )}

          {/* ── STEP 5: DONE ── */}
          {step === 5 && (
            <div className="space-y-8 py-8">
              <div className="text-center space-y-4">
                <div className="text-7xl">🎉</div>
                <h2 className="text-3xl font-bold">{t('done.title')}</h2>
                <p className="text-sm max-w-md mx-auto leading-relaxed" style={{ color: 'white' }}>
                  {t('done.desc')}
                </p>
              </div>

              <div className="rounded-2xl p-6" style={{ backgroundColor: '#1E1B4B' }}>
                <h3 className="font-bold text-sm mb-4" style={{ color: 'white', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {t('done.recap')}
                </h3>
                <div className="space-y-3 text-sm">
                  {[
                    { label: t('done.amountInvested'), value: `€${fmtInt(amount)}` },
                    { label: t('done.campaign'), value: 'Spring 2026 Fleet' },
                    { label: t('done.rate'), value: t('confirmation.rateValue') },
                    { label: t('done.duration'), value: t('confirmation.durationValue') },
                  ].map((row, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <span style={{ color: 'white' }}>{row.label}</span>
                      <span className="font-bold" style={{ color: 'white' }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl p-6" style={{ backgroundColor: '#1E1B4B' }}>
                <h3 className="font-bold text-sm mb-4" style={{ color: 'white', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {t('done.nextSteps')}
                </h3>
                <div className="space-y-3">
                  {[t('done.step1'), t('done.step2'), t('done.step3')].map((stepText, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <div style={{
                        width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0,
                        backgroundColor: 'rgba(0,255,255,0.15)', color: '#00FFFF',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '12px', fontWeight: 700,
                      }}>
                        {i + 1}
                      </div>
                      <p style={{ fontSize: '13px', color: 'white', lineHeight: '1.6' }}>
                        {stepText}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <Link href="/"
                className="block w-full py-4 rounded-xl font-bold text-sm text-center"
                style={{ backgroundColor: '#00FFFF', color: '#13102B', textDecoration: 'none' }}>
                {t('done.backHome')}
              </Link>
            </div>
          )}

        </div>

        {/* ── SIDEBAR ── */}
        {step < 5 && (
          <div className="invest-sidebar col-span-1">
            <div className="invest-sidebar-card" style={{
              position: 'sticky', top: '90px',
              backgroundColor: '#1E1B4B', borderRadius: '20px',
              padding: '24px',
              border: '1px solid rgba(255,255,255,0.06)',
            }}>
              <h3 className="font-bold text-sm mb-4" style={{ color: 'white', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {t('sidebar.title')}
              </h3>
              <div className="space-y-3 text-sm mb-4">
                {[
                  { label: t('sidebar.amount'), value: `€${fmtInt(amount)}`, highlight: true },
                  { label: t('sidebar.rate'), value: t('sidebar.rateValue') },
                  { label: t('sidebar.duration'), value: t('sidebar.durationValue') },
                  { label: t('sidebar.gracePeriod'), value: t('sidebar.gracePeriodValue') },
                  { label: t('sidebar.monthlyGrace'), value: '€0,00' },
                  { label: t('sidebar.monthlyPayback'), value: `€${fmtDec(monthlyPayment)}` },
                  { label: t('sidebar.totalInterest'), value: `€${fmtDec(totalInterest)}` },
                ].map((row, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span style={{ color: 'white' }}>{row.label}</span>
                    <span className="font-bold" style={{ color: row.highlight ? '#00FFFF' : 'white' }}>{row.value}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs" style={{ color: 'white', lineHeight: '1.6' }}>
                {t('sidebar.secure')}
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

export default function Investir() {
  const t = useTranslations('investir')
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#13102B' }}>
        <p style={{ color: '#00FFFF' }}>{t('loading')}</p>
      </main>
    }>
      <InvestirForm />
    </Suspense>
  )
}