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
          <div style={{flex: '0 0 auto', maxWidth: '480px', paddingLeft: '30px'}}>
            <img src="/Icon (1).png" alt="Pony Angel" style={{width: '60px', height: '60px', marginBottom: '32px'}} />
            
            <div style={{position: 'relative', display: 'inline-block', marginBottom: '24px'}}>
              <span style={{
                position: 'absolute',
                top: '-18px',
                left: '30px',
                backgroundColor: '#00FFFF',
                color: '#13102B',
                fontSize: '13px',
                fontWeight: 900,
                padding: '3px 12px',
                borderRadius: '6px',
                transform: 'rotate(-6deg)',
                letterSpacing: '3px',
                zIndex: 10,
                boxShadow: '0 4px 15px rgba(0,229,204,0.4)',
              }}>NEW FORMULA</span>
              <h1 className="font-extrabold leading-tight" style={{fontSize: '64px'}}>
                Adopt a pony
              </h1>
            </div>

            <p className="text-lg mb-10 leading-relaxed" style={{color: 'rgba(255,255,255,0.6)'}}>
              Invest in a pony ebike or scooter and get up to 9.5% regular returns
            </p>
            <div className="flex gap-4">
              <Link href="/campagne"
                className="px-8 py-4 rounded-xl text-sm font-bold transition-colors"
                style={{backgroundColor: '#00FFFF', color: '#13102B'}}>
                See the campaign
              </Link>
              <Link href="/login"
                className="px-8 py-4 rounded-xl text-sm font-bold border transition-colors"
                style={{borderColor: '#00FFFF', color: '#00FFFF'}}>
                Sign in
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
          At Pony, our mission is simple: allow everyone to participate directly in the transition to soft mobility.
        </h2>
        <div className="grid grid-cols-3 gap-12">
          {[
            { emoji: '🛴', title: 'You sponsor', desc: 'Choose an amount and a duration. Starting from €500.' },
            { emoji: '🤝', title: 'We deploy', desc: 'Pony uses your investment to finance the fleet in the city.' },
            { emoji: '📊', title: 'You earn interest', desc: 'Receive your interest regularly and get your capital back at maturity.' },
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
        <h2 className="text-3xl font-bold mb-10">Current campaign</h2>
        <div className="rounded-3xl p-8 max-w-md" style={{backgroundColor: '#1E1B4B'}}>
          <div className="flex justify-between items-start mb-6">
            <span className="text-xs font-bold px-3 py-1 rounded-full" style={{backgroundColor: '#00FFFF', color: '#13102B'}}>
              OPEN
            </span>
            <span className="text-sm" style={{color: 'rgba(255,255,255,0.4)'}}>April 2026</span>
          </div>
          <h3 className="text-2xl font-bold mb-2">Spring 2026 Fleet</h3>
          <p className="text-sm mb-6 leading-relaxed" style={{color: 'rgba(255,255,255,0.5)'}}>
            Financing of 50 bikes and scooters deployed across 5 French cities.
          </p>
          <div className="grid grid-cols-3 gap-4 mb-6 text-center py-4 border-y border-white/10">
            <div>
              <div className="text-xl font-bold" style={{color: '#00FFFF'}}>7%</div>
              <div className="text-xs mt-0.5" style={{color: 'rgba(255,255,255,0.4)'}}>Annual rate</div>
            </div>
            <div>
              <div className="text-xl font-bold" style={{color: '#00FFFF'}}>24 months</div>
              <div className="text-xs mt-0.5" style={{color: 'rgba(255,255,255,0.4)'}}>Duration</div>
            </div>
            <div>
              <div className="text-xl font-bold" style={{color: '#00FFFF'}}>€500</div>
              <div className="text-xs mt-0.5" style={{color: 'rgba(255,255,255,0.4)'}}>Minimum</div>
            </div>
          </div>
          <div className="mb-6">
            <div className="flex justify-between text-xs mb-2" style={{color: 'rgba(255,255,255,0.4)'}}>
              <span>€312,000 raised</span>
              <span>€500,000</span>
            </div>
            <div className="w-full rounded-full h-1.5" style={{backgroundColor: '#2D2B5E'}}>
              <div className="h-1.5 rounded-full" style={{width: '62%', backgroundColor: '#00FFFF'}}></div>
            </div>
          </div>
          <Link href="/campagne"
            className="w-full py-4 rounded-xl text-sm font-bold block text-center transition-colors"
            style={{backgroundColor: '#00FFFF', color: '#13102B'}}>
            Invest now →
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="border-t border-white/10 py-16">
        <div className="max-w-4xl mx-auto grid grid-cols-4 gap-8 text-center">
          {[
            { value: '500k+', label: 'Users' },
            { value: '15+', label: 'Partner cities' },
            { value: '6–9%', label: 'Annual rate' },
            { value: '95%', label: 'CO2 saved' },
          ].map((stat, i) => (
            <div key={i}>
              <p className="text-4xl font-bold" style={{color: '#00FFFF'}}>{stat.value}</p>
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
            All investments carry risk, including the risk of capital loss.
          </p>
          <div className="flex gap-6 text-xs" style={{color: 'rgba(255,255,255,0.3)'}}>
            <a href="#" className="hover:text-white transition-colors">Privacy policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </main>
  )
}