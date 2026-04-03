'use client'

import { useState } from 'react'
import Link from 'next/link'

const campaigns = [
  { id: 'C001', name: 'Flotte Printemps 2026', target: 500000, raised: 312000, rate: 7, duration: 24, status: 'Ouverte', startDate: '2026-04-01' },
  { id: 'C002', name: 'Flotte Été 2026', target: 500000, raised: 0, rate: 8, duration: 36, status: 'À venir', startDate: '2026-06-01' },
]

const investors = [
  {
    id: 'PONY-2026-001',
    prenom: 'Olivia',
    nom: 'Bally',
    email: 'olivia.bally@yahoo.fr',
    telephone: '0766774973',
    dateNaissance: '19.05.1997',
    lieuNaissance: 'Bruxelles',
    nationalite: 'Française',
    residenceFiscale: 'France',
    adresse: '12 rue de la Paix, Paris',
    profession: 'Performance and Strategy Manager',
    revenus: 'Entre 4 000 € et 8 000 €',
    pep: 'Non',
    documentType: 'Passeport',
    documentNumero: 'XX123456',
    iban: 'FR76 XXXX XXXX XXXX',
    kyc: 'En attente',
    montant: 5000,
    campagne: 'Flotte Printemps 2026',
    statut: 'Actif',
  },
  {
    id: 'PONY-2026-002',
    prenom: 'Jean',
    nom: 'Dupont',
    email: 'jean.dupont@gmail.com',
    telephone: '0612345678',
    dateNaissance: '15.03.1985',
    lieuNaissance: 'Paris',
    nationalite: 'Française',
    residenceFiscale: 'France',
    adresse: '5 avenue Victor Hugo, Lyon',
    profession: 'Ingénieur',
    revenus: 'Plus de 8 000 €',
    pep: 'Non',
    documentType: 'Carte nationale d\'identité',
    documentNumero: 'YY789012',
    iban: 'FR76 YYYY YYYY YYYY',
    kyc: 'Validé',
    montant: 2000,
    campagne: 'Flotte Été 2026',
    statut: 'En attente',
  },
]

const payments = [
  { id: 1, investor: 'Olivia Bally', campagne: 'Flotte Printemps 2026', type: 'Intérêts', montant: 29.17, date: '01/05/2026', statut: 'À envoyer' },
  { id: 2, investor: 'Olivia Bally', campagne: 'Flotte Printemps 2026', type: 'Intérêts', montant: 29.17, date: '01/06/2026', statut: 'À envoyer' },
  { id: 3, investor: 'Jean Dupont', campagne: 'Flotte Été 2026', type: 'Intérêts', montant: 13.33, date: '01/06/2026', statut: 'À envoyer' },
  { id: 4, investor: 'Olivia Bally', campagne: 'Flotte Printemps 2026', type: 'Remboursement capital', montant: 5000, date: '01/04/2028', statut: 'À envoyer' },
]

