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

      // Not logged in → redirect to login with return URL
      if (!session) {
        const returnUrl = `/investir?campaignId=${campaignId}&amount=${amount}`
        window.location.href = `/login?redirect=${encodeURIComponent(returnUrl)}`
        return
      }

      // Logged in → check existing investor record
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
        }))

        // KYC approved → skip to payment
        if (investor.kyc_status === 'Validé') {
          await supabase.from('investments').insert({
            investor_id: investor.id,
            campaign_id: campaignId,
            montant: amount,
            statut: 'En attente',
          })
          setStep(2)
        }
      } else {
        // Logged in but no KYC record yet → pre-fill email
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
          kyc_status: 'En attente',
        }, { onConflict: 'email' })
        .select()
        .single()

      if (error) throw error

      await supabase.from('investments').insert({
        investor_id: data.id,
        campaign_id: campaignId,
        montant: amount,
        statut: 'En attente',
      })

      setInvestorId(data.id)
      setStep(2)
    } catch (err: any) {
      setError(err.message || 'An error occurred.')
    }
    setLoading(false)
  }

  const inputClass = "w-full rounded-xl px-4 py-3 text-sm text-white outline-none"
  const inputStyle = { backgroundColor: '#1E1B4B', border: '1px solid rgba(255,255,255,0.1)' }

  if (checkingSession) return (
    <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#13102B' }}>
      <p style={{ color: '#00FFFF' }}>Loading...</p>
    </main>
  )

  // KYC pending
  if (existingKycStatus === 'En attente' && step === 1) return (
    <main className="min-h-screen font-sans flex items-center justify-center"
      style={{ backgroundColor: '#13102B', color: 'white' }}>
      <div className="text-center max-w-md px-8 space-y-6">
        <div className="text-6xl">⏳</div>
        <h2 className="text-2xl font-bold">KYC under review</h2>
        <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Your identity verification is currently being reviewed. You'll receive an email once approved and you'll be able to invest.
        </p>
        <Link href="/dashboard"
          className="inline-block px-8 py-4 rounded-xl text-sm font-bold"
          style={{ backgroundColor: '#00FFFF', color: '#13102B', textDecoration: 'none' }}>
          View my portfolio →
        </Link>
      </div>
    </main>
  )

  // KYC rejected
  if (existingKycStatus === 'Rejeté' && step === 1) return (
    <main className="min-h-screen font-sans flex items-center justify-center"
      style={{ backgroundColor: '#13102B', color: 'white' }}>
      <div className="text-center max-w-md px-8 space-y-6">
        <div className="text-6xl">❌</div>
        <h2 className="text-2xl font-bold">KYC rejected</h2>
        <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Your identity verification was rejected. Please contact us at{' '}
          <span style={{ color: '#00FFFF' }}>support@ridepony.com</span> for more information.
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

      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0 40px', height: '64px',
        backgroundColor: 'rgba(19,16,43,0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <Link href="/">
          <img src="/Logo.png" alt="Pony" style={{ height: '25px', width: 'auto' }} />
        </Link>
        <Link href="/campagne" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>
          ← Back to campaign
        </Link>
      </header>

      {/* Steps */}
      <div className="flex justify-center items-center gap-4 py-10">
        {[
          { n: 1, label: 'KYC' },
          { n: 2, label: 'Payment' },
          { n: 3, label: 'Done' },
        ].map(({ n, label }, i) => (
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
            {i < 2 && <div className="w-16 h-px" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />}
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
                  <input
                    id="doc-upload"
                    type="file"
                    accept="image/*,.pdf"
                    style={{ display: 'none' }}
                    onChange={e => {
                      const file = e.target.files?.[0]
                      if (file) setUploadedFile(file)
                    }}
                  />
                  {uploadedFile ? (
                    <div>
                      <p style={{ color: '#00FFFF', fontWeight: 700 }}>✓ {uploadedFile.name}</p>
                      <p style={{ fontSize: '11px', marginTop: '4px', color: 'rgba(255,255,255,0.3)' }}>
                        Click to change
                      </p>
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
                {loading ? 'Saving...' : 'Submit →'}
              </button>
            </>
          )}

          {/* ── STEP 2: Payment ── */}
          {step === 2 && (
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
              <button onClick={() => setStep(3)}
                className="w-full py-4 rounded-xl font-bold text-sm transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#00FFFF', color: '#13102B' }}>
                I have made the transfer →
              </button>
            </div>
          )}

          {/* ── STEP 3: Done ── */}
          {step === 3 && (
            <div className="text-center py-16 space-y-6">
              <div className="text-7xl">🎉</div>
              <h2 className="text-3xl font-bold">Investment confirmed!</h2>
              <p className="text-sm max-w-md mx-auto leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Thank you for your trust in Pony. Your investment will be activated once
                your KYC is approved and your transfer received. You'll receive a confirmation by email.
              </p>
              <Link href="/dashboard"
                className="inline-block px-8 py-4 rounded-xl text-sm font-bold transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#00FFFF', color: '#13102B', textDecoration: 'none' }}>
                View my portfolio →
              </Link>
            </div>
          )}
        </div>

        {/* ── Sidebar ── */}
        {step < 3 && (
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
                { label: 'Monthly (months 7–36)', value: `€${monthlyRepayment.toFixed(2)}` },
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