'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

function InvestirForm() {
  const searchParams = useSearchParams()
  const campaignId = searchParams.get('campaignId')
  const amount = Number(searchParams.get('amount')) || 5000
  const duration = Number(searchParams.get('duration')) || 24
  const rate = Number(searchParams.get('rate')) || 0.07

  const totalRepaid = amount + amount * rate * (duration / 12)
  const monthlyInterest = (amount * rate) / 12

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [investorId, setInvestorId] = useState('')

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
        .insert({
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
        })
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
  const inputStyle = {backgroundColor: '#1E1B4B', border: '1px solid rgba(255,255,255,0.1)'}

  return (
    <main className="min-h-screen font-sans" style={{backgroundColor: '#13102B', color: 'white'}}>

      <header className="flex justify-between items-center px-8 py-5 border-b border-white/10">
        <Link href="/">
          <img src="/Logo.png" alt="Pony" style={{height: '25px', width: 'auto'}} />
        </Link>
        <Link href="/campagne" className="text-sm hover:opacity-70" style={{color: 'rgba(255,255,255,0.5)'}}>
          ← Back to campaign
        </Link>
      </header>

      <div className="flex justify-center items-center gap-4 py-10">
        {[1, 2, 3].map(s => (
          <div key={s} className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                style={{
                  backgroundColor: step === s ? '#00E5CC' : step > s ? 'rgba(0,229,204,0.2)' : 'rgba(255,255,255,0.1)',
                  color: step === s ? '#13102B' : step > s ? '#00E5CC' : 'rgba(255,255,255,0.4)',
                }}>
                {s}
              </div>
              <span className="text-sm font-medium" style={{color: step === s ? 'white' : 'rgba(255,255,255,0.3)'}}>
                {s === 1 ? 'KYC' : s === 2 ? 'Payment' : 'Done'}
              </span>
            </div>
            {s < 3 && <div className="w-16 h-px" style={{backgroundColor: 'rgba(255,255,255,0.1)'}} />}
          </div>
        ))}
      </div>

      <div className="max-w-5xl mx-auto px-8 pb-16 grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-8">

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
                    <label className="text-xs mb-1 block" style={{color: 'rgba(255,255,255,0.5)'}}>First name *</label>
                    <input type="text" value={form.prenom} onChange={e => update('prenom', e.target.value)}
                      className={inputClass} style={inputStyle} />
                  </div>
                  <div>
                    <label className="text-xs mb-1 block" style={{color: 'rgba(255,255,255,0.5)'}}>Last name *</label>
                    <input type="text" value={form.nom} onChange={e => update('nom', e.target.value)}
                      className={inputClass} style={inputStyle} />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs mb-1 block" style={{color: 'rgba(255,255,255,0.5)'}}>Email *</label>
                    <input type="email" value={form.email} onChange={e => update('email', e.target.value)}
                      className={inputClass} style={inputStyle} />
                  </div>
                  <div>
                    <label className="text-xs mb-1 block" style={{color: 'rgba(255,255,255,0.5)'}}>Place of birth *</label>
                    <input type="text" value={form.lieuNaissance} onChange={e => update('lieuNaissance', e.target.value)}
                      className={inputClass} style={inputStyle} />
                  </div>
                  <div>
                    <label className="text-xs mb-1 block" style={{color: 'rgba(255,255,255,0.5)'}}>Date of birth *</label>
                    <input type="date" value={form.dateNaissance} onChange={e => update('dateNaissance', e.target.value)}
                      className={inputClass} style={inputStyle} />
                  </div>
                  <div>
                    <label className="text-xs mb-1 block" style={{color: 'rgba(255,255,255,0.5)'}}>Country of nationality *</label>
                    <select value={form.nationalite} onChange={e => update('nationalite', e.target.value)}
                      className={inputClass} style={inputStyle}>
                      <option value="">Please select</option>
                      <option value="Afghanistan">Afghanistan</option>
                      <option value="Albanie">Albania</option>
                      <option value="Algérie">Algeria</option>
                      <option value="Allemagne">Germany</option>
                      <option value="Andorre">Andorra</option>
                      <option value="Angola">Angola</option>
                      <option value="Arabie Saoudite">Saudi Arabia</option>
                      <option value="Argentine">Argentina</option>
                      <option value="Arménie">Armenia</option>
                      <option value="Australie">Australia</option>
                      <option value="Autriche">Austria</option>
                      <option value="Azerbaïdjan">Azerbaijan</option>
                      <option value="Bahreïn">Bahrain</option>
                      <option value="Bangladesh">Bangladesh</option>
                      <option value="Belgique">Belgium</option>
                      <option value="Bénin">Benin</option>
                      <option value="Bolivie">Bolivia</option>
                      <option value="Bosnie-Herzégovine">Bosnia-Herzegovina</option>
                      <option value="Botswana">Botswana</option>
                      <option value="Brésil">Brazil</option>
                      <option value="Bulgarie">Bulgaria</option>
                      <option value="Burkina Faso">Burkina Faso</option>
                      <option value="Burundi">Burundi</option>
                      <option value="Cambodge">Cambodia</option>
                      <option value="Cameroun">Cameroon</option>
                      <option value="Canada">Canada</option>
                      <option value="Chili">Chile</option>
                      <option value="Chine">China</option>
                      <option value="Chypre">Cyprus</option>
                      <option value="Colombie">Colombia</option>
                      <option value="Congo">Congo</option>
                      <option value="Corée du Sud">South Korea</option>
                      <option value="Costa Rica">Costa Rica</option>
                      <option value="Côte d'Ivoire">Ivory Coast</option>
                      <option value="Croatie">Croatia</option>
                      <option value="Cuba">Cuba</option>
                      <option value="Danemark">Denmark</option>
                      <option value="Égypte">Egypt</option>
                      <option value="Émirats Arabes Unis">United Arab Emirates</option>
                      <option value="Équateur">Ecuador</option>
                      <option value="Espagne">Spain</option>
                      <option value="Estonie">Estonia</option>
                      <option value="Éthiopie">Ethiopia</option>
                      <option value="Finlande">Finland</option>
                      <option value="France">France</option>
                      <option value="Gabon">Gabon</option>
                      <option value="Ghana">Ghana</option>
                      <option value="Grèce">Greece</option>
                      <option value="Guatemala">Guatemala</option>
                      <option value="Guinée">Guinea</option>
                      <option value="Haïti">Haiti</option>
                      <option value="Honduras">Honduras</option>
                      <option value="Hongrie">Hungary</option>
                      <option value="Inde">India</option>
                      <option value="Indonésie">Indonesia</option>
                      <option value="Iran">Iran</option>
                      <option value="Irak">Iraq</option>
                      <option value="Irlande">Ireland</option>
                      <option value="Islande">Iceland</option>
                      <option value="Israël">Israel</option>
                      <option value="Italie">Italy</option>
                      <option value="Jamaïque">Jamaica</option>
                      <option value="Japon">Japan</option>
                      <option value="Jordanie">Jordan</option>
                      <option value="Kazakhstan">Kazakhstan</option>
                      <option value="Kenya">Kenya</option>
                      <option value="Koweït">Kuwait</option>
                      <option value="Laos">Laos</option>
                      <option value="Lettonie">Latvia</option>
                      <option value="Liban">Lebanon</option>
                      <option value="Libye">Libya</option>
                      <option value="Liechtenstein">Liechtenstein</option>
                      <option value="Lituanie">Lithuania</option>
                      <option value="Luxembourg">Luxembourg</option>
                      <option value="Macédoine">North Macedonia</option>
                      <option value="Madagascar">Madagascar</option>
                      <option value="Malaisie">Malaysia</option>
                      <option value="Mali">Mali</option>
                      <option value="Malte">Malta</option>
                      <option value="Maroc">Morocco</option>
                      <option value="Maurice">Mauritius</option>
                      <option value="Mauritanie">Mauritania</option>
                      <option value="Mexique">Mexico</option>
                      <option value="Moldavie">Moldova</option>
                      <option value="Monaco">Monaco</option>
                      <option value="Mongolie">Mongolia</option>
                      <option value="Monténégro">Montenegro</option>
                      <option value="Mozambique">Mozambique</option>
                      <option value="Namibie">Namibia</option>
                      <option value="Népal">Nepal</option>
                      <option value="Nicaragua">Nicaragua</option>
                      <option value="Niger">Niger</option>
                      <option value="Nigéria">Nigeria</option>
                      <option value="Norvège">Norway</option>
                      <option value="Nouvelle-Zélande">New Zealand</option>
                      <option value="Oman">Oman</option>
                      <option value="Ouganda">Uganda</option>
                      <option value="Ouzbékistan">Uzbekistan</option>
                      <option value="Pakistan">Pakistan</option>
                      <option value="Panama">Panama</option>
                      <option value="Paraguay">Paraguay</option>
                      <option value="Pays-Bas">Netherlands</option>
                      <option value="Pérou">Peru</option>
                      <option value="Philippines">Philippines</option>
                      <option value="Pologne">Poland</option>
                      <option value="Portugal">Portugal</option>
                      <option value="Qatar">Qatar</option>
                      <option value="Roumanie">Romania</option>
                      <option value="Royaume-Uni">United Kingdom</option>
                      <option value="Russie">Russia</option>
                      <option value="Rwanda">Rwanda</option>
                      <option value="Sénégal">Senegal</option>
                      <option value="Serbie">Serbia</option>
                      <option value="Singapour">Singapore</option>
                      <option value="Slovaquie">Slovakia</option>
                      <option value="Slovénie">Slovenia</option>
                      <option value="Somalie">Somalia</option>
                      <option value="Soudan">Sudan</option>
                      <option value="Sri Lanka">Sri Lanka</option>
                      <option value="Suède">Sweden</option>
                      <option value="Suisse">Switzerland</option>
                      <option value="Syrie">Syria</option>
                      <option value="Taïwan">Taiwan</option>
                      <option value="Tanzanie">Tanzania</option>
                      <option value="Tchad">Chad</option>
                      <option value="Thaïlande">Thailand</option>
                      <option value="Togo">Togo</option>
                      <option value="Tunisie">Tunisia</option>
                      <option value="Turquie">Turkey</option>
                      <option value="Ukraine">Ukraine</option>
                      <option value="États-Unis">United States</option>
                      <option value="Uruguay">Uruguay</option>
                      <option value="Venezuela">Venezuela</option>
                      <option value="Vietnam">Vietnam</option>
                      <option value="Yémen">Yemen</option>
                      <option value="Zambie">Zambia</option>
                      <option value="Zimbabwe">Zimbabwe</option>
                      <option value="Autre">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs mb-1 block" style={{color: 'rgba(255,255,255,0.5)'}}>Phone number *</label>
                    <input type="tel" value={form.telephone} onChange={e => update('telephone', e.target.value)}
                      className={inputClass} style={inputStyle} />
                  </div>
                  <div>
                    <label className="text-xs mb-1 block" style={{color: 'rgba(255,255,255,0.5)'}}>Preferred language</label>
                    <select value={form.langue} onChange={e => update('langue', e.target.value)}
                      className={inputClass} style={inputStyle}>
                      <option value="english">English</option>
                      <option value="french">French</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs mb-1 block" style={{color: 'rgba(255,255,255,0.5)'}}>Tax residence *</label>
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
                  <input type="checkbox" checked={form.regimeFiscal}
                    onChange={e => update('regimeFiscal', e.target.checked)} className="mt-1" />
                  <span className="text-sm" style={{color: 'rgba(255,255,255,0.6)'}}>
                    I wish to be exempt from the mandatory flat-rate withholding of 12.8% (progressive scale).
                  </span>
                </label>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4">Bank details</h2>
                <label className="text-xs mb-1 block" style={{color: 'rgba(255,255,255,0.5)'}}>
                  IBAN of the bank account where you wish to receive your repayments *
                </label>
                <input type="text" placeholder="FR76..." value={form.iban}
                  onChange={e => update('iban', e.target.value)}
                  className={inputClass} style={inputStyle} />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs mb-1 block" style={{color: 'rgba(255,255,255,0.5)'}}>Address *</label>
                  <input type="text" value={form.adresse} onChange={e => update('adresse', e.target.value)}
                    className={inputClass} style={inputStyle} />
                </div>
                <div>
                  <label className="text-xs mb-1 block" style={{color: 'rgba(255,255,255,0.5)'}}>Occupation *</label>
                  <input type="text" value={form.profession} onChange={e => update('profession', e.target.value)}
                    className={inputClass} style={inputStyle} />
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4">Are you a politically exposed person?</h2>
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
                  <option value="2000-4000">Between €2,000 and €4,000</option>
                  <option value="4000-8000">Between €4,000 and €8,000</option>
                  <option value="plus8000">More than €8,000</option>
                </select>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4">Identity document</h2>
                <select value={form.documentType} onChange={e => update('documentType', e.target.value)}
                  className={inputClass} style={{...inputStyle, marginBottom: '1rem'}}>
                  <option value="passport">Passport</option>
                  <option value="id_card">National ID card</option>
                  <option value="driving_licence">Driving licence</option>
                </select>
                <input type="text" placeholder="Document number *" value={form.documentNumero}
                  onChange={e => update('documentNumero', e.target.value)}
                  className={inputClass} style={{...inputStyle, marginBottom: '1rem'}} />
                <div className="rounded-xl p-8 text-center text-sm cursor-pointer"
                  style={{border: '2px dashed rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.4)'}}>
                  📎 Click to upload your identity document
                </div>
              </div>

              {error && (
                <p className="text-sm px-4 py-3 rounded-xl"
                  style={{backgroundColor: 'rgba(255,100,100,0.15)', color: '#FF6464'}}>
                  {error}
                </p>
              )}

              <button
                onClick={handleSubmitKYC}
                disabled={loading}
                className="w-full py-4 rounded-xl font-bold text-sm transition-colors"
                style={{backgroundColor: '#00E5CC', color: '#13102B', opacity: loading ? 0.7 : 1}}>
                {loading ? 'Saving...' : 'Submit →'}
              </button>
            </>
          )}

          {step === 2 && (
            <div className="space-y-8">
              <h2 className="text-xl font-bold">Payment</h2>
              <p className="text-sm" style={{color: 'rgba(255,255,255,0.5)'}}>
                Please make a bank transfer to the following account, quoting your reference number.
              </p>
              <div className="rounded-2xl p-6 space-y-4 text-sm" style={{backgroundColor: '#1E1B4B'}}>
                {[
                  { label: 'Beneficiary', value: 'Pony Finance SA' },
                  { label: 'IBAN', value: 'FR76 XXXX XXXX XXXX XXXX' },
                  { label: 'Reference', value: `PONY-${investorId.slice(0, 8).toUpperCase()}` },
                  { label: 'Amount', value: `€${amount.toLocaleString('en-GB')}` },
                ].map((row, i) => (
                  <div key={i} className="flex justify-between">
                    <span style={{color: 'rgba(255,255,255,0.4)'}}>{row.label}</span>
                    <span className="font-bold">{row.value}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs" style={{color: 'rgba(255,255,255,0.3)'}}>
                Once the transfer is received, your investment will be confirmed within 2–3 business days.
              </p>
              <button onClick={() => setStep(3)}
                className="w-full py-4 rounded-xl font-bold text-sm"
                style={{backgroundColor: '#00E5CC', color: '#13102B'}}>
                I have made the transfer →
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-16 space-y-6">
              <div className="text-6xl">🎉</div>
              <h2 className="text-2xl font-bold">Investment confirmed!</h2>
              <p className="text-sm max-w-md mx-auto" style={{color: 'rgba(255,255,255,0.5)'}}>
                Thank you for your trust. Your investment will be activated upon receipt of your transfer.
              </p>
              <Link href="/dashboard"
                className="inline-block px-8 py-3 rounded-xl text-sm font-bold"
                style={{backgroundColor: '#00E5CC', color: '#13102B'}}>
                View my portfolio →
              </Link>
            </div>
          )}
        </div>

        {step < 3 && (
          <div className="rounded-2xl p-6 h-fit sticky top-8" style={{backgroundColor: '#1E1B4B'}}>
            <h3 className="font-bold mb-5">Summary</h3>
            <div className="space-y-4 text-sm">
              {[
                { label: 'Total', value: `€${amount.toLocaleString('en-GB')}`, large: true },
                { label: 'Interest rate', value: `${(rate * 100).toFixed(0)}%` },
                { label: 'Duration', value: `${duration} months` },
                { label: 'Total repaid', value: `€${totalRepaid.toLocaleString('en-GB', {maximumFractionDigits: 0})}` },
                { label: 'Monthly', value: `€${monthlyInterest.toFixed(2)}` },
              ].map((row, i) => (
                <div key={i} className="flex justify-between">
                  <span style={{color: 'rgba(255,255,255,0.4)'}}>{row.label}</span>
                  <span className={`font-bold ${row.large ? 'text-lg' : ''}`}
                    style={{color: row.large ? '#00E5CC' : 'white'}}>
                    {row.value}
                  </span>
                </div>
              ))}
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
      <main className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#13102B'}}>
        <p style={{color: '#00E5CC'}}>Loading...</p>
      </main>
    }>
      <InvestirForm />
    </Suspense>
  )
}