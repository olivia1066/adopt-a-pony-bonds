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
    <main className="min-h-screen bg-white font-sans">
      <header className="flex justify-between items-center px-8 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🐴</span>
          <Link href="/" className="font-bold text-lg">Adopt a Pony</Link>
        </div>
        <div className="flex gap-4">
          <Link href="/dashboard" className="text-sm border border-gray-200 px-4 py-2 rounded-full hover:border-black">
            Mes investissements
          </Link>
        </div>
      </header>

      <div className="px-8 py-4">
        <Link href="/" className="text-sm text-gray-500 hover:text-black">← Retour aux campagnes</Link>
      </div>

      <div className="relative mx-8 rounded-2xl overflow-hidden h-80 bg-gradient-to-r from-gray-900 to-gray-600 mb-0">
        <div className="absolute inset-0 flex items-end p-8">
          <div>
            <div className="flex gap-2 mb-3">
              <span className="text-xs bg-white/20 text-white px-3 py-1 rounded-full">🛴 Flotte urbaine</span>
              <span className="text-xs bg-white/20 text-white px-3 py-1 rounded-full">📍 Paris & Lyon</span>
            </div>
            <h1 className="text-3xl font-bold text-white">Sponsorisez la flotte<br />Pony Printemps 2026</h1>
          </div>
        </div>
        <div className="absolute right-8 top-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 w-72 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-gray-500">Statut</span>
            <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">🟢 En cours</span>
          </div>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Taux d'intérêt</span>
              <span className="font-bold">6 – 9 %</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Durée</span>
              <span className="font-bold">12 à 48 mois</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Remboursement</span>
              <span className="font-bold">À terme</span>
            </div>
          </div>
          <div className="mb-1">
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div className="bg-black h-2 rounded-full" style={{width: '62%'}}></div>
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-400 mb-3">
            <span>312 000 € financés</span>
            <span>500 000 €</span>
          </div>
          <div className="text-xs text-gray-500 flex items-center gap-1">
            🛡️ <span>Capital protégé par la flotte</span>
          </div>
        </div>
      </div>

      <div className="mx-8 mt-4 grid grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-gray-200">
        <div className="p-8 bg-white">
          <h2 className="text-xl font-bold mb-6">Je veux investir</h2>
          <div className="border border-gray-200 rounded-xl px-4 py-3 text-2xl font-bold text-center mb-3">
            €{amount.toLocaleString('fr-FR')}
          </div>
          <input
            type="range" min={500} max={50000} step={500} value={amount}
            onChange={e => setAmount(Number(e.target.value))}
            className="w-full accent-black mb-1"
          />
          <div className="flex justify-between text-xs text-gray-400 mb-6">
            <span>500 €</span>
            <span>50 000 €</span>
          </div>
          <h3 className="font-bold mb-3">Pendant</h3>
          <div className="grid grid-cols-4 gap-2">
            {[12, 24, 36, 48].map(d => (
              <button
                key={d}
                onClick={() => setDuration(d)}
                className={`py-2 rounded-xl text-sm font-medium border transition-all ${duration === d ? 'border-black bg-black text-white' : 'border-gray-200 hover:border-black'}`}
              >
                {d} mois
              </button>
            ))}
          </div>
          <div className="mt-6 flex gap-4 text-xs text-gray-400">
            <span className="underline cursor-pointer">Information fiscale</span>
            <span className="underline cursor-pointer">Note d'investissement</span>
          </div>
        </div>

        <div className="p-8 bg-gray-900 text-white flex flex-col justify-between">
          <div>
            <div className="mb-8">
              <p className="text-gray-400 text-sm mb-1">Vous recevez</p>
              <p className="text-5xl font-bold">{monthlyInterest.toFixed(2).replace('.', ',')} €</p>
              <p className="text-gray-400 text-sm mt-1">par mois</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Total remboursé</p>
              <p className="text-2xl font-bold">{totalRepaid.toLocaleString('fr-FR', {minimumFractionDigits: 2, maximumFractionDigits: 2})} €</p>
            </div>
            <div className="mt-4 text-xs text-gray-500 flex items-center gap-1 cursor-pointer hover:text-gray-300">
              📅 Calendrier des paiements
            </div>
          </div>
          <Link
            href="/investir"
            className="w-full bg-white text-black py-4 rounded-full font-bold text-sm hover:bg-gray-100 mt-8 block text-center"
          >
            Investir dès maintenant →
          </Link>
        </div>
      </div>

      <div className="mx-8 mt-12 grid grid-cols-3 gap-12 pb-16">
        <h2 className="text-2xl font-bold">Description</h2>
        <div className="col-span-2 text-gray-600 text-sm leading-relaxed space-y-4">
          <p>Vous avez ici l'opportunité de sponsoriser directement la flotte Pony — vélos et trottinettes électriques déployés dans les villes françaises.</p>
          <p>Votre investissement finance l'acquisition et le déploiement de nouveaux véhicules. En échange, Pony vous rembourse avec des intérêts sur la durée choisie.</p>
          <p>Contrairement à l'ancien modèle Adopt a Pony, vous n'êtes pas propriétaire d'un véhicule spécifique — vous financez la flotte dans son ensemble, ce qui réduit le risque et simplifie votre expérience.</p>
        </div>
      </div>
    </main>
  )
}
