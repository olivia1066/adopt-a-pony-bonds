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
        <nav style={{ display: 'flex', gap: '32px', fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>
          <a href="#" className="hover:text-white transition-colors">Home</a>
          <a href="#" className="hover:text-white transition-colors">Adopt</a>
          <a href="#" className="hover:text-white transition-colors">Riders ↗</a>
        </nav>
        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
          <img src="/Logo.png" alt="Pony" style={{ height: '28px', width: 'auto' }} />
        </div>
        <Link href="/login" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>
          Log in
        </Link>
      </header>

      {/* ── HERO ── */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        paddingTop: '64px', position: 'relative', overflow: 'hidden',
      }}>
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
              color: 'rgba(255,255,255,0.9)', fontSize: '18px', fontWeight: 600,
              lineHeight: '1.5', marginBottom: '12px',
            }}>
              Invest in an e-bike or e-scooter. Earn monthly returns up to{' '}
              <span style={{ color: '#00FFFF' }}>9.5%</span>.
              Watch your bikes ride across France.
            </p>
            <p style={{
              color: 'rgba(255,255,255,0.5)', fontSize: '15px',
              lineHeight: '1.7', marginBottom: '36px',
            }}>
              For the first time, you can finance Pony's fleet, get paid back with
              interest every month, and follow your fleet in real time.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link href="/campagne" style={{
                backgroundColor: '#00FFFF', color: '#13102B',
                padding: '14px 28px', borderRadius: '12px',
                fontSize: '14px', fontWeight: 800,
                letterSpacing: '0.3px', textDecoration: 'none',
                boxShadow: '0 4px 24px rgba(0,255,255,0.3)',
              }}>
                Adopt now →
              </Link>
              <Link href="/login" style={{
                backgroundColor: 'transparent', color: 'rgba(255,255,255,0.75)',
                padding: '14px 28px', borderRadius: '12px',
                fontSize: '14px', fontWeight: 600,
                border: '1px solid rgba(255,255,255,0.2)',
                textDecoration: 'none',
              }}>
                Log in
              </Link>
            </div>
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
              {/* Header row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: 800 }}>
                  Simulate your returns
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                  {['36 months', '9.5% annual', '6-month grace'].map((t, i) => (
                    <span key={i} style={{
                      fontSize: '11px', fontWeight: 700,
                      padding: '3px 10px', borderRadius: '100px',
                      backgroundColor: 'rgba(0,255,255,0.1)',
                      border: '1px solid rgba(0,255,255,0.2)',
                      color: '#00FFFF', letterSpacing: '0.3px',
                    }}>{t}</span>
                  ))}
                </div>
              </div>

              {/* Amount */}
              <div style={{ marginBottom: '8px' }}>
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

              {/* Fleet equivalent */}
              <div style={{
                marginBottom: '20px', padding: '10px 14px', borderRadius: '10px',
                backgroundColor: 'rgba(0,255,255,0.06)',
                border: '1px solid rgba(0,255,255,0.12)',
                display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                <span style={{ fontSize: '16px' }}>🛴</span>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                  Your investment finances{' '}
                  <span style={{ color: '#00FFFF', fontWeight: 700 }}>
                    {(amount / 2100).toFixed(2)} e-bikes
                  </span>
                  {' '}in Pony's fleet
                </span>
              </div>

              {/* Result cards */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                {[
                  { label: 'Monthly income', sub: 'months 1–6', value: `€${monthlyInterestOnly.toFixed(2)}` },
                  { label: 'Monthly income', sub: 'months 7–36', value: `€${monthlyRepayment.toFixed(2)}` },
                  { label: 'Total interest earned', sub: 'over 36 months', value: `€${totalInterest.toFixed(2)}` },
                ].map((item, i) => (
                  <div key={i} style={{
                    borderRadius: '14px', padding: '14px 16px',
                    backgroundColor: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}>
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginBottom: '4px', lineHeight: 1.3 }}>
                      {item.label}<br />
                      <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)' }}>{item.sub}</span>
                    </p>
                    <p style={{ fontSize: '20px', fontWeight: 800, color: '#00FFFF', letterSpacing: '-0.5px' }}>
                      {item.value}
                    </p>
                  </div>
                ))}

                {/* Total repaid — highlighted */}
                <div style={{
                  borderRadius: '14px', padding: '14px 16px',
                  backgroundColor: 'rgba(0,255,255,0.08)',
                  border: '1px solid rgba(0,255,255,0.25)',
                }}>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px', lineHeight: 1.3 }}>
                    Total repaid<br />
                    <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>at end of term</span>
                  </p>
                  <p style={{ fontSize: '20px', fontWeight: 800, color: 'white', letterSpacing: '-0.5px' }}>
                    €{totalRepaid.toFixed(2)}
                  </p>
                </div>
              </div>

              <Link href="/campagne" style={{
                display: 'block', width: '100%', textAlign: 'center',
                backgroundColor: '#00FFFF', color: '#13102B',
                padding: '15px', borderRadius: '12px',
                fontSize: '14px', fontWeight: 800, textDecoration: 'none',
                boxShadow: '0 4px 24px rgba(0,255,255,0.25)',
              }}>
                Adopt now →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── MISSION + CAMPAIGN ── */}
      <section style={{
        padding: '120px 96px',
        display: 'flex', gap: '60px', alignItems: 'stretch',
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ flex: '1' }}>
          <p style={{
            fontSize: '11px', fontWeight: 700, letterSpacing: '3px',
            color: '#00FFFF', textTransform: 'uppercase', marginBottom: '20px',
          }}>Our mission</p>
          <h2 style={{
            fontSize: '38px', fontWeight: 800, lineHeight: '1.1',
            color: 'white', marginBottom: '16px',
          }}>
            At Pony, we believe everyone should be able to participate directly in the future of urban mobility.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '17px', marginBottom: '56px' }}>
            We built this for people who want their money to do something real.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
            {[
              { emoji: '🛴', title: 'You invest and we deploy', desc: 'Choose your amount. From €500, no maximum. Pony buys and operates the fleet across French cities.' },
              { emoji: '📅', title: 'You get paid every month', desc: '9.5% annual interest. Monthly income from day one. Capital fully repaid at the end of 36 months.' },
              { emoji: '🎮', title: 'Follow your fleet', desc: 'Track your bikes and scooters in real time. See them ride, earn, and grow across French cities.' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
                <div style={{
                  width: '64px', height: '64px', borderRadius: '18px', flexShrink: 0,
                  backgroundColor: 'rgba(0,255,255,0.08)',
                  border: '1px solid rgba(0,255,255,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '28px',
                }}>
                  {item.emoji}
                </div>
                <div style={{ paddingTop: '8px' }}>
                  <h3 style={{ fontWeight: 700, fontSize: '17px', marginBottom: '4px' }}>{item.title}</h3>
                  <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.6' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Campaign card */}
        <div style={{ flex: '0 0 500px', display: 'flex' }}>
          <div style={{
            borderRadius: '24px', padding: '32px',
            backgroundColor: 'rgba(30,27,75,0.9)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,255,255,0.05)',
            width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          }}>
            <div>
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
            </div>
            <Link href="/campagne" style={{
              display: 'block', textAlign: 'center',
              backgroundColor: '#00FFFF', color: '#13102B',
              padding: '15px', borderRadius: '12px',
              fontSize: '14px', fontWeight: 800, textDecoration: 'none',
              boxShadow: '0 4px 24px rgba(0,255,255,0.25)',
            }}>
              Adopt now →
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHY INVEST ── */}
      <section style={{
        display: 'flex', alignItems: 'stretch', overflow: 'hidden',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        backgroundColor: '#0D0B20',
      }}>
        {/* Left: cyan-tinted image */}
        <div style={{ flex: '0 0 45%', position: 'relative', overflow: 'hidden' }}>
          <img src="/hero-photo2.jpg" alt="Pony fleet"
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'center',
            }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            backgroundColor: 'rgba(0,200,255,0.55)',
            mixBlendMode: 'color',
          }} />
          {/* Diagonal cut */}
          <div style={{
            position: 'absolute', top: 0, right: 0, bottom: 0,
            width: '200px',
            clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
            backgroundColor: '#0D0B20',
          }} />

          {/* Unit economics card */}
          <div style={{
            position: 'absolute', bottom: '48px', left: '48px',
            borderRadius: '20px', padding: '28px',
            backgroundColor: 'rgba(13,11,32,0.92)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.1)',
            width: '260px',
            zIndex: 2,
          }}>
            <p style={{
              fontSize: '10px', fontWeight: 700, letterSpacing: '2px',
              color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase',
              marginBottom: '20px',
            }}>Unit economics</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
              {[
                { label: 'Vehicle price', value: '€2,100' },
                { label: 'Daily trips', value: '— ' },
                { label: 'Daily revenue', value: '— ' },
                { label: 'CO₂ saved vs car', value: '95%' },
              ].map((row, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    fontSize: '11px', fontWeight: 700, letterSpacing: '1px',
                    textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)',
                  }}>
                    {row.label}
                  </span>
                  <span style={{ fontSize: '20px', fontWeight: 800, color: '#00FFFF' }}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.08)', marginBottom: '16px' }} />

            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', lineHeight: '1.5' }}>
              * Based on Pony's average fleet performance across French cities.
            </p>
          </div>
        </div>

        {/* Right: content */}
        <div style={{ flex: '1', padding: '120px 96px' }}>
          <p style={{
            fontSize: '11px', fontWeight: 700, letterSpacing: '3px',
            color: '#00FFFF', textTransform: 'uppercase', marginBottom: '20px',
          }}>Why invest with Pony?</p>
          <h2 style={{ fontSize: '38px', fontWeight: 800, marginBottom: '64px', lineHeight: 1.1 }}>
            Built different.<br />
            <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 400 }}>Designed to last.</span>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
            {[
              {
                icon: '🛡️',
                title: 'Backed by real assets',
                desc: 'Your investment finances a real, operating fleet. Pony vehicles are deployed daily across French cities, generating the revenue that pays you back.',
              },
              {
                icon: '📅',
                title: 'Up to 9.5% in annual interests and regular monthly payments',
                desc: 'Unlike most bonds, we pay you every month — not at the end. From month one, you receive interest. From month seven, you receive capital + interest.',
              },
              {
                icon: '🌱',
                title: 'Invest in something you can see',
                desc: "Every euro you put in goes directly into bikes and scooters that real people ride every day. You'll see them move. You'll track them. They're yours.",
              },
            ].map((item, i) => (
              <div key={i}>
                <div style={{
                  width: '52px', height: '52px', borderRadius: '16px',
                  backgroundColor: 'rgba(0,255,255,0.08)',
                  border: '1px solid rgba(0,255,255,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '24px', marginBottom: '16px',
                }}>
                  {item.icon}
                </div>
                <h3 style={{ fontWeight: 700, fontSize: '18px', marginBottom: '8px' }}>{item.title}</h3>
                <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.65' }}>{item.desc}</p>
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
          { value: '500k+', label: 'Riders across France' },
          { value: '15+', label: 'Partner cities' },
          { value: '9.5%', label: 'Annual return' },
          { value: '95%', label: 'Less CO₂ than a car' },
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
          All investments carry risk, including the risk of capital loss. Pony Bonds is regulated by the AMF.
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