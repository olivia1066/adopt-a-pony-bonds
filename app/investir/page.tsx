'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Investir() {
  const [step, setStep] = useState(1)
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

  const inputClass = "w-full rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-1"
  const inputStyle = {backgroundColor: '#1E1B4B', border: '1px solid rgba(255,255,255,0.1)'}
  const focusStyle = {ringColor: '#00E5CC'}

  return (
    <main className="min-h-screen font-sans" style={{backgroundColor: '#0D0D2B', color: 'white'}}>

      {/* Header */}
      <header className="flex justify-between items-center px-8 py-5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-xl">🐴</span>
          <Link href="/" className="font-bold" style={{color: '#00E5CC'}}>pony</Link>
        </div>
        <Link href="/campagne" className="text-sm hover:opacity-70" style={{color: 'rgba(255,255,255,0.5)'}}>
          ← Retour à la campagne
        </Link>
      </header>

      {/* Stepper */}
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
                    <label className="text-xs mb-1 block" style={{color: 'rgba(255,255,255,0.5)'}}>Prénom</label>
                    <input type="text" value={form.prenom} onChange={e => update('prenom', e.target.value)}
                      className={inputClass} style={inputStyle} />
                  </div>
                  <div>
                    <label className="text-xs mb-1 block" style={{color: 'rgba(255,255,255,0.5)'}}>Nom</label>
                    <input type="text" value={form.nom} onChange={e => update('nom', e.target.value)}
                      className={inputClass} style={inputStyle} />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs mb-1 block" style={{color: 'rgba(255,255,255,0.5)'}}>Email</label>
                    <input type="email" value={form.email} onChange={e => update('email', e.target.value)}
                      className={inputClass} style={inputStyle} />
                  </div>
                  <div>
                    <label className="text-xs mb-1 block" style={{color: 'rgba(255,255,255,0.5)'}}>Lieu de naissance</label>
                    <input type="text" value={form.lieuNaissance} onChange={e => update('lieuNaissance', e.target.value)}
                      className={inputClass} style={inputStyle} />
                  </div>
                  <div>
                    <label className="text-xs mb-1 block" style={{color: 'rgba(255,255,255,0.5)'}}>Date de naissance</label>
                    <input type="date" value={form.dateNaissance} onChange={e => update('dateNaissance', e.target.value)}
                      className={inputClass} style={inputStyle} />
                  </div>
                  <div>
                    <label className="text-xs mb-1 block" style={{color: 'rgba(255,255,255,0.5)'}}>Nationalité</label>
                    <select value={form.nationalite} onChange={e => update('nationalite', e.target.value)}
                      className={inputClass} style={inputStyle}>
                      <option value="">Veuillez faire un choix</option>
                      <option value="française">Française</option>
                      <option value="belge">Belge</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs mb-1 block" style={{color: 'rgba(255,255,255,0.5)'}}>Numéro de téléphone</label>
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
                    <label className="text-xs mb-1 block" style={{color: 'rgba(255,255,255,0.5)'}}>Résidence fiscale</label>
                    <select value={form.residenceFiscale} onChange={e => update('residenceFiscale', e.target.value)}
                      className={inputClass} style={inputStyle}>
                      <option value="france">France</option>
                      <option value="belgique">Belgique</option>
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
                    Je souhaite être dispensé(e) du prélèvement forfaitaire obligatoire non libératoire de 12,8% (barème progressif).
                  </span>
                </label>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4">Coordonnées bancaires</h2>
                <label className="text-xs mb-1 block" style={{color: 'rgba(255,255,255,0.5)'}}>
                  IBAN du compte bancaire sur lequel vous souhaitez percevoir vos remboursements
                </label>
                <input type="text" placeholder="FR76..." value={form.iban}
                  onChange={e => update('iban', e.target.value)}
                  className={inputClass} style={{...inputStyle, color: 'white'}} />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs mb-1 block" style={{color: 'rgba(255,255,255,0.5)'}}>Adresse</label>
                  <input type="text" value={form.adresse} onChange={e => update('adresse', e.target.value)}
                    className={inputClass} style={inputStyle} />
                </div>
                <div>
                  <label className="text-xs mb-1 block" style={{color: 'rgba(255,255,255,0.5)'}}>Profession</label>
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
                <h2 className="text-xl font-bold mb-4">Niveau de revenus globaux mensuel</h2>
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
                <input type="text" placeholder="Numéro de document" value={form.documentNumero}
                  onChange={e => update('documentNumero', e.target.value)}
                  className={inputClass} style={{...inputStyle, marginBottom: '1rem'}} />
                <div className="rounded-xl p-8 text-center text-sm cursor-pointer"
                  style={{border: '2px dashed rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.4)'}}>
                  📎 Cliquez pour uploader votre pièce d'identité
                </div>
              </div>

              <button onClick={() => setStep(2)}
                className="w-full py-4 rounded-xl font-bold text-sm transition-colors"
                style={{backgroundColor: '#00E5CC', color: '#0D0D2B'}}>
                Valider →
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
                  { label: 'Référence', value: 'PONY-2026-XXXX' },
                  { label: 'Montant', value: '5 000,00 €' },
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

        {/* Summary card */}
        {step < 3 && (
          <div className="rounded-2xl p-6 h-fit sticky top-8" style={{backgroundColor: '#1E1B4B'}}>
            <h3 className="font-bold mb-5">Résumé</h3>
            <div className="space-y-4 text-sm">
              {[
                { label: 'Total', value: '5 000,00 €', large: true },
                { label: 'Taux d\'intérêt', value: '7 %' },
                { label: 'Durée', value: '24 mois' },
                { label: 'Remboursement total', value: '5 700,00 €' },
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
            <div className="mt-5 pt-5" style={{borderTop: '1px solid rgba(255,255,255,0.1)'}}>
              <input type="text" placeholder="Code promo"
                className="w-full rounded-xl px-4 py-2 text-sm"
                style={{backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white'}} />
            </div>
          </div>
        )}
      </div>
    </main>
  )
}