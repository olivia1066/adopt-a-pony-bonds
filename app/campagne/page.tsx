'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Campagne() {
  const [amount, setAmount] = useState(5000)
  const [duration, setDuration] = useState(24)

  const rate = duration === 12 ? 0.06 : duration === 24 ? 0.07 : duration === 36 ? 0.08 : 0.09
  const monthlyInterest = (amount * rate) / 12
  const totalRepaid = amount + amount * rate * (duration / 12)

  return (
    <main className="min-h-screen font-sans" style={{backgroundColor: '#0D0D2B', color: 'white'}}>

      {/* Header */}
      <header className="flex justify-between items-center px-8 py-5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-xl">🐴</span>
          <Link href="/" className="font-bold" style={{color: '#00E5CC'}}>pony</Link>
        </div>
        <div className="flex gap-4 items-center">
          <Link href="/dashboard"
            className="text-sm px-4 py-2 rounded-xl border transition-colors"
            style={{borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.6)'}}>
            Mes investissements
          </Link>
        </div>
      </header>

      {/* Back */}
      <div className="px-8 py-4">
        <Link href="/" className="text-sm hover:opacity-70" style={{color: 'rgba(255,255,255,0.4)'}}>
          ← Retour aux campagnes
        </Link>
      </div>

      {/* Hero */}
      <div className="relative mx-8 rounded-3xl overflow-hidden h-80 mb-0"
        style={{background: 'linear-gradient(135deg, #1E1B4B 0%, #0D0D2B 100%)'}}>
        <div className="absolute inset-0 flex items-end p-8">
          <div>
            <div className="flex gap-2 mb-4">
              <span className="text-xs px-3 py-1 rounded-full font-medium"
                style={{backgroundColor: 'rgba(0,229,204,0.15)', color: '#00E5CC'}}>
                🛴 Flotte urbaine
              </span>
              <span className="text-xs px-3 py-1 rounded-full font-medium"
                style={{backgroundColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)'}}>
                📍 Paris & Lyon
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white">
              Sponsorisez la flotte<br />Pony Printemps 2026
            </h1>
          </div>
        </div>

        {/* Stats card */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 rounded-2xl p-6 w-72"
          style={{backgroundColor: 'rgba(13,13,43,0.9)', border: '1px solid rgba(255,255,255,0.1)'}}>
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium" style={{color: 'rgba(255,255,255,0.5)'}}>Statut</span>
            <span className="text-xs px-3 py-1 rounded-full font-medium"
              style={{backgroundColor: 'rgba(0,229,204,0.15)', color: '#00E5CC'}}>
              🟢 En cours
            </span>
          </div>
          <div className="space-y-3 mb-4">
            {[
              { label: "Taux d'intérêt", value: '6 – 9 %' },
              { label: 'Durée', value: '12 à 48 mois' },
              { label: 'Remboursement', value: 'À terme' },
            ].map((row, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span style={{color: 'rgba(255,255,255,0.4)'}}>{row.label}</span>
                <span className="font-bold">{row.value}</span>
              </div>
            ))}
          </div>
          <div className="mb-1">
            <div className="w-full rounded-full h-1.5" style={{backgroundColor: 'rgba(255,255,255,0.1)'}}>
              <div className="h-1.5 rounded-full" style={{width: '62%', backgroundColor: '#00E5CC'}}></div>
            </div>
          </div>
          <div className="flex justify-between text-xs mb-3" style={{color: 'rgba(255,255,255,0.4)'}}>
            <span>312 000 € financés</span>
            <span>500 000 €</span>
          </div>
          <div className="text-xs flex items-center gap-1" style={{color: 'rgba(255,255,255,0.4)'}}>
            🛡️ Capital protégé par la flotte
          </div>
        </div>
      </div>

      {/* Simulator */}
      <div className="mx-8 mt-4 grid grid-cols-2 rounded-3xl overflow-hidden"
        style={{border: '1px solid rgba(255,255,255,0.1)'}}>

        {/* Left */}
        <div className="p-8" style={{backgroundColor: '#1E1B4B'}}>
          <h2 className="text-xl font-bold mb-6">Je veux investir</h2>

          <div className="rounded-xl px-4 py-3 text-2xl font-bold text-center mb-3"
            style={{backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)'}}>
            €{amount.toLocaleString('fr-FR')}
          </div>

          <input
            type="range" min={500} max={50000} step={500} value={amount}
            onChange={e => setAmount(Number(e.target.value))}
            className="w-full mb-1"
            style={{accentColor: '#00E5CC'}}
          />
          <div className="flex justify-between text-xs mb-6" style={{color: 'rgba(255,255,255,0.4)'}}>
            <span>500 €</span>
            <span>50 000 €</span>
          </div>

          <h3 className="font-bold mb-3">Pendant</h3>
          <div className="grid grid-cols-4 gap-2">
            {[12, 24, 36, 48].map(d => (
              <button
                key={d}
                onClick={() => setDuration(d)}
                className="py-2 rounded-xl text-sm font-medium transition-all"
                style={{
                  backgroundColor: duration === d ? '#00E5CC' : 'rgba(255,255,255,0.05)',
                  color: duration === d ? '#0D0D2B' : 'rgba(255,255,255,0.6)',
                  border: duration === d ? 'none' : '1px solid rgba(255,255,255,0.1)',
                }}
              >
                {d} mois
              </button>
            ))}
          </div>

          <div className="mt-6 flex gap-4 text-xs" style={{color: 'rgba(255,255,255,0.3)'}}>
            <span className="underline cursor-pointer hover:opacity-70">Information fiscale</span>
            <span className="underline cursor-pointer hover:opacity-70">Note d'investissement</span>
          </div>
        </div>

        {/* Right */}
        <div className="p-8 flex flex-col justify-between" style={{backgroundColor: '#0D0D2B'}}>
          <div>
            <div className="mb-8">
              <p className="text-sm mb-1" style={{color: 'rgba(255,255,255,0.4)'}}>Vous recevez</p>
              <p className="text-5xl font-bold" style={{color: '#00E5CC'}}>
                {monthlyInterest.toFixed(2).replace('.', ',')} €
              </p>
              <p className="text-sm mt-1" style={{color: 'rgba(255,255,255,0.4)'}}>par mois</p>
            </div>
            <div>
              <p className="text-sm mb-1" style={{color: 'rgba(255,255,255,0.4)'}}>Total remboursé</p>
              <p className="text-2xl font-bold">
                {totalRepaid.toLocaleString('fr-FR', {minimumFractionDigits: 2, maximumFractionDigits: 2})} €
              </p>
            </div>
            <div className="mt-4 text-xs cursor-pointer hover:opacity-70"
              style={{color: 'rgba(255,255,255,0.3)'}}>
              📅 Calendrier des paiements
            </div>
          </div>

          <Link href="/investir"
            className="w-full py-4 rounded-xl font-bold text-sm text-center block mt-8 transition-colors"
            style={{backgroundColor: '#00E5CC', color: '#0D0D2B'}}>
            Investir dès maintenant →
          </Link>
        </div>
      </div>

      {/* Description */}
      <div className="mx-8 mt-12 grid grid-cols-3 gap-12 pb-16">
        <h2 className="text-2xl font-bold">Description</h2>
        <div className="col-span-2 text-sm leading-relaxed space-y-4" style={{color: 'rgba(255,255,255,0.6)'}}>
          <p>Vous avez ici l'opportunité de sponsoriser directement la flotte Pony — vélos et trottinettes électriques déployés dans les villes françaises.</p>
          <p>Votre investissement finance l'acquisition et le déploiement de nouveaux véhicules. En échange, Pony vous rembourse avec des intérêts sur la durée choisie.</p>
          <p>Contrairement à l'ancien modèle Adopt a Pony, vous n'êtes pas propriétaire d'un véhicule spécifique — vous financez la flotte dans son ensemble, ce qui réduit le risque et simplifie votre expérience.</p>
        </div>
      </div>

    </main>
  )
}