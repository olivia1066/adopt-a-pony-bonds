'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const ANNUAL_RATE = 0.095
const TOTAL_MONTHS = 36
const GRACE_MONTHS = 6
const REPAYMENT_MONTHS = TOTAL_MONTHS - GRACE_MONTHS
const MONTHLY_RATE = ANNUAL_RATE / 12

function calcReturns(amount: number) {
  const monthlyGrace = amount * MONTHLY_RATE
  const monthlyRepayment =
    amount *
    (MONTHLY_RATE * Math.pow(1 + MONTHLY_RATE, REPAYMENT_MONTHS)) /
    (Math.pow(1 + MONTHLY_RATE, REPAYMENT_MONTHS) - 1)
  const totalInterest =
    monthlyGrace * GRACE_MONTHS +
    monthlyRepayment * REPAYMENT_MONTHS -
    amount
  const totalRepaid = amount + totalInterest
  return { monthlyGrace, monthlyRepayment, totalInterest, totalRepaid }
}

function InvestirForm() {
  const searchParams = useSearchParams()
  const campaignId = searchParams.get('campaignId')
  const amount = Number(searchParams.get('amount')) || 5000

  const { monthlyGrace, monthlyRepayment, totalInterest, totalRepaid } = calcReturns(amount)

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)
  const [error, setError] = useState('')
  const [investorId, setInvestorId] = useState('')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
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
    langue: 'english',
    residenceFiscale: 'france',
    regimeFiscal: false,
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
      setError('Please fill in all required fields.')
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
      setError(err.message || 'An error occurred.')
    }
    setLoading(false)
  }

  async function handleConfirm() {
    setStep(3)
  }

  async function handleSignContract() {
    if (!contractSigned) {
      setError('Please confirm that you have read and agree to the contract.')
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
      setError(err.message || 'An error occurred.')
    }
    setLoading(false)
  }

  const inputClass = "w-full rounded-xl px-4 py-3 text-sm text-white outline-none"
  const inputStyle = { backgroundColor: '#1E1B4B', border: '1px solid rgba(255,255,255,0.1)' }

  const STEPS = [
    { n: 1, label: 'KYC' },
    { n: 2, label: 'Confirmation' },
    { n: 3, label: 'Signature' },
    { n: 4, label: 'Payment' },
    { n: 5, label: 'Done' },
  ]

  if (checkingSession) return (
    <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#13102B' }}>
      <p style={{ color: '#00FFFF' }}>Loading...</p>
    </main>
  )

  if (existingKycStatus === 'Rejeté' && step === 1) return (
    <main className="min-h-screen font-sans flex items-center justify-center"
      style={{ backgroundColor: '#13102B', color: 'white' }}>
      <div className="text-center max-w-md px-8 space-y-6">
        <div className="text-6xl">❌</div>
        <h2 className="text-2xl font-bold">KYC rejected</h2>
        <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Your identity verification was rejected. Please contact us at{' '}
          <span style={{ color: '#00FFFF' }}>support@ridepony.com</span>.
        </p>
        <Link href="/"
          className="inline-block px-8 py-4 rounded-xl text-sm font-bold"
          style={{ backgroundColor: '#00FFFF', color: '#13102B', textDecoration: 'none' }}>
          Back to home
        </Link>
      </div>
    </main>
  )

  return (
    <main className="min-h-screen font-sans" style={{ backgroundColor: '#13102B', color: 'white' }}>

      {/* ── DASHBOARD MODAL ── */}
      {showDashboardModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          backgroundColor: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
          onClick={() => setShowDashboardModal(false)}
        >
          <div style={{
            borderRadius: '24px', padding: '40px',
            backgroundColor: '#1E1B4B',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
            width: '100%', maxWidth: '400px',
            textAlign: 'center',
          }}
            onClick={e => e.stopPropagation()}
          >
            <img src="/Logo.png" alt="Pony" style={{ height: '30px', margin: '0 auto 24px' }} />
            <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '8px' }}>
              Access your dashboard
            </h2>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', marginBottom: '32px', lineHeight: '1.6' }}>
              Log in to your existing account or create a new one to track your investments.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link href="/login?redirect=/dashboard"
                style={{
                  display: 'block', textAlign: 'center',
                  backgroundColor: '#00FFFF', color: '#13102B',
                  padding: '14px', borderRadius: '12px',
                  fontSize: '14px', fontWeight: 800, textDecoration: 'none',
                }}>
                Log in →
              </Link>
              <Link href="/signup?redirect=/dashboard"
                style={{
                  display: 'block', textAlign: 'center',
                  backgroundColor: 'transparent', color: 'rgba(255,255,255,0.75)',
                  padding: '14px', borderRadius: '12px',
                  fontSize: '14px', fontWeight: 600, textDecoration: 'none',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}>
                Create an account
              </Link>
              <button onClick={() => setShowDashboardModal(false)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: '13px', color: 'rgba(255,255,255,0.3)', marginTop: '8px',
                }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Steps */}
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
              <div>
                <h2 className="text-xl font-bold mb-4">Account type</h2>
                <select value={form.type} onChange={e => update('type', e.target.value)}
                  className={inputClass} style={inputStyle}>
                  <option value="individual">Individual (natural person)</option>
                  <option value="company">Company (legal entity)</option>
                </select>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4">Personal information</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs mb-1 block" style={{ color: 'rgba(255,255,255,0.5)' }}>First name *</label>
                    <input type="text" value={form.prenom} onChange={e => update('prenom', e.target.value)}
                      className={inputClass} style={inputStyle} />
                  </div>
                  <div>
                    <label className="text-xs mb-1 block" style={{ color: 'rgba(255,255,255,0.5)' }}>Last name *</label>
                    <input type="text" value={form.nom} onChange={e => update('nom', e.target.value)}
                      className={inputClass} style={inputStyle} />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs mb-1 block" style={{ color: 'rgba(255,255,255,0.5)' }}>Email *</label>
                    <input type="email" value={form.email} onChange={e => update('email', e.target.value)}
                      className={inputClass} style={inputStyle} />
                  </div>
                  <div>
                    <label className="text-xs mb-1 block" style={{ color: 'rgba(255,255,255,0.5)' }}>Place of birth *</label>
                    <input type="text" value={form.lieuNaissance} onChange={e => update('lieuNaissance', e.target.value)}
                      className={inputClass} style={inputStyle} />
                  </div>
                  <div>
                    <label className="text-xs mb-1 block" style={{ color: 'rgba(255,255,255,0.5)' }}>Date of birth *</label>
                    <input type="date" value={form.dateNaissance} onChange={e => update('dateNaissance', e.target.value)}
                      className={inputClass} style={inputStyle} />
                  </div>
                  <div>
                    <label className="text-xs mb-1 block" style={{ color: 'rgba(255,255,255,0.5)' }}>Nationality *</label>
                    <select value={form.nationalite} onChange={e => update('nationalite', e.target.value)}
                      className={inputClass} style={inputStyle}>
                      <option value="">Please select</option>
                      {[
                        ['Afghanistan','Afghanistan'],['Albanie','Albania'],['Algérie','Algeria'],
                        ['Allemagne','Germany'],['Andorre','Andorra'],['Angola','Angola'],
                        ['Arabie Saoudite','Saudi Arabia'],['Argentine','Argentina'],['Arménie','Armenia'],
                        ['Australie','Australia'],['Autriche','Austria'],['Azerbaïdjan','Azerbaijan'],
                        ['Bahreïn','Bahrain'],['Bangladesh','Bangladesh'],['Belgique','Belgium'],
                        ['Bénin','Benin'],['Bolivie','Bolivia'],['Bosnie-Herzégovine','Bosnia-Herzegovina'],
                        ['Botswana','Botswana'],['Brésil','Brazil'],['Bulgarie','Bulgaria'],
                        ['Burkina Faso','Burkina Faso'],['Burundi','Burundi'],['Cambodge','Cambodia'],
                        ['Cameroun','Cameroon'],['Canada','Canada'],['Chili','Chile'],['Chine','China'],
                        ['Chypre','Cyprus'],['Colombie','Colombia'],['Congo','Congo'],
                        ['Corée du Sud','South Korea'],['Costa Rica','Costa Rica'],
                        ["Côte d'Ivoire","Ivory Coast"],['Croatie','Croatia'],['Cuba','Cuba'],
                        ['Danemark','Denmark'],['Égypte','Egypt'],['Émirats Arabes Unis','UAE'],
                        ['Équateur','Ecuador'],['Espagne','Spain'],['Estonie','Estonia'],
                        ['Éthiopie','Ethiopia'],['Finlande','Finland'],['France','France'],
                        ['Gabon','Gabon'],['Ghana','Ghana'],['Grèce','Greece'],['Guatemala','Guatemala'],
                        ['Guinée','Guinea'],['Haïti','Haiti'],['Honduras','Honduras'],
                        ['Hongrie','Hungary'],['Inde','India'],['Indonésie','Indonesia'],
                        ['Iran','Iran'],['Irak','Iraq'],['Irlande','Ireland'],['Islande','Iceland'],
                        ['Israël','Israel'],['Italie','Italy'],['Jamaïque','Jamaica'],['Japon','Japan'],
                        ['Jordanie','Jordan'],['Kazakhstan','Kazakhstan'],['Kenya','Kenya'],
                        ['Koweït','Kuwait'],['Laos','Laos'],['Lettonie','Latvia'],['Liban','Lebanon'],
                        ['Libye','Libya'],['Liechtenstein','Liechtenstein'],['Lituanie','Lithuania'],
                        ['Luxembourg','Luxembourg'],['Macédoine','North Macedonia'],
                        ['Madagascar','Madagascar'],['Malaisie','Malaysia'],['Mali','Mali'],
                        ['Malte','Malta'],['Maroc','Morocco'],['Maurice','Mauritius'],
                        ['Mauritanie','Mauritania'],['Mexique','Mexico'],['Moldavie','Moldova'],
                        ['Monaco','Monaco'],['Mongolie','Mongolia'],['Monténégro','Montenegro'],
                        ['Mozambique','Mozambique'],['Namibie','Namibia'],['Népal','Nepal'],
                        ['Nicaragua','Nicaragua'],['Niger','Niger'],['Nigéria','Nigeria'],
                        ['Norvège','Norway'],['Nouvelle-Zélande','New Zealand'],['Oman','Oman'],
                        ['Ouganda','Uganda'],['Ouzbékistan','Uzbekistan'],['Pakistan','Pakistan'],
                        ['Panama','Panama'],['Paraguay','Paraguay'],['Pays-Bas','Netherlands'],
                        ['Pérou','Peru'],['Philippines','Philippines'],['Pologne','Poland'],
                        ['Portugal','Portugal'],['Qatar','Qatar'],['Roumanie','Romania'],
                        ['Royaume-Uni','United Kingdom'],['Russie','Russia'],['Rwanda','Rwanda'],
                        ['Sénégal','Senegal'],['Serbie','Serbia'],['Singapour','Singapore'],
                        ['Slovaquie','Slovakia'],['Slovénie','Slovenia'],['Somalie','Somalia'],
                        ['Soudan','Sudan'],['Sri Lanka','Sri Lanka'],['Suède','Sweden'],
                        ['Suisse','Switzerland'],['Syrie','Syria'],['Taïwan','Taiwan'],
                        ['Tanzanie','Tanzania'],['Tchad','Chad'],['Thaïlande','Thailand'],
                        ['Togo','Togo'],['Tunisie','Tunisia'],['Turquie','Turkey'],
                        ['Ukraine','Ukraine'],['États-Unis','United States'],['Uruguay','Uruguay'],
                        ['Venezuela','Venezuela'],['Vietnam','Vietnam'],['Yémen','Yemen'],
                        ['Zambie','Zambia'],['Zimbabwe','Zimbabwe'],['Autre','Other'],
                      ].map(([val, label]) => (
                        <option key={val} value={val}>{label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs mb-1 block" style={{ color: 'rgba(255,255,255,0.5)' }}>Phone number *</label>
                    <input type="tel" value={form.telephone} onChange={e => update('telephone', e.target.value)}
                      className={inputClass} style={inputStyle} />
                  </div>
                  <div>
                    <label className="text-xs mb-1 block" style={{ color: 'rgba(255,255,255,0.5)' }}>Preferred language</label>
                    <select value={form.langue} onChange={e => update('langue', e.target.value)}
                      className={inputClass} style={inputStyle}>
                      <option value="english">English</option>
                      <option value="french">French</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs mb-1 block" style={{ color: 'rgba(255,255,255,0.5)' }}>Tax residence *</label>
                    <select value={form.residenceFiscale} onChange={e => update('residenceFiscale', e.target.value)}
                      className={inputClass} style={inputStyle}>
                      <option value="france">France</option>
                      <option value="belgique">Belgium</option>
                      <option value="suisse">Switzerland</option>
                      <option value="luxembourg">Luxembourg</option>
                      <option value="autre">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4">Tax regime</h2>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.regimeFiscal as boolean}
                    onChange={e => update('regimeFiscal', e.target.checked)} className="mt-1" />
                  <span className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    I wish to be exempt from the mandatory flat-rate withholding of 12.8% (progressive scale).
                  </span>
                </label>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4">Bank details</h2>
                <label className="text-xs mb-1 block" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  IBAN for repayments *
                </label>
                <input type="text" placeholder="FR76..." value={form.iban}
                  onChange={e => update('iban', e.target.value)}
                  className={inputClass} style={inputStyle} />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs mb-1 block" style={{ color: 'rgba(255,255,255,0.5)' }}>Address *</label>
                  <input type="text" value={form.adresse} onChange={e => update('adresse', e.target.value)}
                    className={inputClass} style={inputStyle} />
                </div>
                <div>
                  <label className="text-xs mb-1 block" style={{ color: 'rgba(255,255,255,0.5)' }}>Occupation *</label>
                  <input type="text" value={form.profession} onChange={e => update('profession', e.target.value)}
                    className={inputClass} style={inputStyle} />
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4">Politically exposed person?</h2>
                <select value={form.pep} onChange={e => update('pep', e.target.value)}
                  className={inputClass} style={inputStyle}>
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4">Monthly gross income *</h2>
                <select value={form.revenus} onChange={e => update('revenus', e.target.value)}
                  className={inputClass} style={inputStyle}>
                  <option value="">Select</option>
                  <option value="less2000">Less than €2,000</option>
                  <option value="2000-4000">€2,000 – €4,000</option>
                  <option value="4000-8000">€4,000 – €8,000</option>
                  <option value="plus8000">More than €8,000</option>
                </select>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4">Identity document</h2>
                <select value={form.documentType} onChange={e => update('documentType', e.target.value)}
                  className={inputClass} style={{ ...inputStyle, marginBottom: '1rem' }}>
                  <option value="passport">Passport</option>
                  <option value="id_card">National ID card</option>
                  <option value="driving_licence">Driving licence</option>
                </select>
                <input type="text" placeholder="Document number *" value={form.documentNumero}
                  onChange={e => update('documentNumero', e.target.value)}
                  className={inputClass} style={{ ...inputStyle, marginBottom: '1rem' }} />
                <div
                  className="rounded-xl p-8 text-center text-sm cursor-pointer transition-colors"
                  style={{
                    border: `2px dashed ${uploadedFile ? 'rgba(0,255,255,0.4)' : 'rgba(255,255,255,0.2)'}`,
                    color: 'rgba(255,255,255,0.4)',
                    backgroundColor: uploadedFile ? 'rgba(0,255,255,0.04)' : 'transparent',
                  }}
                  onClick={() => document.getElementById('doc-upload')?.click()}
                >
                  <input id="doc-upload" type="file" accept="image/*,.pdf"
                    style={{ display: 'none' }}
                    onChange={e => {
                      const file = e.target.files?.[0]
                      if (file) setUploadedFile(file)
                    }}
                  />
                  {uploadedFile ? (
                    <div>
                      <p style={{ color: '#00FFFF', fontWeight: 700 }}>✓ {uploadedFile.name}</p>
                      <p style={{ fontSize: '11px', marginTop: '4px', color: 'rgba(255,255,255,0.3)' }}>Click to change</p>
                    </div>
                  ) : (
                    <div>
                      <p style={{ fontSize: '24px', marginBottom: '8px' }}>📎</p>
                      <p>Click to upload your identity document</p>
                      <p style={{ fontSize: '11px', marginTop: '4px', color: 'rgba(255,255,255,0.25)' }}>
                        JPG, PNG or PDF — max 10MB
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {error && (
                <p className="text-sm px-4 py-3 rounded-xl"
                  style={{ backgroundColor: 'rgba(255,100,100,0.15)', color: '#FF6464' }}>
                  {error}
                </p>
              )}

              <button onClick={handleSubmitKYC} disabled={loading}
                className="w-full py-4 rounded-xl font-bold text-sm transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#00FFFF', color: '#13102B', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Saving...' : 'Continue →'}
              </button>
            </>
          )}

          {/* ── STEP 2: CONFIRMATION ── */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Confirm your information</h2>
                <button onClick={() => setStep(1)} style={{
                  fontSize: '13px', color: '#00FFFF', textDecoration: 'underline',
                  background: 'none', border: 'none', cursor: 'pointer',
                }}>
                  Modify
                </button>
              </div>

              <div className="rounded-2xl p-6 space-y-4" style={{ backgroundColor: '#1E1B4B' }}>
                <h3 className="font-bold text-sm" style={{ color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Personal information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {[
                    { label: 'Full name', value: `${form.prenom} ${form.nom}` },
                    { label: 'Email', value: form.email },
                    { label: 'Phone', value: form.telephone },
                    { label: 'Address', value: form.adresse },
                    { label: 'Nationality', value: form.nationalite },
                    { label: 'Tax residence', value: form.residenceFiscale },
                  ].map((row, i) => (
                    <div key={i}>
                      <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', marginBottom: '2px' }}>{row.label}</p>
                      <p style={{ color: 'white', fontWeight: 500 }}>{row.value || '—'}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl p-6" style={{ backgroundColor: '#1E1B4B' }}>
                  <h3 className="font-bold text-sm mb-3" style={{ color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Bank details
                  </h3>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>IBAN</p>
                  <p style={{ fontSize: '13px', fontWeight: 700, fontFamily: 'monospace', wordBreak: 'break-all' }}>
                    {form.iban || '—'}
                  </p>
                </div>
                <div className="rounded-2xl p-6" style={{ backgroundColor: '#1E1B4B' }}>
                  <h3 className="font-bold text-sm mb-3" style={{ color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Identity document
                  </h3>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>
                    {form.documentType === 'passport' ? 'Passport' :
                     form.documentType === 'id_card' ? 'National ID card' : 'Driving licence'}
                  </p>
                  <p style={{ fontSize: '13px', fontWeight: 700 }}>{form.documentNumero || '—'}</p>
                  {uploadedFile && (
                    <p style={{ fontSize: '11px', color: '#00FFFF', marginTop: '8px' }}>✓ Document uploaded</p>
                  )}
                </div>
              </div>

              <div className="rounded-2xl p-6" style={{ backgroundColor: '#1E1B4B' }}>
                <h3 className="font-bold text-sm mb-4" style={{ color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Investment summary
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    { label: 'Amount', value: `€${amount.toLocaleString('en-GB')}`, highlight: true },
                    { label: 'Rate', value: '9.5% / year' },
                    { label: 'Duration', value: '36 months' },
                    { label: 'Grace period', value: '6 months' },
                    { label: 'Monthly (grace)', value: `€${monthlyGrace.toFixed(2)}` },
                    { label: 'Monthly (months 7–36)', value: `€${monthlyRepayment.toFixed(2)}` },
                    { label: 'Total interest', value: `€${totalInterest.toFixed(2)}` },
                    { label: 'Total repaid', value: `€${totalRepaid.toFixed(2)}` },
                  ].map((row, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'rgba(255,255,255,0.4)' }}>{row.label}</span>
                      <span style={{ fontWeight: 700, color: row.highlight ? '#00FFFF' : 'white' }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key documents */}
              <div className="rounded-2xl p-6" style={{ backgroundColor: '#1E1B4B' }}>
                <h3 className="font-bold text-sm mb-4" style={{ color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Key documents
                </h3>
                <div className="space-y-3">
                  {[
                    { icon: '📄', label: 'Bond subscription contract', sublabel: 'Signed contract — PDF' },
                    { icon: '📋', label: "DIS — Document d'Information Synthétique", sublabel: 'Risk & product information — PDF' },
                    { icon: '📊', label: 'Payment schedule', sublabel: 'Full repayment schedule — PDF' },
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
                        Coming soon
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={handleConfirm}
                className="w-full py-4 rounded-xl font-bold text-sm transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#00FFFF', color: '#13102B' }}>
                Confirm and continue →
              </button>
            </div>
          )}

          {/* ── STEP 3: SIGNATURE ── */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Sign your contract</h2>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  Please read and sign the bond subscription contract before proceeding to payment.
                </p>
              </div>

              {/* Contract PDF placeholder */}
              <div style={{
                borderRadius: '16px', overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.08)',
                backgroundColor: '#1E1B4B',
              }}>
                <div style={{
                  padding: '12px 20px',
                  backgroundColor: 'rgba(0,0,0,0.2)',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '16px' }}>📄</span>
                    <span style={{ fontSize: '13px', fontWeight: 600 }}>
                      Bond_Subscription_Contract_{form.prenom}_{form.nom}.pdf
                    </span>
                  </div>
                  <span style={{
                    fontSize: '11px', padding: '3px 10px', borderRadius: '100px',
                    backgroundColor: 'rgba(255,200,0,0.15)', color: '#FFC800', fontWeight: 600,
                  }}>
                    Coming soon
                  </span>
                </div>
                <div style={{
                  height: '400px',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', gap: '16px',
                  backgroundColor: 'rgba(255,255,255,0.02)',
                }}>
                  <div style={{ fontSize: '64px', opacity: 0.3 }}>📃</div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '15px', fontWeight: 700, marginBottom: '8px' }}>
                      Contract not yet available
                    </p>
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', maxWidth: '320px', lineHeight: '1.6' }}>
                      The bond subscription contract for{' '}
                      <strong style={{ color: 'white' }}>{form.prenom} {form.nom}</strong>{' '}
                      will be generated here once the contract template is ready.
                    </p>
                  </div>
                  <div style={{
                    padding: '10px 20px', borderRadius: '10px',
                    backgroundColor: 'rgba(0,255,255,0.06)',
                    border: '1px solid rgba(0,255,255,0.12)',
                    fontSize: '12px', color: 'rgba(255,255,255,0.5)',
                  }}>
                    🔗 Tomorro e-signature integration coming soon
                  </div>
                </div>
              </div>

              {/* Checkbox */}
              <div className="rounded-2xl p-6" style={{ backgroundColor: '#1E1B4B' }}>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={contractSigned}
                    onChange={e => setContractSigned(e.target.checked)}
                    className="mt-1" style={{ accentColor: '#00FFFF' }} />
                  <span className="text-sm" style={{ color: 'rgba(255,255,255,0.7)', lineHeight: '1.6' }}>
                    I have read and understood the bond subscription contract. I agree to invest{' '}
                    <strong style={{ color: 'white' }}>€{amount.toLocaleString('en-GB')}</strong> in the{' '}
                    <strong style={{ color: 'white' }}>Spring 2026 Fleet</strong> campaign at a rate of{' '}
                    <strong style={{ color: '#00FFFF' }}>9.5% per year</strong> over{' '}
                    <strong style={{ color: 'white' }}>36 months</strong>.
                  </span>
                </label>
              </div>

              {/* Risk notice */}
              <div className="rounded-2xl p-4 text-sm"
                style={{ backgroundColor: 'rgba(255,200,0,0.05)', border: '1px solid rgba(255,200,0,0.15)' }}>
                <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: '1.6' }}>
                  ⚠️ All investments carry risk, including the risk of partial or total capital loss.
                  Past performance is not a guarantee of future results.
                </p>
              </div>

              {error && (
                <p className="text-sm px-4 py-3 rounded-xl"
                  style={{ backgroundColor: 'rgba(255,100,100,0.15)', color: '#FF6464' }}>
                  {error}
                </p>
              )}

              <button onClick={handleSignContract} disabled={loading}
                className="w-full py-4 rounded-xl font-bold text-sm transition-opacity"
                style={{
                  backgroundColor: contractSigned ? '#00FFFF' : 'rgba(255,255,255,0.1)',
                  color: contractSigned ? '#13102B' : 'rgba(255,255,255,0.3)',
                  opacity: loading ? 0.7 : 1,
                  cursor: contractSigned ? 'pointer' : 'not-allowed',
                }}>
                {loading ? 'Processing...' : '✍️ Sign and continue →'}
              </button>
            </div>
          )}

          {/* ── STEP 4: PAYMENT ── */}
          {step === 4 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-2">Bank transfer</h2>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  Please make a bank transfer to the account below, quoting your reference number exactly.
                </p>
              </div>
              <div className="rounded-2xl p-6 space-y-4 text-sm" style={{ backgroundColor: '#1E1B4B' }}>
                {[
                  { label: 'Beneficiary', value: 'Pony Finance SA' },
                  { label: 'IBAN', value: 'FR76 XXXX XXXX XXXX XXXX' },
                  { label: 'BIC', value: 'XXXXXXXX' },
                  { label: 'Reference', value: `PONY-${investorId.slice(0, 8).toUpperCase()}` },
                  { label: 'Amount', value: `€${amount.toLocaleString('en-GB')}` },
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
                  ⏱️ Once the transfer is received, your investment will be confirmed within{' '}
                  <strong>2–3 business days</strong>. You will receive a confirmation email.
                </p>
              </div>
              <button onClick={() => setStep(5)}
                className="w-full py-4 rounded-xl font-bold text-sm transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#00FFFF', color: '#13102B' }}>
                I have made the transfer →
              </button>
            </div>
          )}

          {/* ── STEP 5: DONE ── */}
          {step === 5 && (
            <div className="space-y-8 py-8">
              {/* Success header */}
              <div className="text-center space-y-4">
                <div className="text-7xl">🎉</div>
                <h2 className="text-3xl font-bold">Investment confirmed!</h2>
                <p className="text-sm max-w-md mx-auto leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  Thank you for your trust in Pony. Your investment will be activated once
                  your transfer is received. You'll receive a confirmation by email.
                </p>
              </div>

              {/* Final documents */}
              <div className="rounded-2xl p-6" style={{ backgroundColor: '#1E1B4B' }}>
                <h3 className="font-bold text-sm mb-4" style={{ color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Your documents
                </h3>
                <div className="space-y-3">
                  {[
                    {
                      icon: '📄',
                      label: `Bond_Subscription_Contract_${form.prenom}_${form.nom}.pdf`,
                      sublabel: 'Signed bond subscription contract',
                    },
                    {
                      icon: '📋',
                      label: `DIS_${form.prenom}_${form.nom}.pdf`,
                      sublabel: "Document d'Information Synthétique",
                    },
                    {
                      icon: '📊',
                      label: `Payment_Schedule_${form.prenom}_${form.nom}.pdf`,
                      sublabel: 'Full repayment schedule',
                    },
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
                          <p style={{ fontSize: '12px', fontWeight: 600, fontFamily: 'monospace' }}>{doc.label}</p>
                          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>{doc.sublabel}</p>
                        </div>
                      </div>
                      <span style={{
                        fontSize: '11px', padding: '4px 12px', borderRadius: '100px',
                        backgroundColor: 'rgba(255,200,0,0.1)',
                        border: '1px solid rgba(255,200,0,0.2)',
                        color: '#FFC800', fontWeight: 600,
                      }}>
                        Coming soon
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dashboard buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {loggedIn ? (
                  <Link href="/dashboard"
                    className="w-full py-4 rounded-xl font-bold text-sm text-center transition-opacity hover:opacity-90"
                    style={{ backgroundColor: '#00FFFF', color: '#13102B', textDecoration: 'none', display: 'block' }}>
                    View my portfolio →
                  </Link>
                ) : (
                  <>
                    <button onClick={() => setShowDashboardModal(true)}
                      className="w-full py-4 rounded-xl font-bold text-sm transition-opacity hover:opacity-90"
                      style={{ backgroundColor: '#00FFFF', color: '#13102B', border: 'none', cursor: 'pointer' }}>
                      My Dashboard →
                    </button>
                    <p className="text-center text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                      Log in or create an account to track your investment
                    </p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── Sidebar ── */}
        {step < 5 && (
          <div className="rounded-2xl p-6 h-fit sticky top-8" style={{ backgroundColor: '#1E1B4B' }}>
            <h3 className="font-bold mb-5">Your investment</h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center">
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>Amount</span>
                <span className="text-xl font-bold" style={{ color: '#00FFFF' }}>
                  €{amount.toLocaleString('en-GB')}
                </span>
              </div>
              <div className="h-px" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }} />
              {[
                { label: 'Rate', value: '9.5% / year' },
                { label: 'Duration', value: '36 months' },
                { label: 'Grace period', value: '6 months' },
                { label: 'Monthly (grace)', value: `€${monthlyGrace.toFixed(2)}` },
                { label: 'Monthly (7–36)', value: `€${monthlyRepayment.toFixed(2)}` },
                { label: 'Total interest', value: `€${totalInterest.toFixed(2)}` },
              ].map((row, i) => (
                <div key={i} className="flex justify-between">
                  <span style={{ color: 'rgba(255,255,255,0.4)' }}>{row.label}</span>
                  <span className="font-bold">{row.value}</span>
                </div>
              ))}
              <div className="h-px" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }} />
              <div className="flex justify-between">
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>Total repaid</span>
                <span className="font-bold text-white">€{totalRepaid.toFixed(2)}</span>
              </div>
            </div>
            {loggedIn ? (
              <Link href="/dashboard" style={{
                display: 'block', width: '100%', marginTop: '24px', textAlign: 'center',
                backgroundColor: 'transparent', color: '#00FFFF',
                padding: '12px', borderRadius: '10px',
                fontSize: '13px', fontWeight: 700,
                border: '1px solid rgba(0,255,255,0.3)',
                textDecoration: 'none',
              }}>
                My Dashboard →
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
                My Dashboard →
              </button>
            )}
          </div>
        )}
      </div>
    </main>
  )
}

export default function Investir() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#13102B' }}>
        <p style={{ color: '#00FFFF' }}>Loading...</p>
      </main>
    }>
      <InvestirForm />
    </Suspense>
  )
}