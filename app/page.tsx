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
  const monthlyRepayment =
    amount * (monthlyRate * Math.pow(1 + monthlyRate, repaymentMonths)) /
    (Math.pow(1 + monthlyRate, repaymentMonths) - 1)
  const totalInterest =
    monthlyInterestOnly * gracePeriod +
    monthlyRepayment * repaymentMonths -
    amount
  const totalRepaid = amount + totalInterest

  return (
    <main className="min-h-screen font-sans" style={{ backgroundColor: '#13102B', color: 'white' }}>

      {/* ── HEADER ── */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0 48px', height: '64px',
        backgroundColor: 'rgba(19,16,43,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <nav className="flex gap-8 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
          <a href="#" className="hover:text-white transition-colors">Home</a>
          <a href="#" className="hover:text-white transition-colors">Adopt</a>
          <a href="#" className="hover:text-white transition-colors">Riders ↗</a>
        </nav>
        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
          <img src="/Logo.png" alt="Pony" style={{ height: '28px', width: 'auto' }} />
        </div>
        <Link href="/login" className="text-sm font-medium hover:text-white transition-colors"
          style={{ color: 'rgba(255,255,255,0.6)' }}>
          Sign In
        </Link>
      </header>

      {/* ── HERO ── */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        paddingTop: '64px', position: 'relative', overflow: 'hidden',
      }}>

        {/* Background fleet image */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
        }}>
          <img src="/Rectangle (1).png" alt=""
            style={{
              height: '90%', width: 'auto', objectFit: 'contain',
              opacity: 0.18, marginRight: '5%',
              maskImage: 'linear-gradient(to left, rgba(0,0,0,0.9) 40%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,0.9) 40%, transparent 100%)',
            }} />
        </div>

        {/* Radial glow */}
        <div style={{
          position: 'absolute', top: '50%', left: '15%',
          transform: 'translate(-50%, -50%)',
          width: '600px', height: '600px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,255,255,0.06) 0%, transparent 70%)',
          zIndex: 0, pointerEvents: 'none',
        }} />

        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          gap: '80px',
          padding: '80px 64px 80px 96px',
          width: '100%', position: 'relative', zIndex: 1,
        }}>

          {/* Left */}
          <div style={{ flex: '0 0 auto', maxWidth: '500px' }}>
            <div style={{ marginBottom: '28px' }}>
              <img src="/Icon (1).png" alt="Pony Angel"
                style={{ width: '52px', height: '52px', borderRadius: '14px' }} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'inline-block', marginBottom: '10px' }}>
                <span style={{
                  display: 'inline-block',
                  backgroundColor: '#00FFFF', color: '#13102B',
                  fontSize: '10px', fontWeight: 900,
                  padding: '4px 12px', borderRadius: '6px',
                  transform: 'rotate(-2deg)',
                  letterSpacing: '2.5px',
                  boxShadow: '0 0 20px rgba(0,255,255,0.4)',
                }}>NEW FORMULA</span>
              </div>
              <h1 style={{
                fontSize: '72px', lineHeight: '1.0', fontWeight: 800,
                letterSpacing: '-2px', whiteSpace: 'nowrap',
              }}>
                Adopt a pony
              </h1>
            </div>
            <p style={{
              color: 'rgba(255,255,255,0.55)', fontSize: '17px',
              lineHeight: '1.65', marginBottom: '36px', maxWidth: '400px',
            }}>
              Invest in Pony's electric fleet and earn up to{' '}
              <span style={{ color: '#00FFFF', fontWeight: 700 }}>9.5%</span>{' '}
              annual returns — paid monthly.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link href="/campagne" style={{
                backgroundColor: '#00FFFF', color: '#13102B',
                padding: '14px 28px', borderRadius: '12px',
                fontSize: '14px', fontWeight: 800,
                letterSpacing: '0.3px', textDecoration: 'none',
                boxShadow: '0 4px 24px rgba(0,255,255,0.3)',
              }}>
                See the campaign
              </Link>
              <Link href="/login" style={{
                backgroundColor: 'transparent', color: 'rgba(255,255,255,0.75)',
                padding: '14px 28px', borderRadius: '12px',
                fontSize: '14px', fontWeight: 600,
                border: '1px solid rgba(255,255,255,0.2)',
                textDecoration: 'none',
              }}>
                Sign in
              </Link>
            </div>
            {/* Social proof */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              marginTop: '32px', padding: '8px 16px', borderRadius: '100px',
              backgroundColor: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}>
              <div style={{ display: 'flex' }}>
                {['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'].map((c, i) => (
                  <div key={i} style={{
                    width: '22px', height: '22px', borderRadius: '50%',
                    backgroundColor: c, border: '2px solid #13102B',
                    marginLeft: i > 0 ? '-8px' : '0',
                  }} />
                ))}
              </div>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                <span style={{ color: 'white', fontWeight: 700 }}>500k+</span> Pony users already on the platform
              </span>
            </div>
          </div>

          {/* Right: simulator */}
          <div style={{ flex: '0 0 500px', marginLeft: 'auto' }}>
            <div style={{
              borderRadius: '24px', padding: '32px',
              backgroundColor: 'rgba(30,27,75,0.9)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,255,255,0.05)',
            }}>
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '4px' }}>
                  Simulate your returns
                </h2>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.3px' }}>
                  36 months · 9.5% annual · 6-month grace period
                </p>
              </div>
              <div style={{ marginBottom: '24px' }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', marginBottom: '12px',
                }}>
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)' }}>I invest</span>
                  <span style={{ fontSize: '36px', fontWeight: 800, color: '#00FFFF', letterSpacing: '-1px' }}>
                    €{amount.toLocaleString('en-GB')}
                  </span>
                </div>
                <input
                  type="range" min={500} max={50000} step={500} value={amount}
                  onChange={e => setAmount(Number(e.target.value))}
                  style={{ accentColor: '#00FFFF', width: '100%', cursor: 'pointer' }}
                />
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  fontSize: '11px', color: 'rgba(255,255,255,0.25)', marginTop: '4px',
                }}>
                  <span>€500</span><span>€50,000</span>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                {[
                  { label: 'Monthly (grace period)', value: `€${monthlyInterestOnly.toFixed(2)}`, sub: 'months 1–6', cyan: true },
                  { label: 'Monthly (repayment)', value: `€${monthlyRepayment.toFixed(2)}`, sub: 'months 7–36', cyan: true },
                  { label: 'Total interest', value: `€${totalInterest.toFixed(2)}`, sub: 'over 36 months', cyan: true },
                  { label: 'Total repaid', value: `€${totalRepaid.toFixed(2)}`, sub: 'at end of term', cyan: false },
                ].map((item, i) => (
                  <div key={i} style={{
                    borderRadius: '14px', padding: '14px 16px',
                    backgroundColor: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}>
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginBottom: '6px', lineHeight: 1.3 }}>
                      {item.label}
                    </p>
                    <p style={{ fontSize: '20px', fontWeight: 800, color: item.cyan ? '#00FFFF' : 'white', letterSpacing: '-0.5px' }}>
                      {item.value}
                    </p>
                    <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)', marginTop: '2px' }}>
                      {item.sub}
                    </p>
                  </div>
                ))}
              </div>
              <Link href="/campagne" style={{
                display: 'block', width: '100%', textAlign: 'center',
                backgroundColor: '#00FFFF', color: '#13102B',
                padding: '15px', borderRadius: '12px',
                fontSize: '14px', fontWeight: 800, textDecoration: 'none',
                letterSpacing: '0.3px',
                boxShadow: '0 4px 24px rgba(0,255,255,0.25)',
              }}>
                Invest now →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── MISSION + CAMPAIGN ── */}
      <section style={{
        padding: '120px 96px',
        display: 'flex', gap: '80px', alignItems: 'flex-start',
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ flex: '1' }}>
          <p style={{
            fontSize: '11px', fontWeight: 700, letterSpacing: '3px',
            color: '#00FFFF', textTransform: 'uppercase', marginBottom: '20px',
          }}>Our mission</p>
          <h2 style={{
            fontSize: '38px', lineHeight: '1.2', fontWeight: 400,
            color: 'white', marginBottom: '56px', maxWidth: '480px',
          }}>
            Allow everyone to participate directly in the transition to soft mobility.
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
            {[
              { emoji: '🛴', title: 'You sponsor', desc: 'Choose an amount starting from €500. No vehicle to manage.' },
              { emoji: '🤝', title: 'We deploy', desc: 'Pony uses your investment to grow and maintain the fleet across French cities.' },
              { emoji: '📊', title: 'You earn interest', desc: 'Receive monthly payments from day one, with capital returned at maturity.' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
                <div style={{
                  width: '96px', height: '96px', borderRadius: '22px', flexShrink: 0,
                  backgroundColor: 'rgba(0,255,255,0.08)',
                  border: '1px solid rgba(0,255,255,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '40px',
                }}>
                  {item.emoji}
                </div>
                <div style={{ paddingTop: '12px' }}>
                  <h3 style={{ fontWeight: 700, fontSize: '16px', marginBottom: '4px' }}>{item.title}</h3>
                  <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', lineHeight: '1.6' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Campaign card */}
        <div style={{ flex: '0 0 380px' }}>
          <div style={{
            borderRadius: '24px', padding: '32px',
            backgroundColor: '#1E1B4B',
            border: '1px solid rgba(255,255,255,0.07)',
            boxShadow: '0 16px 48px rgba(0,0,0,0.3)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <span style={{
                fontSize: '11px', fontWeight: 700, padding: '4px 12px',
                borderRadius: '100px', backgroundColor: 'rgba(0,255,255,0.12)',
                color: '#00FFFF', letterSpacing: '1px',
              }}>● OPEN</span>
              <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)' }}>April 2026</span>
            </div>
            <h3 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '8px' }}>Spring 2026 Fleet</h3>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', lineHeight: '1.6', marginBottom: '24px' }}>
              Financing 50 bikes and scooters deployed across 5 French cities.
            </p>
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
              padding: '20px 0',
              borderTop: '1px solid rgba(255,255,255,0.07)',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
              marginBottom: '24px', textAlign: 'center',
            }}>
              {[
                { value: '9.5%', label: 'Annual rate' },
                { value: '36m', label: 'Duration' },
                { value: '€500', label: 'Minimum' },
              ].map((s, i) => (
                <div key={i}>
                  <p style={{ fontSize: '20px', fontWeight: 800, color: '#00FFFF' }}>{s.value}</p>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>{s.label}</p>
                </div>
              ))}
            </div>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px', color: 'rgba(255,255,255,0.4)' }}>
                <span>€312,000 raised</span>
                <span style={{ fontWeight: 700, color: 'white' }}>62%</span>
              </div>
              <div style={{ width: '100%', height: '4px', borderRadius: '100px', backgroundColor: 'rgba(255,255,255,0.08)' }}>
                <div style={{ width: '62%', height: '4px', borderRadius: '100px', backgroundColor: '#00FFFF', boxShadow: '0 0 8px rgba(0,255,255,0.5)' }} />
              </div>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '6px' }}>€500,000 target</p>
            </div>
            <Link href="/campagne" style={{
              display: 'block', textAlign: 'center',
              backgroundColor: '#00FFFF', color: '#13102B',
              padding: '14px', borderRadius: '12px',
              fontSize: '14px', fontWeight: 800, textDecoration: 'none',
            }}>
              Invest now →
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHY INVEST ── */}
      <section style={{
        display: 'flex', alignItems: 'stretch', overflow: 'hidden',
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}>
        {/* Left: content */}
        <div style={{ flex: '1', padding: '120px 96px' }}>
          <p style={{
            fontSize: '11px', fontWeight: 700, letterSpacing: '3px',
            color: '#00FFFF', textTransform: 'uppercase', marginBottom: '20px',
          }}>Why invest with Pony?</p>
          <h2 style={{ fontSize: '38px', fontWeight: 800, marginBottom: '56px', lineHeight: 1.1 }}>
            Built different.<br />
            <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 400 }}>Designed to last.</span>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {[
              {
                icon: '🛡️',
                title: 'Capital backed by real assets',
                desc: "Your investment is secured by Pony's physical fleet — real e-bikes and scooters deployed daily across France.",
              },
              {
                icon: '📅',
                title: 'Monthly payments from day one',
                desc: 'Interest paid every month during the 6-month grace period. Then capital + interest monthly until maturity.',
              },
              {
                icon: '🌱',
                title: 'Measurable green impact',
                desc: 'Every euro directly finances urban micromobility, reducing CO₂ emissions city by city.',
              },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
                <div style={{
                  width: '96px', height: '96px', borderRadius: '22px', flexShrink: 0,
                  backgroundColor: '#1E1B4B',
                  border: '1px solid rgba(255,255,255,0.07)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '40px',
                }}>
                  {item.icon}
                </div>
                <div style={{ paddingTop: '12px' }}>
                  <h3 style={{ fontWeight: 700, fontSize: '17px', marginBottom: '6px' }}>{item.title}</h3>
                  <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', lineHeight: '1.65' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: fleet image */}
        <div style={{
          flex: '0 0 42%', position: 'relative', overflow: 'hidden',
          background: 'linear-gradient(135deg, #1A1740 0%, #0D0B20 100%)',
        }}>
          <img src="/Rectangle (1).png" alt="Pony fleet"
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'center',
              opacity: 0.55,
              mixBlendMode: 'luminosity',
            }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to right, #13102B 0%, transparent 40%)',
          }} />
          {/* Overlay stats */}
          <div style={{
            position: 'absolute', bottom: '40px', right: '40px',
            display: 'flex', flexDirection: 'column', gap: '12px',
          }}>
            {[
              { value: '500k+', label: 'Active users' },
              { value: '15+', label: 'French cities' },
              { value: '6 years', label: 'Operating' },
            ].map((s, i) => (
              <div key={i} style={{
                padding: '12px 20px', borderRadius: '12px',
                backgroundColor: 'rgba(13,11,32,0.85)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.08)',
                textAlign: 'right',
              }}>
                <p style={{ fontSize: '20px', fontWeight: 800, color: '#00FFFF' }}>{s.value}</p>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '1px' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section style={{
        borderTop: '1px solid rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        padding: '64px 96px',
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
      }}>
        {[
          { value: '500k+', label: 'Users' },
          { value: '15+', label: 'Partner cities' },
          { value: '9.5%', label: 'Annual rate' },
          { value: '95%', label: 'CO₂ saved vs car' },
        ].map((stat, i) => (
          <div key={i} style={{
            textAlign: 'center',
            borderRight: i < 3 ? '1px solid rgba(255,255,255,0.07)' : 'none',
            padding: '0 32px',
          }}>
            <p style={{ fontSize: '44px', fontWeight: 800, color: '#00FFFF', letterSpacing: '-1px' }}>
              {stat.value}
            </p>
            <p style={{
              marginTop: '6px', fontSize: '11px', fontWeight: 600,
              letterSpacing: '2px', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.35)',
            }}>
              {stat.label}
            </p>
          </div>
        ))}
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.05)',
        padding: '40px 96px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <img src="/Logo.png" alt="Pony" style={{ height: '22px', width: 'auto' }} />
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)', maxWidth: '400px', textAlign: 'center' }}>
          All investments carry risk, including the risk of capital loss. Past performance is not indicative of future results.
        </p>
        <div style={{ display: 'flex', gap: '24px', fontSize: '12px' }}>
            <a href="#" style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>Privacy policy</a>
            <a href="#" style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>Terms</a>
            <Link href="/admin" style={{ color: 'rgba(255,255,255,0.15)', textDecoration: 'none' }}>Admin</Link>
          </div>
      </footer>

    </main>
  )
}