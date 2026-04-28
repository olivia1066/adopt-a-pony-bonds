'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Home() {
  const [amount, setAmount] = useState(5000)

  const annualRate = 0.095
  const monthlyRate = annualRate / 12
  const gracePeriod = 6
  const totalMonths = 36
  const repaymentMonths = totalMonths - gracePeriod

  const monthlyInterestOnly = amount * monthlyRate
  const monthlyRepayment = amount * (monthlyRate * Math.pow(1 + monthlyRate, repaymentMonths)) / (Math.pow(1 + monthlyRate, repaymentMonths) - 1)
  const totalInterest = (monthlyInterestOnly * gracePeriod) + (monthlyRepayment * repaymentMonths) - amount
  const totalRepaid = amount + totalInterest

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
      <section style={{minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden', position: 'relative'}}>

        {/* Background image */}
        <div style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: '100%',
          zIndex: 0,
          opacity: 0.15,
        }}>
          <img src="/Rectangle (1).png" alt=""
            style={{objectFit: 'contain', objectPosition: 'right center', width: '65%', marginLeft: 'auto', height: '100%'}} />
        </div>

        {/* Content */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '60px',
          paddingLeft: '80px',
          paddingRight: '80px',
          width: '100%',
          position: 'relative',
          zIndex: 1,
          justifyContent: 'center',
        }}>

          {/* Left — text */}
          <div style={{flex: '0 0 auto', maxWidth: '480px'}}>
            <img src="/Icon (1).png" alt="Pony Angel" style={{width: '50px', height: '50px', marginBottom: '24px'}} />
            <div style={{position: 'relative', display: 'inline-block', marginBottom: '16px'}}>
              <span style={{
                position: 'absolute', top: '-14px', left: '4px',
                backgroundColor: '#00FFFF', color: '#13102B',
                fontSize: '11px', fontWeight: 900, padding: '2px 10px',
                borderRadius: '4px', transform: 'rotate(-4deg)',
                letterSpacing: '2px', zIndex: 10,
                boxShadow: '0 4px 15px rgba(0,255,255,0.3)',
              }}>NEW FORMULA</span>
              <h1 className="font-extrabold leading-tight" style={{fontSize: '52px'}}>
                Adopt a pony
              </h1>
            </div>
            <p className="mb-8" style={{color: 'rgba(255,255,255,0.6)', fontSize: '16px', lineHeight: '1.6'}}>
              Invest in a pony ebike or scooter and get up to 9.5% regular returns
            </p>
            <div className="flex gap-3">
              <Link href="/campagne" className="font-bold transition-colors"
                style={{backgroundColor: '#00FFFF', color: '#13102B', padding: '12px 24px', borderRadius: '10px', fontSize: '14px'}}>
                See the campaign
              </Link>
              <Link href="/login" className="font-bold border transition-colors"
                style={{borderColor: '#00FFFF', color: '#00FFFF', padding: '12px 24px', borderRadius: '10px', fontSize: '14px'}}>
                Sign in
              </Link>
            </div>
          </div>

          {/* Right — simulator */}
          <div style={{flex: '1', maxWidth: '480px'}}>
            <div className="rounded-3xl p-8" style={{backgroundColor: 'rgba(30,27,75,0.85)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)'}}>
              <h2 className="text-xl font-bold mb-2">Simulate your returns</h2>
              <p className="text-sm mb-6" style={{color: 'rgba(255,255,255,0.4)'}}>36 months · 9.5% annual · 6 month grace period</p>

              <div className="mb-6">
                <div className="flex justify-between items-end mb-3">
                  <label className="text-sm" style={{color: 'rgba(255,255,255,0.5)'}}>I invest</label>
                  <span className="text-3xl font-bold" style={{color: '#00FFFF'}}>€{amount.toLocaleString('en-GB')}</span>
                </div>
                <input
                  type="range" min={500} max={50000} step={500} value={amount}
                  onChange={e => setAmount(Number(e.target.value))}
                  className="w-full"
                  style={{accentColor: '#00FFFF'}}
                />
                <div className="flex justify-between text-xs mt-1" style={{color: 'rgba(255,255,255,0.3)'}}>
                  <span>€500</span>
                  <span>€50,000</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="rounded-2xl p-4" style={{backgroundColor: 'rgba(255,255,255,0.05)'}}>
                  <p className="text-xs mb-1" style={{color: 'rgba(255,255,255,0.4)'}}>Monthly (grace period)</p>
                  <p className="text-xl font-bold" style={{color: '#00FFFF'}}>€{monthlyInterestOnly.toFixed(2)}</p>
                </div>
                <div className="rounded-2xl p-4" style={{backgroundColor: 'rgba(255,255,255,0.05)'}}>
                  <p className="text-xs mb-1" style={{color: 'rgba(255,255,255,0.4)'}}>Monthly (months 7–36)</p>
                  <p className="text-xl font-bold" style={{color: '#00FFFF'}}>€{monthlyRepayment.toFixed(2)}</p>
                </div>
                <div className="rounded-2xl p-4" style={{backgroundColor: 'rgba(255,255,255,0.05)'}}>
                  <p className="text-xs mb-1" style={{color: 'rgba(255,255,255,0.4)'}}>Total interest</p>
                  <p className="text-xl font-bold" style={{color: '#00FFFF'}}>€{totalInterest.toFixed(2)}</p>
                </div>
                <div className="rounded-2xl p-4" style={{backgroundColor: 'rgba(255,255,255,0.05)'}}>
                  <p className="text-xs mb-1" style={{color: 'rgba(255,255,255,0.4)'}}>Total repaid</p>
                  <p className="text-xl font-bold text-white">€{totalRepaid.toFixed(2)}</p>
                </div>
              </div>

              <Link href="/campagne" className="w-full font-bold block text-center transition-colors"
                style={{backgroundColor: '#00FFFF', color: '#13102B', padding: '14px', borderRadius: '10px', fontSize: '14px'}}>
                Invest now →
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Mission + Campaign side by side */}
      <section style={{paddingLeft: '120px', paddingRight: '120px', paddingTop: '96px', paddingBottom: '96px', display: 'flex', gap: '80px', alignItems: 'flex-start'}}>
        <div style={{flex: '1'}}>
          <h2 className="text-4xl leading-tight mb-16" style={{color: 'white', fontWeight: 400}}>
            At Pony, our mission is simple: allow everyone to participate directly in the transition to soft mobility.
          </h2>
          <div className="grid grid-cols-1 gap-8">
            {[
              { emoji: '🛴', title: 'You sponsor', desc: 'Choose an amount and a duration. Starting from €500.' },
              { emoji: '🤝', title: 'We deploy', desc: 'Pony uses your investment to finance the fleet in the city.' },
              { emoji: '📊', title: 'You earn interest', desc: 'Receive your interest regularly and get your capital back at maturity.' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0" style={{backgroundColor: '#1A1A3E'}}>
                  {item.emoji}
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                  <p className="text-sm leading-relaxed" style={{color: 'rgba(255,255,255,0.5)'}}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{flex: '0 0 400px'}}>
          <div className="rounded-3xl p-8" style={{backgroundColor: '#1E1B4B'}}>
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
                <div className="text-xl font-bold" style={{color: '#00FFFF'}}>9.5%</div>
                <div className="text-xs mt-0.5" style={{color: 'rgba(255,255,255,0.4)'}}>Annual rate</div>
              </div>
              <div>
                <div className="text-xl font-bold" style={{color: '#00FFFF'}}>36 months</div>
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
              className="w-full py-3 rounded-xl text-sm font-bold block text-center transition-colors"
              style={{backgroundColor: '#00FFFF', color: '#13102B'}}>
              Invest now →
            </Link>
          </div>
        </div>
      </section>

      {/* Value proposition */}
      <section style={{paddingLeft: '120px', paddingRight: '0', paddingTop: '96px', paddingBottom: '96px', display: 'flex', gap: '0', alignItems: 'stretch', overflow: 'hidden'}}>
        <div style={{flex: '1', paddingRight: '80px'}}>
          <h2 className="text-4xl font-bold mb-16">Why invest with Pony?</h2>
          <div className="space-y-12">
            {[
              {
                icon: '🛡️',
                title: 'Capital protected',
                desc: 'Your investment is backed by Pony\'s physical fleet — real assets deployed in cities across France.'
              },
              {
                icon: '📅',
                title: 'Regular monthly payments',
                desc: 'Receive your interest every month from day one, with full capital repayment at maturity.'
              },
              {
                icon: '🌱',
                title: 'Green impact',
                desc: 'Every euro you invest directly finances sustainable urban mobility and reduces CO2 emissions in cities.'
              },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{backgroundColor: '#1E1B4B'}}>
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p style={{color: 'rgba(255,255,255,0.5)', lineHeight: '1.6', fontSize: '15px'}}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{flex: '0 0 45%', position: 'relative', borderRadius: '24px 0 0 24px', overflow: 'hidden', minHeight: '500px'}}>
          <div style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #1E1B4B 0%, #13102B 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '16px',
          }}>
            <div style={{fontSize: '80px', opacity: 0.3}}>🛴</div>
            <p style={{color: 'rgba(255,255,255,0.2)', fontSize: '14px'}}>Photo placeholder</p>
          </div>
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, #13102B 0%, transparent 30%)',
          }}></div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-t border-white/10 py-16">
        <div className="max-w-4xl mx-auto grid grid-cols-4 gap-8 text-center">
          {[
            { value: '500k+', label: 'Users' },
            { value: '15+', label: 'Partner cities' },
            { value: '9.5%', label: 'Annual rate' },
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