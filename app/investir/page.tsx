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
    type: 'individuel',
    prenom: '',
    nom: '',
    email: '',
    lieuNaissance: '',
    dateNaissance: '',
    nationalite: '',
    telephone: '',
    langue: 'français',
    residenceFiscale: 'france',
    regimeFiscal: false,
    iban: '',
    adresse: '',
    profession: '',
    pep: 'non',
    revenus: '',
    documentType: 'passeport',
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
      setError('Veuillez remplir tous les champs obligatoires.')
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
      setError(err.message || 'Une erreur est survenue')
    }
    setLoading(false)
  }

  const inputClass = "w-full rounded-xl px-4 py-3 text-sm text-white outline-none"
  const inputStyle = {backgroundColor: '#1E1B4B', border: '1px solid rgba(255,255,255,0.1)'}

  return (
    <main className="min-h-screen font-sans" style={{backgroundColor: '#0D0D2B', color: 'white'}}>

      <header className="flex justify-between items-center px-8 py-5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-xl">🐴</span>
          <Link href="/" className="font-bold" style={{color: '#00E5CC'}}>pony</Link>
        </div>
        <Link href="/campagne" className="text-sm hover:opacity-70" style={{color: 'rgba(255,255,255,0.5)'}}>
          ← Retour à la campagne
        </Link>
      </header>

      <div className="flex justify-center items-center gap-4 py-10">
        {[1, 2, 3].map(s => (
          <div key={s} className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                style={{
                  backgroundColor: step === s ? '#00E5CC' : step > s ? 'rgba(0,229,204,0.2)' : 'rgba(255,255,255,0.1)',
                  color: step === s ? '#0D0D2B' : step > s ? '#00E5CC' : 'rgba(255,255,255,0.4)',
                }}>
                {s}
              </div>
              <span className="text-sm font-medium" style={{color: step === s ? 'white' : 'rgba(255,255,255,0.3)'}}>
                {s === 1 ? 'Confirmation' : s === 2 ? 'Paiement' : 'Terminé'}
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
                <h2 className="text-xl font-bold mb-4">Type de compte</h2>
                <select value={form.type} onChange={e => update('type', e.target.value)}
                  className={inputClass} style={inputStyle}>
                  <option value="individuel">Individuel (personne physique)</option>
                  <option value="entreprise">Entreprise (personne morale)</option>
                </select>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4">Informations personnelles</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs mb-1 block" style={{color: 'rgba(255,255,255,0.5)'}}>Prénom *</label>
                    <input type="text" value={form.prenom} onChange={e => update('prenom', e.target.value)}
                      className={inputClass} style={inputStyle} />
                  </div>
                  <div>
                    <label className="text-xs mb-1 block" style={{color: 'rgba(255,255,255,0.5)'}}>Nom *</label>
                    <input type="text" value={form.nom} onChange={e => update('nom', e.target.value)}
                      className={inputClass} style={inputStyle} />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs mb-1 block" style={{color: 'rgba(255,255,255,0.5)'}}>Email *</label>
                    <input type="email" value={form.email} onChange={e => update('email', e.target.value)}
                      className={inputClass} style={inputStyle} />
                  </div>
                  <div>
                    <label className="text-xs mb-1 block" style={{color: 'rgba(255,255,255,0.5)'}}>Lieu de naissance *</label>
                    <input type="text" value={form.lieuNaissance} onChange={e => update('lieuNaissance', e.target.value)}
                      className={inputClass} style={inputStyle} />
                  </div>
                  <div>
                    <label className="text-xs mb-1 block" style={{color: 'rgba(255,255,255,0.5)'}}>Date de naissance *</label>
                    <input type="date" value={form.dateNaissance} onChange={e => update('dateNaissance', e.target.value)}
                      className={inputClass} style={inputStyle} />
                  </div>
                  <div>
                    <label className="text-xs mb-1 block" style={{color: 'rgba(255,255,255,0.5)'}}>Pays de nationalité *</label>
                    <select value={form.nationalite} onChange={e => update('nationalite', e.target.value)}
                      className={inputClass} style={inputStyle}>
                      <option value="">Veuillez faire un choix</option>
                      <option value="Afghanistan">Afghanistan</option>
                      <option value="Albanie">Albanie</option>
                      <option value="Algérie">Algérie</option>
                      <option value="Allemagne">Allemagne</option>
                      <option value="Andorre">Andorre</option>
                      <option value="Angola">Angola</option>
                      <option value="Arabie Saoudite">Arabie Saoudite</option>
                      <option value="Argentine">Argentine</option>
                      <option value="Arménie">Arménie</option>
                      <option value="Australie">Australie</option>
                      <option value="Autriche">Autriche</option>
                      <option value="Azerbaïdjan">Azerbaïdjan</option>
                      <option value="Bahreïn">Bahreïn</option>
                      <option value="Bangladesh">Bangladesh</option>
                      <option value="Belgique">Belgique</option>
                      <option value="Bénin">Bénin</option>
                      <option value="Bolivie">Bolivie</option>
                      <option value="Bosnie-Herzégovine">Bosnie-Herzégovine</option>
                      <option value="Botswana">Botswana</option>
                      <option value="Brésil">Brésil</option>
                      <option value="Bulgarie">Bulgarie</option>
                      <option value="Burkina Faso">Burkina Faso</option>
                      <option value="Burundi">Burundi</option>
                      <option value="Cambodge">Cambodge</option>
                      <option value="Cameroun">Cameroun</option>
                      <option value="Canada">Canada</option>
                      <option value="Chili">Chili</option>
                      <option value="Chine">Chine</option>
                      <option value="Chypre">Chypre</option>
                      <option value="Colombie">Colombie</option>
                      <option value="Congo">Congo</option>
                      <option value="Corée du Sud">Corée du Sud</option>
                      <option value="Costa Rica">Costa Rica</option>
                      <option value="Côte d'Ivoire">Côte d'Ivoire</option>
                      <option value="Croatie">Croatie</option>
                      <option value="Cuba">Cuba</option>
                      <option value="Danemark">Danemark</option>
                      <option value="Égypte">Égypte</option>
                      <option value="Émirats Arabes Unis">Émirats Arabes Unis</option>
                      <option value="Équateur">Équateur</option>
                      <option value="Espagne">Espagne</option>
                      <option value="Estonie">Estonie</option>
                      <option value="Éthiopie">Éthiopie</option>
                      <option value="Finlande">Finlande</option>
                      <option value="France">France</option>
                      <option value="Gabon">Gabon</option>
                      <option value="Ghana">Ghana</option>
                      <option value="Grèce">Grèce</option>
                      <option value="Guatemala">Guatemala</option>
                      <option value="Guinée">Guinée</option>
                      <option value="Haïti">Haïti</option>
                      <option value="Honduras">Honduras</option>
                      <option value="Hongrie">Hongrie</option>
                      <option value="Inde">Inde</option>
                      <option value="Indonésie">Indonésie</option>
                      <option value="Iran">Iran</option>
                      <option value="Irak">Irak</option>
                      <option value="Irlande">Irlande</option>
                      <option value="Islande">Islande</option>
                      <option value="Israël">Israël</option>
                      <option value="Italie">Italie</option>
                      <option value="Jamaïque">Jamaïque</option>
                      <option value="Japon">Japon</option>
                      <option value="Jordanie">Jordanie</option>
                      <option value="Kazakhstan">Kazakhstan</option>
                      <option value="Kenya">Kenya</option>
                      <option value="Koweït">Koweït</option>
                      <option value="Laos">Laos</option>
                      <option value="Lettonie">Lettonie</option>
                      <option value="Liban">Liban</option>
                      <option value="Libye">Libye</option>
                      <option value="Liechtenstein">Liechtenstein</option>
                      <option value="Lituanie">Lituanie</option>
                      <option value="Luxembourg">Luxembourg</option>
                      <option value="Macédoine">Macédoine</option>
                      <option value="Madagascar">Madagascar</option>
                      <option value="Malaisie">Malaisie</option>
                      <option value="Mali">Mali</option>
                      <option value="Malte">Malte</option>
                      <option value="Maroc">Maroc</option>
                      <option value="Maurice">Maurice</option>
                      <option value="Mauritanie">Mauritanie</option>
                      <option value="Mexique">Mexique</option>
                      <option value="Moldavie">Moldavie</option>
                      <option value="Monaco">Monaco</option>
                      <option value="Mongolie">Mongolie</option>
                      <option value="Monténégro">Monténégro</option>
                      <option value="Mozambique">Mozambique</option>
                      <option value="Namibie">Namibie</option>
                      <option value="Népal">Népal</option>
                      <option value="Nicaragua">Nicaragua</option>
                      <option value="Niger">Niger</option>
                      <option value="Nigéria">Nigéria</option>
                      <option value="Norvège">Norvège</option>
                      <option value="Nouvelle-Zélande">Nouvelle-Zélande</option>
                      <option value="Oman">Oman</option>
                      <option value="Ouganda">Ouganda</option>
                      <option value="Ouzbékistan">Ouzbékistan</option>
                      <option value="Pakistan">Pakistan</option>
                      <option value="Panama">Panama</option>
                      <option value="Paraguay">Paraguay</option>
                      <option value="Pays-Bas">Pays-Bas</option>
                      <option value="Pérou">Pérou</option>
                      <option value="Philippines">Philippines</option>
                      <option value="Pologne">Pologne</option>
                      <option value="Portugal">Portugal</option>
                      <option value="Qatar">Qatar</option>
                      <option value="Roumanie">Roumanie</option>
                      <option value="Royaume-Uni">Royaume-Uni</option>
                      <option value="Russie">Russie</option>
                      <option value="Rwanda">Rwanda</option>
                      <option value="Sénégal">Sénégal</option>
                      <option value="Serbie">Serbie</option>
                      <option value="Singapour">Singapour</option>
                      <option value="Slovaquie">Slovaquie</option>
                      <option value="Slovénie">Slovénie</option>
                      <option value="Somalie">Somalie</option>
                      <option value="Soudan">Soudan</option>
                      <option value="Sri Lanka">Sri Lanka</option>
                      <option value="Suède">Suède</option>
                      <option value="Suisse">Suisse</option>
                      <option value="Syrie">Syrie</option>
                      <option value="Taïwan">Taïwan</option>
                      <option value="Tanzanie">Tanzanie</option>
                      <option value="Tchad">Tchad</option>
                      <option value="Thaïlande">Thaïlande</option>
                      <option value="Togo">Togo</option>
                      <option value="Tunisie">Tunisie</option>
                      <option value="Turquie">Turquie</option>
                      <option value="Ukraine">Ukraine</option>
                      <option value="Uruguay">Uruguay</option>
                      <option value="Venezuela">Venezuela</option>
                      <option value="Vietnam">Vietnam</option>
                      <option value="Yémen">Yémen</option>
                      <option value="Zambie">Zambie</option>
                      <option value="Zimbabwe">Zimbabwe</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs mb-1 block" style={{color: 'rgba(255,255,255,0.5)'}}>Numéro de téléphone *</label>
                    <input type="tel" value={form.telephone} onChange={e => update('telephone', e.target.value)}
                      className={inputClass} style={inputStyle} />
                  </div>
                  <div>
                    <label className="text-xs mb-1 block" style={{color: 'rgba(255,255,255,0.5)'}}>Langue préférée</label>
                    <select value={form.langue} onChange={e => update('langue', e.target.value)}
                      className={inputClass} style={inputStyle}>
                      <option value="français">Français</option>
                      <option value="anglais">Anglais</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs mb-1 block" style={{color: 'rgba(255,255,255,0.5)'}}>Résidence fiscale *</label>
                    <select value={form.residenceFiscale} onChange={e => update('residenceFiscale', e.target.value)}
                      className={inputClass} style={inputStyle}>
                      <option value="france">France</option>
                      <option value="belgique">Belgique</option>
                      <option value="suisse">Suisse</option>
                      <option value="luxembourg">Luxembourg</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4">Régime fiscal</h2>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.regimeFiscal}
                    onChange={e => update('regimeFiscal', e.target.checked)} className="mt-1" />
                  <span className="text-sm" style={{color: 'rgba(255,255,255,0.6)'}}>
                    Je souhaite être dispensé(e) du prélèvement forfaitaire obligatoire non libératoire de 12,8%.
                  </span>
                </label>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4">Coordonnées bancaires</h2>
                <label className="text-xs mb-1 block" style={{color: 'rgba(255,255,255,0.5)'}}>IBAN *</label>
                <input type="text" placeholder="FR76..." value={form.iban}
                  onChange={e => update('iban', e.target.value)}
                  className={inputClass} style={inputStyle} />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs mb-1 block" style={{color: 'rgba(255,255,255,0.5)'}}>Adresse *</label>
                  <input type="text" value={form.adresse} onChange={e => update('adresse', e.target.value)}
                    className={inputClass} style={inputStyle} />
                </div>
                <div>
                  <label className="text-xs mb-1 block" style={{color: 'rgba(255,255,255,0.5)'}}>Profession *</label>
                  <input type="text" value={form.profession} onChange={e => update('profession', e.target.value)}
                    className={inputClass} style={inputStyle} />
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4">Êtes-vous une personne politiquement exposée ?</h2>
                <select value={form.pep} onChange={e => update('pep', e.target.value)}
                  className={inputClass} style={inputStyle}>
                  <option value="non">Non</option>
                  <option value="oui">Oui</option>
                </select>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4">Niveau de revenus globaux mensuel *</h2>
                <select value={form.revenus} onChange={e => update('revenus', e.target.value)}
                  className={inputClass} style={inputStyle}>
                  <option value="">Sélectionner</option>
                  <option value="moins2000">Moins de 2 000 €</option>
                  <option value="2000-4000">Entre 2 000 € et 4 000 €</option>
                  <option value="4000-8000">Entre 4 000 € et 8 000 €</option>
                  <option value="plus8000">Plus de 8 000 €</option>
                </select>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4">Document d'identité</h2>
                <select value={form.documentType} onChange={e => update('documentType', e.target.value)}
                  className={inputClass} style={{...inputStyle, marginBottom: '1rem'}}>
                  <option value="passeport">Passeport</option>
                  <option value="cni">Carte nationale d'identité</option>
                  <option value="permis">Permis de conduire</option>
                </select>
                <input type="text" placeholder="Numéro de document *" value={form.documentNumero}
                  onChange={e => update('documentNumero', e.target.value)}
                  className={inputClass} style={{...inputStyle, marginBottom: '1rem'}} />
                <div className="rounded-xl p-8 text-center text-sm cursor-pointer"
                  style={{border: '2px dashed rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.4)'}}>
                  📎 Cliquez pour uploader votre pièce d'identité
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
                style={{backgroundColor: '#00E5CC', color: '#0D0D2B', opacity: loading ? 0.7 : 1}}>
                {loading ? 'Enregistrement...' : 'Valider →'}
              </button>
            </>
          )}

          {step === 2 && (
            <div className="space-y-8">
              <h2 className="text-xl font-bold">Paiement</h2>
              <p className="text-sm" style={{color: 'rgba(255,255,255,0.5)'}}>
                Veuillez effectuer un virement bancaire vers le compte suivant en indiquant votre référence de dossier.
              </p>
              <div className="rounded-2xl p-6 space-y-4 text-sm" style={{backgroundColor: '#1E1B4B'}}>
                {[
                  { label: 'Bénéficiaire', value: 'Pony Finance SA' },
                  { label: 'IBAN', value: 'FR76 XXXX XXXX XXXX XXXX' },
                  { label: 'Référence', value: `PONY-${investorId.slice(0, 8).toUpperCase()}` },
                  { label: 'Montant', value: `${amount.toLocaleString('fr-FR')},00 €` },
                ].map((row, i) => (
                  <div key={i} className="flex justify-between">
                    <span style={{color: 'rgba(255,255,255,0.4)'}}>{row.label}</span>
                    <span className="font-bold">{row.value}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs" style={{color: 'rgba(255,255,255,0.3)'}}>
                Une fois le virement reçu, votre investissement sera confirmé sous 2–3 jours ouvrés.
              </p>
              <button onClick={() => setStep(3)}
                className="w-full py-4 rounded-xl font-bold text-sm"
                style={{backgroundColor: '#00E5CC', color: '#0D0D2B'}}>
                J'ai effectué le virement →
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-16 space-y-6">
              <div className="text-6xl">🎉</div>
              <h2 className="text-2xl font-bold">Investissement confirmé !</h2>
              <p className="text-sm max-w-md mx-auto" style={{color: 'rgba(255,255,255,0.5)'}}>
                Merci pour votre confiance. Votre investissement sera activé dès réception de votre virement.
              </p>
              <Link href="/dashboard"
                className="inline-block px-8 py-3 rounded-xl text-sm font-bold"
                style={{backgroundColor: '#00E5CC', color: '#0D0D2B'}}>
                Voir mon portfolio →
              </Link>
            </div>
          )}
        </div>

        {step < 3 && (
          <div className="rounded-2xl p-6 h-fit sticky top-8" style={{backgroundColor: '#1E1B4B'}}>
            <h3 className="font-bold mb-5">Résumé</h3>
            <div className="space-y-4 text-sm">
              {[
                { label: 'Total', value: `${amount.toLocaleString('fr-FR')},00 €`, large: true },
                { label: "Taux d'intérêt", value: `${(rate * 100).toFixed(0)} %` },
                { label: 'Durée', value: `${duration} mois` },
                { label: 'Remboursement total', value: `${totalRepaid.toLocaleString('fr-FR', {maximumFractionDigits: 0})} €` },
                { label: 'Mensualité', value: `${monthlyInterest.toFixed(2).replace('.', ',')} €` },
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
      <main className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#0D0D2B'}}>
        <p style={{color: '#00E5CC'}}>Chargement...</p>
      </main>
    }>
      <InvestirForm />
    </Suspense>
  )
}