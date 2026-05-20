'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { supabase } from '@/lib/supabase'
import { Link } from '@/i18n/navigation'

// ── Product terms ──
const ANNUAL_RATE = 0.085
const MONTHLY_RATE = ANNUAL_RATE / 12
const GRACE_MONTHS = 12
const PAYBACK_MONTHS = 36
const TOTAL_MONTHS = 48

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
  const searchParams = useSearchParams()
  const campaignId = searchParams.get('campaignId')
  const amount = Number(searchParams.get('amount')) || 5000

  const { monthlyPayment, totalInterest, totalRepaid } = calcReturns(amount)

  const numberLocale = locale === 'fr' ? 'fr-FR' : 'en-GB'
  const fmtInt = (n: number) => new Intl.NumberFormat(numberLocale, { maximumFractionDigits: 0 }).format(n)
  const fmtDec = (n: number) => new Intl.NumberFormat(numberLocale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)

  const sortedCountries = [...COUNTRIES].sort((a, b) =>
    a.code === 'OTHER' ? 1 : b.code === 'OTHER' ? -1 : (locale === 'fr' ? a.fr.localeCompare(b.fr, 'fr') : a.en.localeCompare(b.en, 'en'))
  )

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)
  const [error, setError] = useState('')
  const [investorId, setInvestorId] = useState('')
  const [existingKycStatus, setExistingKycStatus] = useState<string | null>(null)
  const [contractSigned, setContractSigned] = useState(false)
  const [showDashboardModal, setShowDashboardModal] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)

  const [form, setForm] = useState({
    type: 'individual',
    prenom: '',
    nom: '',
    email: '',
    lieuNaissance: '',
    dateNaissance: '',
    nationalite: '',
    telephone: '',
    residenceFiscale: 'france',
    iban: '',
    adresse: '',
    profession: '',
    pep: 'no',
    revenus: '',
    documentType: 'passport',
    documentNumero: '',
  })

  const update = (field: string, value: string | boolean) =>
    setForm(prev => ({ ...prev, [field]: value }))

  useEffect(() => {
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        setLoggedIn(false)
        setCheckingSession(false)
        return
      }

      setLoggedIn(true)

      const { data: investor } = await supabase
        .from('investors')
        .select('*')
        .eq('email', session.user.email)
        .single()

      if (investor) {
        setInvestorId(investor.id)
        setExistingKycStatus(investor.kyc_status)
        setForm(prev => ({
          ...prev,
          prenom: investor.prenom || '',
          nom: investor.nom || '',
          email: investor.email || '',
          telephone: investor.telephone || '',
          adresse: investor.adresse || '',
          profession: investor.profession || '',
          iban: investor.iban || '',
          nationalite: investor.nationalite || '',
          documentType: investor.document_type || 'passport',
          documentNumero: investor.document_numero || '',
        }))

        if (investor.kyc_status === 'Validé') {
          setStep(2)
        }
      } else {
        setForm(prev => ({ ...prev, email: session.user.email || '' }))
      }

      setCheckingSession(false)
    }
    checkSession()
  }, [])

  async function handleSubmitKYC() {
    setError('')
    if (!form.prenom || !form.nom || !form.email || !form.telephone ||
        !form.dateNaissance || !form.lieuNaissance || !form.nationalite ||
        !form.adresse || !form.profession || !form.revenus ||
        !form.documentNumero || !form.iban) {
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
          date_naissance: form.dateNaissance,
          lieu_naissance: form.lieuNaissance,
          nationalite: form.nationalite,
          residence_fiscale: form.residenceFiscale,
          adresse: form.adresse,
          profession: form.profession,
          revenus: form.revenus,
          pep: form.pep,
          document_type: form.documentType,
          document_numero: form.documentNumero,
          iban: form.iban,
          kyc_status: 'Validé',
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

  async function handleSignContract() {
    if (!contractSigned) {
      setError(t('errorReadContract'))
      return
    }
    setError('')
    setLoading(true)
    try {
      await supabase.from('investments').insert({
        investor_id: investorId,
        campaign_id: campaignId,
        montant: amount,
        statut: 'En attente',
      })
      setStep(4)
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

  if (checkingSession) return (
    <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#13102B' }}>
      <p style={{ color: '#00FFFF' }}>{t('loading')}</p>
    </main>
  )

  if (existingKycStatus === 'Rejeté' && step === 1) return (
    <main className="min-h-screen font-sans flex items-center justify-center"
      style={{ backgroundColor: '#13102B', color: 'white' }}>
      <div className="text-center max-w-md px-8 space-y-6">
        <div className="text-6xl">❌</div>
        <h2 className="text-2xl font-bold">{t('kycRejectedTitle')}</h2>
        <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
          {t('kycRejectedDesc')}{' '}
          <span style={{ color: '#00FFFF' }}>support@ridepony.com</span>.
        </p>
        <Link href="/" style={{ fontSize: '13px', color: '#00FFFF', textDecoration: 'none' }}>
          {t('backToHome')}
        </Link>
      </div>
    </main>
  )

  if (existingKycStatus === 'En attente' && step === 1) return (
    <main className="min-h-screen font-sans flex items-center justify-center"
      style={{ backgroundColor: '#13102B', color: 'white' }}>
      <div className="text-center max-w-md px-8 space-y-6">
        <div className="text-6xl">⏳</div>
        <h2 className="text-2xl font-bold">{t('kycPendingTitle')}</h2>
        <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
          {t('kycPendingDesc')}
        </p>
        <Link href="/" style={{ fontSize: '13px', color: '#00FFFF', textDecoration: 'none' }}>
          {t('backToHome')}
        </Link>
      </div>
    </main>
  )

  return (
    <main className="min-h-screen font-sans" style={{ backgroundColor: '#13102B', color: 'white' }}>

      {/* Login modal */}
      {showDashboardModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          backgroundColor: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px',
        }}>
          <div style={{
            backgroundColor: '#1E1B4B',
            borderRadius: '20px', padding: '32px',
            maxWidth: '380px', width: '100%',
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px' }}>{t('loginPrompt.title')}</h3>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', marginBottom: '24px', lineHeight: '1.5' }}>
              {t('loginPrompt.desc')}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link href="/login?redirect=/dashboard"
                style={{
                  display: 'block', textAlign: 'center',
                  backgroundColor: '#00FFFF', color: '#13102B',
                  padding: '14px', borderRadius: '12px',
                  fontSize: '14px', fontWeight: 800, textDecoration: 'none',
                }}>
                {t('loginPrompt.login')}
              </Link>
              <Link href="/signup?redirect=/dashboard"
                style={{
                  display: 'block', textAlign: 'center',
                  backgroundColor: 'transparent', color: 'rgba(255,255,255,0.75)',
                  padding: '14px', borderRadius: '12px',
                  fontSize: '14px', fontWeight: 600, textDecoration: 'none',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}>
                {t('loginPrompt.signup')}
              </Link>
              <button onClick={() => setShowDashboardModal(false)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: '13px', color: 'rgba(255,255,255,0.3)', marginTop: '8px',
                }}>
                {t('loginPrompt.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Steps indicator */}
      <div className="flex justify-center items-center gap-4 py-10">
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

      <div className="max-w-5xl mx-auto px-8 pb-16 grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-8">

          {/* ── STEP 1: KYC ── */}
          {step === 1 && (
            <>
              {existingKycStatus === 'Validé' && (
                <div className="rounded-xl px-4 py-3 text-sm" style={{ backgroundColor: 'rgba(0,255,255,0.08)', border: '1px solid rgba(0,255,255,0.2)', color: '#00FFFF' }}>
                  👋 {t('welcomeBack')}
                </div>
              )}

              <div>
                <h2 className="text-xl font-bold mb-4">{t('kyc.accountType')}</h2>
                <select value={form.type} onChange={e => update('type', e.target.value)}
                  className={inputClass} style={inputStyle}>
                  <option value="individual">{t('kyc.individual')}</option>
                  <option value="company">{t('kyc.company')}</option>
                </select>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4">{t('kyc.personalInfo')}</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs mb-1 block" style={{ color: 'rgba(255,255,255,0.5)' }}>{t('kyc.firstName')} *</label>
                    <input type="text" value={form.prenom} onChange={e => update('prenom', e.target.value)}
                      className={inputClass} style={inputStyle} />
                  </div>
                  <div>
                    <label className="text-xs mb-1 block" style={{ color: 'rgba(255,255,255,0.5)' }}>{t('kyc.lastName')} *</label>
                    <input type="text" value={form.nom} onChange={e => update('nom', e.target.value)}
                      className={inputClass} style={inputStyle} />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs mb-1 block" style={{ color: 'rgba(255,255,255,0.5)' }}>{t('kyc.email')} *</label>
                    <input type="email" value={form.email} onChange={e => update('email', e.target.value)}
                      className={inputClass} style={inputStyle} />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs mb-1 block" style={{ color: 'rgba(255,255,255,0.5)' }}>{t('kyc.phone')} *</label>
                    <input type="tel" value={form.telephone} onChange={e => update('telephone', e.target.value)}
                      className={inputClass} style={inputStyle} />
                  </div>
                  <div>
                    <label className="text-xs mb-1 block" style={{ color: 'rgba(255,255,255,0.5)' }}>{t('kyc.dateOfBirth')} *</label>
                    <input type="date" value={form.dateNaissance} onChange={e => update('dateNaissance', e.target.value)}
                      className={inputClass} style={inputStyle} />
                  </div>
                  <div>
                    <label className="text-xs mb-1 block" style={{ color: 'rgba(255,255,255,0.5)' }}>{t('kyc.placeOfBirth')} *</label>
                    <input type="text" value={form.lieuNaissance} onChange={e => update('lieuNaissance', e.target.value)}
                      className={inputClass} style={inputStyle} />
                  </div>
                  <div>
                    <label className="text-xs mb-1 block" style={{ color: 'rgba(255,255,255,0.5)' }}>{t('kyc.nationality')} *</label>
                    <select value={form.nationalite} onChange={e => update('nationalite', e.target.value)}
                      className={inputClass} style={inputStyle}>
                      <option value="">{t('kyc.selectCountry')}</option>
                      {sortedCountries.map(c => (
                        <option key={c.code} value={c.code}>
                          {locale === 'fr' ? c.fr : c.en}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs mb-1 block" style={{ color: 'rgba(255,255,255,0.5)' }}>{t('kyc.taxResidence')} *</label>
                    <select value={form.residenceFiscale} onChange={e => update('residenceFiscale', e.target.value)}
                      className={inputClass} style={inputStyle}>
                      {sortedCountries.filter(c => c.code !== 'OTHER').map(c => (
                        <option key={c.code} value={c.code.toLowerCase()}>
                          {locale === 'fr' ? c.fr : c.en}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs mb-1 block" style={{ color: 'rgba(255,255,255,0.5)' }}>{t('kyc.address')} *</label>
                    <input type="text" value={form.adresse} onChange={e => update('adresse', e.target.value)}
                      className={inputClass} style={inputStyle} />
                  </div>
                  <div>
                    <label className="text-xs mb-1 block" style={{ color: 'rgba(255,255,255,0.5)' }}>{t('kyc.profession')} *</label>
                    <input type="text" value={form.profession} onChange={e => update('profession', e.target.value)}
                      className={inputClass} style={inputStyle} />
                  </div>
                  <div>
                    <label className="text-xs mb-1 block" style={{ color: 'rgba(255,255,255,0.5)' }}>{t('kyc.annualIncome')} *</label>
                    <select value={form.revenus} onChange={e => update('revenus', e.target.value)}
                      className={inputClass} style={inputStyle}>
                      <option value="">{t('kyc.incomePlaceholder')}</option>
                      <option value="1">{t('kyc.income1')}</option>
                      <option value="2">{t('kyc.income2')}</option>
                      <option value="3">{t('kyc.income3')}</option>
                      <option value="4">{t('kyc.income4')}</option>
                      <option value="5">{t('kyc.income5')}</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-2">{t('kyc.pepTitle')}</h2>
                <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  {t('kyc.pepDesc')}
                </p>
                <div className="flex gap-3">
                  <label className="flex-1 cursor-pointer">
                    <input type="radio" name="pep" value="yes" checked={form.pep === 'yes'}
                      onChange={e => update('pep', e.target.value)} className="hidden" />
                    <div className="rounded-xl px-4 py-3 text-sm text-center"
                      style={{
                        backgroundColor: form.pep === 'yes' ? 'rgba(0,255,255,0.1)' : '#1E1B4B',
                        border: form.pep === 'yes' ? '1px solid #00FFFF' : '1px solid rgba(255,255,255,0.1)',
                        color: form.pep === 'yes' ? '#00FFFF' : 'rgba(255,255,255,0.7)',
                      }}>
                      {t('kyc.pepYes')}
                    </div>
                  </label>
                  <label className="flex-1 cursor-pointer">
                    <input type="radio" name="pep" value="no" checked={form.pep === 'no'}
                      onChange={e => update('pep', e.target.value)} className="hidden" />
                    <div className="rounded-xl px-4 py-3 text-sm text-center"
                      style={{
                        backgroundColor: form.pep === 'no' ? 'rgba(0,255,255,0.1)' : '#1E1B4B',
                        border: form.pep === 'no' ? '1px solid #00FFFF' : '1px solid rgba(255,255,255,0.1)',
                        color: form.pep === 'no' ? '#00FFFF' : 'rgba(255,255,255,0.7)',
                      }}>
                      {t('kyc.pepNo')}
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4">{t('kyc.documents')}</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs mb-1 block" style={{ color: 'rgba(255,255,255,0.5)' }}>{t('kyc.documentType')} *</label>
                    <select value={form.documentType} onChange={e => update('documentType', e.target.value)}
                      className={inputClass} style={inputStyle}>
                      <option value="passport">{t('kyc.passport')}</option>
                      <option value="idCard">{t('kyc.idCard')}</option>
                      <option value="drivingLicence">{t('kyc.drivingLicence')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs mb-1 block" style={{ color: 'rgba(255,255,255,0.5)' }}>{t('kyc.documentNumber')} *</label>
                    <input type="text" value={form.documentNumero} onChange={e => update('documentNumero', e.target.value)}
                      className={inputClass} style={inputStyle} />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs mb-1 block" style={{ color: 'rgba(255,255,255,0.5)' }}>{t('kyc.iban')} *</label>
                    <input type="text" value={form.iban} onChange={e => update('iban', e.target.value)}
                      className={inputClass} style={inputStyle} placeholder="FR76 XXXX XXXX XXXX XXXX" />
                    <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>
                      {t('kyc.ibanHelp')}
                    </p>
                  </div>
                </div>
              </div>

              {error && (
                <div className="rounded-xl px-4 py-3 text-sm" style={{ backgroundColor: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.3)', color: '#FF8080' }}>
                  {error}
                </div>
              )}

              <button onClick={loggedIn ? handleSubmitKYC : () => setShowDashboardModal(true)}
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
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  {t('confirmation.desc')}
                </p>
              </div>

              <div className="rounded-2xl p-6" style={{ backgroundColor: '#1E1B4B' }}>
                <h3 className="font-bold text-sm mb-4" style={{ color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {t('confirmation.summaryTitle')}
                </h3>
                <div className="space-y-3 text-sm">
                  {[
                    { label: t('confirmation.amount'), value: `€${fmtInt(amount)}`, highlight: true },
                    { label: t('confirmation.rate'), value: t('confirmation.rateValue') },
                    { label: t('confirmation.duration'), value: t('confirmation.durationValue') },
                    { label: t('confirmation.gracePeriod'), value: t('confirmation.gracePeriodValue') },
                    { label: t('confirmation.monthlyGrace'), value: '€0,00' },
                    { label: t('confirmation.monthlyPayback'), value: `€${fmtDec(monthlyPayment)}` },
                    { label: t('confirmation.totalInterest'), value: `€${fmtDec(totalInterest)}` },
                    { label: t('confirmation.totalRepaid'), value: `€${fmtDec(totalRepaid)}` },
                  ].map((row, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <span style={{ color: 'rgba(255,255,255,0.5)' }}>{row.label}</span>
                      <span className="font-bold" style={{ color: row.highlight ? '#00FFFF' : 'white' }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl p-6" style={{ backgroundColor: '#1E1B4B' }}>
                <h3 className="font-bold text-sm mb-4" style={{ color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px' }}>
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
                          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>{doc.sublabel}</p>
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
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  {t('signature.desc')}
                </p>
              </div>

              <div className="rounded-2xl p-6" style={{ backgroundColor: '#1E1B4B' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 className="font-bold text-sm">{t('signature.contractTitle')}</h3>
                  <span style={{
                    fontSize: '11px', padding: '4px 12px', borderRadius: '100px',
                    backgroundColor: 'rgba(255,200,0,0.1)',
                    border: '1px solid rgba(255,200,0,0.2)',
                    color: '#FFC800', fontWeight: 600,
                  }}>
                    {t('signature.contractSoon')}
                  </span>
                </div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>
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
                <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6' }}>
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

              <button onClick={handleSignContract} disabled={!contractSigned || loading}
                className="w-full py-4 rounded-xl font-bold text-sm transition-opacity"
                style={{
                  backgroundColor: contractSigned ? '#00FFFF' : 'rgba(255,255,255,0.1)',
                  color: contractSigned ? '#13102B' : 'rgba(255,255,255,0.3)',
                  opacity: loading ? 0.7 : 1,
                  cursor: contractSigned ? 'pointer' : 'not-allowed',
                }}>
                {loading ? t('processing') : t('signature.sign')}
              </button>
            </div>
          )}

          {/* ── STEP 4: PAYMENT ── */}
          {step === 4 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-2">{t('payment.title')}</h2>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  {t('payment.desc')}
                </p>
              </div>
              <div className="rounded-2xl p-6 space-y-4 text-sm" style={{ backgroundColor: '#1E1B4B' }}>
                {[
                  { label: t('payment.beneficiary'), value: 'Pony Finance SA' },
                  { label: t('payment.iban'), value: 'FR76 XXXX XXXX XXXX XXXX' },
                  { label: t('payment.bic'), value: 'XXXXXXXX' },
                  { label: t('payment.reference'), value: `PONY-${investorId.slice(0, 8).toUpperCase()}` },
                  { label: t('payment.amount'), value: `€${fmtInt(amount)}` },
                ].map((row, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span style={{ color: 'rgba(255,255,255,0.4)' }}>{row.label}</span>
                    <span className="font-bold font-mono">{row.value}</span>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl p-4 text-sm"
                style={{ backgroundColor: 'rgba(0,255,255,0.05)', border: '1px solid rgba(0,255,255,0.15)' }}>
                <p style={{ color: 'rgba(255,255,255,0.6)' }}>
                  {t('payment.delayNotice1')}{' '}
                  <strong>{t('payment.delayNotice2')}</strong>{t('payment.delayNotice3')}
                </p>
              </div>
              <button onClick={() => setStep(5)}
                className="w-full py-4 rounded-xl font-bold text-sm transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#00FFFF', color: '#13102B' }}>
                {t('payment.transferDone')}
              </button>
            </div>
          )}

          {/* ── STEP 5: DONE ── */}
          {step === 5 && (
            <div className="space-y-8 py-8">
              <div className="text-center space-y-4">
                <div className="text-7xl">🎉</div>
                <h2 className="text-3xl font-bold">{t('done.title')}</h2>
                <p className="text-sm max-w-md mx-auto leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  {t('done.desc')}
                </p>
              </div>

              <div className="rounded-2xl p-6" style={{ backgroundColor: '#1E1B4B' }}>
                <h3 className="font-bold text-sm mb-4" style={{ color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px' }}>
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
                      <span style={{ color: 'rgba(255,255,255,0.5)' }}>{row.label}</span>
                      <span className="font-bold" style={{ color: 'white' }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl p-6" style={{ backgroundColor: '#1E1B4B' }}>
                <h3 className="font-bold text-sm mb-4" style={{ color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {t('done.nextSteps')}
                </h3>
                <div className="space-y-3">
                  {[t('done.step1'), t('done.step2'), t('done.step3')].map((step, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <div style={{
                        width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0,
                        backgroundColor: 'rgba(0,255,255,0.15)', color: '#00FFFF',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '12px', fontWeight: 700,
                      }}>
                        {i + 1}
                      </div>
                      <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6' }}>
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Link href="/dashboard"
                  className="w-full py-4 rounded-xl font-bold text-sm text-center"
                  style={{ backgroundColor: '#00FFFF', color: '#13102B', textDecoration: 'none' }}>
                  {t('done.toDashboard')}
                </Link>
                <Link href="/"
                  className="w-full py-3 rounded-xl text-sm text-center"
                  style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>
                  {t('done.backHome')}
                </Link>
              </div>
            </div>
          )}

        </div>

        {/* ── SIDEBAR ── */}
        {step < 5 && (
          <div className="col-span-1">
            <div style={{
              position: 'sticky', top: '90px',
              backgroundColor: '#1E1B4B', borderRadius: '20px',
              padding: '24px',
              border: '1px solid rgba(255,255,255,0.06)',
            }}>
              <h3 className="font-bold text-sm mb-4" style={{ color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px' }}>
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
                    <span style={{ color: 'rgba(255,255,255,0.5)' }}>{row.label}</span>
                    <span className="font-bold" style={{ color: row.highlight ? '#00FFFF' : 'white' }}>{row.value}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)', lineHeight: '1.6' }}>
                {t('sidebar.secure')}
              </p>

              {loggedIn ? (
                <Link href="/dashboard" style={{
                  display: 'block', width: '100%', marginTop: '24px', textAlign: 'center',
                  backgroundColor: 'transparent', color: '#00FFFF',
                  padding: '12px', borderRadius: '10px',
                  fontSize: '13px', fontWeight: 700,
                  border: '1px solid rgba(0,255,255,0.3)',
                  textDecoration: 'none',
                }}>
                  {t('loginPrompt.myDashboard')}
                </Link>
              ) : (
                <button onClick={() => setShowDashboardModal(true)} style={{
                  width: '100%', marginTop: '24px',
                  backgroundColor: 'transparent', color: '#00FFFF',
                  padding: '12px', borderRadius: '10px',
                  fontSize: '13px', fontWeight: 700,
                  border: '1px solid rgba(0,255,255,0.3)',
                  cursor: 'pointer',
                }}>
                  {t('loginPrompt.myDashboard')}
                </button>
              )}
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