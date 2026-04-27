import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen font-sans" style={{backgroundColor: '#13102B', color: 'white'}}>

      {/* Header */}
      <header className="flex justify-between items-center px-8 py-5">
        <nav className="flex gap-8 text-sm text-white">
          <a href="#" className="hover:opacity-70">Home</a>
          <a href="#" className="hover:opacity-70">Adopt</a>
          <a href="#" className="hover:opacity-70">Riders ↗</a>
        </nav>
        <div className="absolute left-1/2 -translate-x-1/2">
          <img src="/Logo.png" alt="Pony" style={{height: '30px', width: 'auto'}} />
        </div>
        <Link href="/login" className="text-sm text-white hover:opacity-70">
          Sign In
        </Link>
      </header>

      {/* Hero */}
      <section style={{minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '0 60px', overflow: 'hidden'}}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: '1400px', margin: '0 auto', gap: '20px'}}>
          
          {/* Left — text */}
          <div style={{flex: '0 0 auto', maxWidth: '480px'}}>
            <img src="/Icon (1).png" alt="Pony Angel" style={{width: '60px', height: '60px', marginBottom: '32px'}} />
            
            <div style={{position: 'relative', display: 'inline-block', marginBottom: '24px'}}>
              {/* NEW badge */}
              <span style={{
                position: 'absolute',
                top: '-18px',
                left: '30px',
                backgroundColor: '#00E5CC',
                color: '#13102B',
                fontSize: '13px',
                fontWeight: 900,
                padding: '3px 12px',
                borderRadius: '6px',
                transform: 'rotate(-6deg)',
                letterSpacing: '3px',
                zIndex: 10,
                boxShadow: '0 4px 15px rgba(0,229,204,0.4)',
              }}>NEW</span>
              <h1 className="font-extrabold leading-tight" style={{fontSize: '64px'}}>
                Adopt a pony
              </h1>
            </div>

            <p className="text-lg mb-10 leading-relaxed" style={{color: 'rgba(255,255,255,0.6)'}}>
              Prêtez de l'argent à Pony, nous finançons notre flotte de vélos et trottinettes, et nous vous remboursons avec des intérêts.
            </p>
            <div className="flex gap-4">
              <Link href="/campagne"
                className="px-8 py-4 rounded-xl text-sm font-bold transition-colors"
                style={{backgroundColor: '#00E5CC', color: '#13102B'}}>
                Voir la campagne
              </Link>
              <Link href="/login"
                className="px-8 py-4 rounded-xl text-sm font-bold border transition-colors"
                style={{borderColor: '#00E5CC', color: '#00E5CC'}}>
                Se connecter
              </Link>
            </div>
          </div>

          {/* Right — image */}
          <div style={{flex: '1', display: 'flex', justifyContent: 'flex-end', marginRight: '-60px'}}>
            <img
              src="/Rectangle (1).png"
              alt="Pony fleet"
              style={{width: '100%', maxWidth: '900px', height: 'auto'}}
            />
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
              <p className="text-sm leading-relaxed" style={{color: 'rgba(255,255,255,0.5)'}}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Campaign card */}
      <section className="px-8 py-16 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-10">Campagne en cours</h2>
        <div className="rounded-3xl p-8 max-w-md" style={{backgroundColor: '#1E1B4B'}}>
          <div className="flex justify-between items-start mb-6">
            <span className="text-xs font-bold px-3 py-1 rounded-full" style={{backgroundColor: '#00E5CC', color: '#13102B'}}>
              EN COURS
            </span>
            <span className="text-sm" style={{color: 'rgba(255,255,255,0.4)'}}>Avril 2026</span>
          </div>
          <h3 className="text-2xl font-bold mb-2">Flotte Printemps 2026</h3>
          <p className="text-sm mb-6 leading-relaxed" style={{color: 'rgba(255,255,255,0.5)'}}>
            Financement de 50 vélos et trottinettes déployés sur 5 villes françaises.
          </p>
          <div className="grid grid-cols-3 gap-4 mb-6 text-center py-4 border-y border-white/10">
            <div>
              <div className="text-xl font-bold" style={{color: '#00E5CC'}}>7%</div>
              <div className="text-xs mt-0.5" style={{color: 'rgba(255,255,255,0.4)'}}>Taux annuel</div>
            </div>
            <div>
              <div className="text-xl font-bold" style={{color: '#00E5CC'}}>24 mois</div>
              <div className="text-xs mt-0.5" style={{color: 'rgba(255,255,255,0.4)'}}>Durée</div>
            </div>
            <div>
              <div className="text-xl font-bold" style={{color: '#00E5CC'}}>500€</div>
              <div className="text-xs mt-0.5" style={{color: 'rgba(255,255,255,0.4)'}}>Minimum</div>
            </div>
          </div>
          <div className="mb-6">
            <div className="flex justify-between text-xs mb-2" style={{color: 'rgba(255,255,255,0.4)'}}>
              <span>312 000€ collectés</span>
              <span>500 000€</span>
            </div>
            <div className="w-full rounded-full h-1.5" style={{backgroundColor: '#2D2B5E'}}>
              <div className="h-1.5 rounded-full" style={{width: '62%', backgroundColor: '#00E5CC'}}></div>
            </div>
          </div>
          <Link href="/campagne"
            className="w-full py-4 rounded-xl text-sm font-bold block text-center transition-colors"
            style={{backgroundColor: '#00E5CC', color: '#13102B'}}>
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
              <p className="mt-2 uppercase tracking-widest text-xs" style={{color: 'rgba(255,255,255,0.4)'}}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-8 py-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <img src="/Logo.png" alt="Pony" style={{height: '22px', width: 'auto'}} />
          <p className="text-xs" style={{color: 'rgba(255,255,255,0.3)'}}>
            Tout investissement comporte des risques, notamment celui d'une perte en capital.
          </p>
          <div className="flex gap-6 text-xs" style={{color: 'rgba(255,255,255,0.3)'}}>
            <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
            <a href="#" className="hover:text-white transition-colors">CGU</a>
          </div>
        </div>
      </footer>
    </main>
  )
}