export default function Admin() {
  const [activeTab, setActiveTab] = useState('campagnes')
  const [selectedInvestor, setSelectedInvestor] = useState<typeof investors[0] | null>(null)
  const [showNewCampaign, setShowNewCampaign] = useState(false)
  const [kycStatuses, setKycStatuses] = useState<Record<string, string>>(
    Object.fromEntries(investors.map(i => [i.id, i.kyc]))
  )
  const [paymentStatuses, setPaymentStatuses] = useState<Record<number, string>>(
    Object.fromEntries(payments.map(p => [p.id, p.statut]))
  )
  const [newCampaign, setNewCampaign] = useState({
    name: '', target: '', rate: '', duration: '', startDate: ''
  })

  return (
    <main className="min-h-screen font-sans" style={{backgroundColor: '#0D0D2B', color: 'white'}}>

      {/* Header */}
      <header className="flex justify-between items-center px-8 py-5 border-b border-white/10">
        <div className="flex items-center gap-4">
          <span className="text-xl">🐴</span>
          <span className="font-bold" style={{color: '#00E5CC'}}>pony</span>
          <span className="text-xs px-2 py-1 rounded-full font-medium"
            style={{backgroundColor: 'rgba(255,200,0,0.15)', color: '#FFC800'}}>
            Admin
          </span>
        </div>
        <Link href="/" className="text-sm hover:opacity-70" style={{color: 'rgba(255,255,255,0.5)'}}>
          ← Retour au site
        </Link>
      </header>

      <div className="max-w-6xl mx-auto px-8 py-10">

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-1">Panel Admin</h1>
          <p className="text-sm" style={{color: 'rgba(255,255,255,0.4)'}}>Gérez les campagnes, investisseurs et paiements</p>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Campagnes actives', value: '1' },
            { label: 'Total investisseurs', value: investors.length.toString() },
            { label: 'KYC en attente', value: Object.values(kycStatuses).filter(s => s === 'En attente').length.toString() },
            { label: 'Total collecté', value: '314 000 €' },
          ].map((kpi, i) => (
            <div key={i} className="rounded-2xl p-5" style={{backgroundColor: '#1E1B4B'}}>
              <p className="text-xs mb-2" style={{color: 'rgba(255,255,255,0.4)'}}>{kpi.label}</p>
              <p className="text-2xl font-bold" style={{color: i === 2 && kpi.value !== '0' ? '#FFC800' : '#00E5CC'}}>{kpi.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-6 mb-8 border-b border-white/10">
          {['campagnes', 'investisseurs', 'paiements'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="pb-3 text-sm font-medium capitalize transition-colors"
              style={{
                color: activeTab === tab ? '#00E5CC' : 'rgba(255,255,255,0.4)',
                borderBottom: activeTab === tab ? '2px solid #00E5CC' : '2px solid transparent',
              }}
            >
              {tab === 'campagnes' ? 'Campagnes' : tab === 'investisseurs' ? 'Investisseurs' : 'Paiements'}
            </button>
          ))}
        </div>

        {/* CAMPAGNES TAB */}
        {activeTab === 'campagnes' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Campagnes</h2>
              <button
                onClick={() => setShowNewCampaign(!showNewCampaign)}
                className="text-sm px-4 py-2 rounded-xl font-bold"
                style={{backgroundColor: '#00E5CC', color: '#0D0D2B'}}>
                + Nouvelle campagne
              </button>
            </div>

            {/* New campaign form */}
            {showNewCampaign && (
              <div className="rounded-2xl p-6 mb-6" style={{backgroundColor: '#1E1B4B', border: '1px solid rgba(0,229,204,0.3)'}}>
                <h3 className="font-bold mb-4" style={{color: '#00E5CC'}}>Nouvelle campagne</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Nom', key: 'name', placeholder: 'Flotte Automne 2026' },
                    { label: 'Objectif (€)', key: 'target', placeholder: '500000' },
                    { label: 'Taux (%)', key: 'rate', placeholder: '7' },
                    { label: 'Durée (mois)', key: 'duration', placeholder: '24' },
                    { label: 'Date de début', key: 'startDate', placeholder: '2026-09-01' },
                  ].map(field => (
                    <div key={field.key}>
                      <label className="text-xs mb-1 block" style={{color: 'rgba(255,255,255,0.5)'}}>{field.label}</label>
                      <input
                        type="text"
                        placeholder={field.placeholder}
                        value={newCampaign[field.key as keyof typeof newCampaign]}
                        onChange={e => setNewCampaign(prev => ({...prev, [field.key]: e.target.value}))}
                        className="w-full rounded-xl px-4 py-3 text-sm text-white"
                        style={{backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)'}}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 mt-4">
                  <button className="px-6 py-2 rounded-xl text-sm font-bold"
                    style={{backgroundColor: '#00E5CC', color: '#0D0D2B'}}>
                    Créer la campagne
                  </button>
                  <button onClick={() => setShowNewCampaign(false)}
                    className="px-6 py-2 rounded-xl text-sm"
                    style={{backgroundColor: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)'}}>
                    Annuler
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {campaigns.map(c => (
                <div key={c.id} className="rounded-2xl p-6" style={{backgroundColor: '#1E1B4B'}}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs px-2 py-1 rounded-full font-medium"
                          style={{
                            backgroundColor: c.status === 'Ouverte' ? 'rgba(0,229,204,0.15)' : 'rgba(255,255,255,0.1)',
                            color: c.status === 'Ouverte' ? '#00E5CC' : 'rgba(255,255,255,0.5)',
                          }}>
                          {c.status}
                        </span>
                        <span className="text-xs" style={{color: 'rgba(255,255,255,0.3)'}}>{c.id}</span>
                      </div>
                      <h3 className="font-bold text-lg">{c.name}</h3>
                    </div>
                    {c.status === 'Ouverte' && (
                      <button className="text-sm px-4 py-2 rounded-xl"
                        style={{backgroundColor: 'rgba(255,100,100,0.15)', color: '#FF6464'}}>
                        Clôturer
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-4 gap-4 text-sm mb-4">
                    {[
                      { label: 'Taux', value: `${c.rate}%` },
                      { label: 'Durée', value: `${c.duration} mois` },
                      { label: 'Objectif', value: `${c.target.toLocaleString('fr-FR')} €` },
                      { label: 'Collecté', value: `${c.raised.toLocaleString('fr-FR')} €` },
                    ].map((stat, i) => (
                      <div key={i}>
                        <p className="text-xs mb-1" style={{color: 'rgba(255,255,255,0.4)'}}>{stat.label}</p>
                        <p className="font-bold">{stat.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="w-full rounded-full h-1.5" style={{backgroundColor: 'rgba(255,255,255,0.1)'}}>
                    <div className="h-1.5 rounded-full" style={{
                      width: `${(c.raised / c.target) * 100}%`,
                      backgroundColor: '#00E5CC'
                    }}></div>
                  </div>
                  <p className="text-xs mt-1" style={{color: 'rgba(255,255,255,0.3)'}}>
                    {((c.raised / c.target) * 100).toFixed(0)}% financé
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* INVESTISSEURS TAB */}
        {activeTab === 'investisseurs' && (
          <div>
            <h2 className="text-xl font-bold mb-6">Investisseurs</h2>
            <div className="space-y-4">
              {investors.map(inv => (
                <div key={inv.id} className="rounded-2xl p-6" style={{backgroundColor: '#1E1B4B'}}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs px-2 py-1 rounded-full font-medium"
                          style={{
                            backgroundColor: kycStatuses[inv.id] === 'Validé' ? 'rgba(0,229,204,0.15)' :
                              kycStatuses[inv.id] === 'Rejeté' ? 'rgba(255,100,100,0.15)' : 'rgba(255,200,0,0.15)',
                            color: kycStatuses[inv.id] === 'Validé' ? '#00E5CC' :
                              kycStatuses[inv.id] === 'Rejeté' ? '#FF6464' : '#FFC800',
                          }}>
                          KYC: {kycStatuses[inv.id]}
                        </span>
                        <span className="text-xs" style={{color: 'rgba(255,255,255,0.3)'}}>{inv.id}</span>
                      </div>
                      <h3 className="font-bold text-lg">{inv.prenom} {inv.nom}</h3>
                      <p className="text-sm" style={{color: 'rgba(255,255,255,0.4)'}}>{inv.email} · {inv.telephone}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">{inv.montant.toLocaleString('fr-FR')} €</p>
                      <p className="text-xs" style={{color: 'rgba(255,255,255,0.4)'}}>{inv.campagne}</p>
                    </div>
                  </div>

                  {/* KYC Details */}
                  <div className="grid grid-cols-3 gap-3 text-sm mb-4 p-4 rounded-xl"
                    style={{backgroundColor: 'rgba(255,255,255,0.03)'}}>
                    {[
                      { label: 'Date de naissance', value: inv.dateNaissance },
                      { label: 'Lieu de naissance', value: inv.lieuNaissance },
                      { label: 'Nationalité', value: inv.nationalite },
                      { label: 'Résidence fiscale', value: inv.residenceFiscale },
                      { label: 'Adresse', value: inv.adresse },
                      { label: 'Profession', value: inv.profession },
                      { label: 'Revenus mensuels', value: inv.revenus },
                      { label: 'PEP', value: inv.pep },
                      { label: 'Document', value: `${inv.documentType} — ${inv.documentNumero}` },
                      { label: 'IBAN', value: inv.iban },
                    ].map((field, i) => (
                      <div key={i}>
                        <p className="text-xs mb-0.5" style={{color: 'rgba(255,255,255,0.3)'}}>{field.label}</p>
                        <p style={{color: 'rgba(255,255,255,0.8)'}}>{field.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* KYC Actions */}
                  {kycStatuses[inv.id] === 'En attente' && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => setKycStatuses(prev => ({...prev, [inv.id]: 'Validé'}))}
                        className="px-5 py-2 rounded-xl text-sm font-bold"
                        style={{backgroundColor: 'rgba(0,229,204,0.15)', color: '#00E5CC'}}>
                        ✓ Valider le KYC
                      </button>
                      <button
                        onClick={() => setKycStatuses(prev => ({...prev, [inv.id]: 'Rejeté'}))}
                        className="px-5 py-2 rounded-xl text-sm font-bold"
                        style={{backgroundColor: 'rgba(255,100,100,0.15)', color: '#FF6464'}}>
                        ✗ Rejeter
                      </button>
                    </div>
                  )}
                  {kycStatuses[inv.id] === 'Validé' && (
                    <p className="text-sm font-medium" style={{color: '#00E5CC'}}>✓ KYC validé</p>
                  )}
                  {kycStatuses[inv.id] === 'Rejeté' && (
                    <p className="text-sm font-medium" style={{color: '#FF6464'}}>✗ KYC rejeté</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PAIEMENTS TAB */}
        {activeTab === 'paiements' && (
          <div>
            <h2 className="text-xl font-bold mb-6">Paiements</h2>
            <div className="rounded-2xl overflow-hidden" style={{backgroundColor: '#1E1B4B'}}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{borderBottom: '1px solid rgba(255,255,255,0.1)'}}>
                    {['Date', 'Investisseur', 'Campagne', 'Type', 'Montant', 'Statut', 'Action'].map((h, i) => (
                      <th key={i} className={`px-6 py-4 text-xs font-medium ${i >= 4 ? 'text-right' : 'text-left'}`}
                        style={{color: 'rgba(255,255,255,0.4)'}}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {payments.map(p => (
                    <tr key={p.id} style={{borderBottom: '1px solid rgba(255,255,255,0.05)'}}>
                      <td className="px-6 py-4">{p.date}</td>
                      <td className="px-6 py-4" style={{color: 'rgba(255,255,255,0.7)'}}>{p.investor}</td>
                      <td className="px-6 py-4" style={{color: 'rgba(255,255,255,0.5)'}}>{p.campagne}</td>
                      <td className="px-6 py-4" style={{color: 'rgba(255,255,255,0.5)'}}>{p.type}</td>
                      <td className="px-6 py-4 text-right font-bold" style={{color: '#00E5CC'}}>
                        +{p.montant.toFixed(2).replace('.', ',')} €
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-xs px-2 py-1 rounded-full"
                          style={{
                            backgroundColor: paymentStatuses[p.id] === 'Envoyé' ? 'rgba(0,229,204,0.15)' : 'rgba(255,200,0,0.15)',
                            color: paymentStatuses[p.id] === 'Envoyé' ? '#00E5CC' : '#FFC800',
                          }}>
                          {paymentStatuses[p.id]}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {paymentStatuses[p.id] === 'À envoyer' && (
                          <button
                            onClick={() => setPaymentStatuses(prev => ({...prev, [p.id]: 'Envoyé'}))}
                            className="text-xs px-3 py-1 rounded-xl font-medium"
                            style={{backgroundColor: 'rgba(0,229,204,0.15)', color: '#00E5CC'}}>
                            Marquer envoyé
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}