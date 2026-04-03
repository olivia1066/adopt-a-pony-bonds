import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen font-sans" style={{backgroundColor: '#0D0D2B', color: 'white'}}>

      {/* Header */}
      <header className="flex justify-between items-center px-12 py-7 border-b border-white/10">
        <nav className="flex gap-8 text-sm text-white/70">
          <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
          <Link href="/campagne" className="hover:text-white transition-colors">Adopter</Link>
          <a href="https://pony.bike" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
            Riders <span style={{color: '#00E5CC'}}>↗</span>
          </a>
        </nav>
        <div className="absolute left-1/2 -translate-x-1/2">
          <span className="text-2xl font-bold tracking-tight" style={{color: '#00E5CC', fontFamily: 'system-ui, sans-serif', letterSpacing: '-0.02em'}}>pony</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-white/70">
          <Link href="/dashboard" className="hover:text-white transition-colors">Connexion</Link>
        </div>
      </header>

      {/* Hero */}
      <section className="px-8 pt-16 pb-24 max-w-6xl mx-auto grid grid-cols-2 gap-12 items-center">
        <div>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-8" style={{backgroundColor: '#00E5CC'}}>
            👼
          </div>
          <h1 className="text-6xl font-bold leading-tight mb-6">
            Sponsorisez<br />la flotte Pony.
          </h1>
          <p className="text-gray-400 text-lg mb-10 leading-relaxed">
            Prêtez de l'argent à Pony, nous finançons notre flotte de vélos et trottinettes, et nous vous remboursons avec des intérêts.
          </p>
          <div className="flex gap-4">
            <Link href="/campagne"
              className="px-8 py-4 rounded-xl text-sm font-bold transition-colors"
              style={{backgroundColor: '#00E5CC', color: '#0D0D2B'}}>
              Voir la campagne
            </Link>
            <Link href="/dashboard"
              className="px-8 py-4 rounded-xl text-sm font-bold border transition-colors"
              style={{borderColor: '#00E5CC', color: '#00E5CC'}}>
              Se connecter
            </Link>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <div className="text-center">
            <div className="text-9xl">🛴</div>
            <div className="text-6xl mt-4">🚲</div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="px-8 py-24 max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold leading-tight mb-20" style={{color: 'white'}}>
          Chez Pony, notre mission est simple : permettre à chacun de participer directement à la transition vers la mobilité douce.
        </h2>
        <div className="grid grid-cols-3 gap-12">
          {[
            { emoji: '🛴', title: 'Sponsorisez', desc: 'Choisissez un montant et une durée. À partir de 500€.' },
            { emoji: '🤝', title: 'On déploie', desc: 'Pony utilise votre investissement pour financer la flotte en ville.' },
            { emoji: '📊', title: 'Touchez des intérêts', desc: 'Recevez vos intérêts régulièrement et récupérez votre capital à terme.' },
          ].map((item, i) => (
            <div key={i}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6" style={{backgroundColor: '#1A1A3E'}}>
                {item.emoji}
              </div>
              <h3 className="font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Campaign card */}
      <section className="px-8 py-16 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-10">Campagne en cours</h2>
        <div className="rounded-3xl p-8 max-w-md" style={{backgroundColor: '#1E1B4B'}}>
          <div className="flex justify-between items-start mb-6">
            <span className="text-xs font-bold px-3 py-1 rounded-full" style={{backgroundColor: '#00E5CC', color: '#0D0D2B'}}>
              EN COURS
            </span>
            <span className="text-sm text-gray-400">Avril 2026</span>
          </div>
          <h3 className="text-2xl font-bold mb-2">Flotte Printemps 2026</h3>
          <p className="text-gray-400 text-sm mb-6 leading-relaxed">
            Financement de 50 vélos et trottinettes déployés sur 5 villes françaises.
          </p>
          <div className="grid grid-cols-3 gap-4 mb-6 text-center py-4 border-y border-white/10">
            <div>
              <div className="text-xl font-bold" style={{color: '#00E5CC'}}>7%</div>
              <div className="text-xs text-gray-400 mt-0.5">Taux annuel</div>
            </div>
            <div>
              <div className="text-xl font-bold" style={{color: '#00E5CC'}}>24 mois</div>
              <div className="text-xs text-gray-400 mt-0.5">Durée</div>
            </div>
            <div>
              <div className="text-xl font-bold" style={{color: '#00E5CC'}}>500€</div>
              <div className="text-xs text-gray-400 mt-0.5">Minimum</div>
            </div>
          </div>
          <div className="mb-6">
            <div className="flex justify-between text-xs text-gray-400 mb-2">
              <span>312 000€ collectés</span>
              <span>500 000€</span>
            </div>
            <div className="w-full rounded-full h-1.5" style={{backgroundColor: '#2D2B5E'}}>
              <div className="h-1.5 rounded-full" style={{width: '62%', backgroundColor: '#00E5CC'}}></div>
            </div>
          </div>
          <Link href="/campagne"
            className="w-full py-4 rounded-xl text-sm font-bold block text-center transition-colors"
            style={{backgroundColor: '#00E5CC', color: '#0D0D2B'}}>
            Investir maintenant →
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="border-t border-white/10 py-16">
        <div className="max-w-4xl mx-auto grid grid-cols-4 gap-8 text-center">
          {[
            { value: '500k+', label: 'Utilisateurs' },
            { value: '15+', label: 'Villes partenaires' },
            { value: '6–9%', label: 'Taux annuel' },
            { value: '95%', label: 'CO2 économisé' },
          ].map((stat, i) => (
            <div key={i}>
              <p className="text-4xl font-bold" style={{color: '#00E5CC'}}>{stat.value}</p>
              <p className="text-sm text-gray-400 mt-2 uppercase tracking-widest text-xs">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-8 py-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <span className="font-bold" style={{color: '#00E5CC'}}>🐴 pony</span>
          <p className="text-xs text-gray-500">
            Tout investissement comporte des risques, notamment celui d'une perte en capital.
          </p>
          <div className="flex gap-6 text-xs text-gray-500">
            <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
            <a href="#" className="hover:text-white transition-colors">CGU</a>
          </div>
        </div>
      </footer>
    </main>
  )
}
