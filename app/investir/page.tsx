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

  return (
    <main className="min-h-screen bg-white font-sans">
      <header className="flex justify-between items-center px-8 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🐴</span>
          <Link href="/" className="font-bold text-lg">Adopt a Pony</Link>
        </div>
        <Link href="/campagne" className="text-sm text-gray-500 hover:text-black">← Retour à la campagne</Link>
      </header>

      <div className="flex justify-center items-center gap-4 py-8">
        {[1, 2, 3].map(s => (
          <div key={s} className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${step === s ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}>
              {s}
            </div>
            <span className={`text-sm ${step === s ? 'font-bold' : 'text-gray-400'}`}>
              {s === 1 ? 'Confirmation' : s === 2 ? 'Paiement' : 'Terminé'}
            </span>
            {s < 3 && <div className="w-16 h-px bg-gray-200" />}
          </div>
        ))}
      </div>

      <div className="max-w-5xl mx-auto px-8 pb-16 grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-8">
          {step === 1 && (
            <>
              <div>
                <h2 className="text-xl font-bold mb-4">Type de compte</h2>
                <select value={form.type} onChange={e => update('type', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm">
                  <option value="individuel">Individuel (personne physique)</option>
                  <option value="entreprise">Entreprise (personne morale)</option>
                </select>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4">Informations personnelles</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Prénom</label>
                    <input type="text" value={form.prenom} onChange={e => update('prenom', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Nom</label>
                    <input type="text" value={form.nom} onChange={e => update('nom', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm" />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs text-gray-500 mb-1 block">Email</label>
                    <input type="email" value={form.email} onChange={e => update('email', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Lieu de naissance</label>
                    <input type="text" value={form.lieuNaissance} onChange={e => update('lieuNaissance', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Date de naissance</label>
                    <input type="date" value={form.dateNaissance} onChange={e => update('dateNaissance', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Nationalité</label>
                    <select value={form.nationalite} onChange={e => update('nationalite', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm">
                      <option value="">Veuillez faire un choix</option>
                      <option value="française">Française</option>
                      <option value="belge">Belge</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Numéro de téléphone</label>
                    <input type="tel" value={form.telephone} onChange={e => update('telephone', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Langue préférée</label>
                    <select value={form.langue} onChange={e => update('langue', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm">
                      <option value="français">Français</option>
                      <option value="anglais">Anglais</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Résidence fiscale</label>
                    <select value={form.residenceFiscale} onChange={e => update('residenceFiscale', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm">
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
                  <input type="checkbox" checked={form.regimeFiscal} onChange={e => update('regimeFiscal', e.target.checked)} className="mt-1" />
                  <span className="text-sm text-gray-600">Je souhaite être dispensé(e) du prélèvement forfaitaire obligatoire non libératoire de 12,8% (barème progressif).</span>
                </label>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4">Coordonnées bancaires</h2>
                <label className="text-xs text-gray-500 mb-1 block">IBAN du compte bancaire sur lequel vous souhaitez percevoir vos remboursements</label>
                <input type="text" placeholder="FR76..." value={form.iban} onChange={e => update('iban', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm" />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Adresse</label>
                  <input type="text" value={form.adresse} onChange={e => update('adresse', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Profession</label>
                  <input type="text" value={form.profession} onChange={e => update('profession', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm" />
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4">Êtes-vous une personne politiquement exposée ?</h2>
                <select value={form.pep} onChange={e => update('pep', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm">
                  <option value="non">Non</option>
                  <option value="oui">Oui</option>
                </select>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4">Niveau de revenus globaux mensuel</h2>
                <select value={form.revenus} onChange={e => update('revenus', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm">
                  <option value="">Sélectionner</option>
                  <option value="moins2000">Moins de 2 000 €</option>
                  <option value="2000-4000">Entre 2 000 € et 4 000 €</option>
                  <option value="4000-8000">Entre 4 000 € et 8 000 €</option>
                  <option value="plus8000">Plus de 8 000 €</option>
                </select>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4">Document d'identité</h2>
                <select value={form.documentType} onChange={e => update('documentType', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm mb-4">
                  <option value="passeport">Passeport</option>
                  <option value="cni">Carte nationale d'identité</option>
                  <option value="permis">Permis de conduire</option>
                </select>
                <input type="text" placeholder="Numéro de document" value={form.documentNumero} onChange={e => update('documentNumero', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm mb-4" />
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center text-sm text-gray-400 cursor-pointer hover:border-gray-400">
                  📎 Cliquez pour uploader votre pièce d'identité
                </div>
              </div>

              <button onClick={() => setStep(2)} className="w-full bg-black text-white py-4 rounded-full font-bold text-sm hover:bg-gray-800">
                Valider →
              </button>
            </>
          )}

          {step === 2 && (
            <div className="space-y-8">
              <h2 className="text-xl font-bold">Paiement</h2>
              <p className="text-gray-500 text-sm">Veuillez effectuer un virement bancaire vers le compte suivant en indiquant votre référence de dossier.</p>
              <div className="bg-gray-50 rounded-2xl p-6 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Bénéficiaire</span>
                  <span className="font-bold">Pony Finance SA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">IBAN</span>
                  <span className="font-mono font-bold">FR76 XXXX XXXX XXXX XXXX</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Référence</span>
                  <span className="font-bold">PONY-2026-XXXX</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Montant</span>
                  <span className="font-bold">5 000,00 €</span>
                </div>
              </div>
              <p className="text-xs text-gray-400">Une fois le virement reçu, votre investissement sera confirmé sous 2–3 jours ouvrés.</p>
              <button onClick={() => setStep(3)} className="w-full bg-black text-white py-4 rounded-full font-bold text-sm hover:bg-gray-800">
                J'ai effectué le virement →
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-16 space-y-6">
              <div className="text-6xl">🎉</div>
              <h2 className="text-2xl font-bold">Investissement confirmé !</h2>
              <p className="text-gray-500 text-sm max-w-md mx-auto">Merci pour votre confiance. Votre investissement sera activé dès réception de votre virement. Vous recevrez un email de confirmation.</p>
              <Link href="/dashboard" className="inline-block bg-black text-white px-8 py-3 rounded-full text-sm font-bold hover:bg-gray-800">
                Voir mon portfolio →
              </Link>
            </div>
          )}
        </div>

        {step < 3 && (
          <div className="bg-gray-900 text-white rounded-2xl p-6 h-fit sticky top-8">
            <h3 className="font-bold mb-4">Résumé</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Total</span>
                <span className="font-bold text-lg">5 000,00 €</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Taux d'intérêt</span>
                <span className="font-bold">7 %</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Durée</span>
                <span className="font-bold">24 mois</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Remboursement total</span>
                <span className="font-bold">5 700,00 €</span>
              </div>
            </div>
            <div className="mt-4 border-t border-gray-700 pt-4">
              <input type="text" placeholder="Code promo" className="w-full bg-gray-800 text-white rounded-xl px-4 py-2 text-sm placeholder-gray-500" />
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
