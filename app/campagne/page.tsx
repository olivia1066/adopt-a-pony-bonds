'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

type Campaign = {
  id: string
  name: string
  target_amount: number
  raised_amount: number
  rate: number
  duration: number
  status: string
  start_date: string
}

const ANNUAL_RATE = 0.095
const TOTAL_MONTHS = 36
const GRACE_MONTHS = 6
const REPAYMENT_MONTHS = TOTAL_MONTHS - GRACE_MONTHS
const MONTHLY_RATE = ANNUAL_RATE / 12

function calcReturns(amount: number) {
  const monthlyGrace = amount * MONTHLY_RATE
  const monthlyRepayment =
    amount * (MONTHLY_RATE * Math.pow(1 + MONTHLY_RATE, REPAYMENT_MONTHS)) /
    (Math.pow(1 + MONTHLY_RATE, REPAYMENT_MONTHS) - 1)
  const totalInterest =
    monthlyGrace * GRACE_MONTHS + monthlyRepayment * REPAYMENT_MONTHS - amount
  const totalRepaid = amount + totalInterest
  return { monthlyGrace, monthlyRepayment, totalInterest, totalRepaid }
}

function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    { q: 'What is Pony and Adopt a Pony?', a: 'Coming soon.' },
    { q: 'Why invest with Adopt a Pony?', a: 'Coming soon.' },
    { q: 'How do you generate 9.5% returns?', a: 'Coming soon.' },
    { q: 'What is the risk associated to adopting a Pony?', a: 'Coming soon.' },
    { q: 'What is the associated fiscality?', a: 'Coming soon.' },
  ]

  return (
    <div style={{ margin: '80px 40px', paddingBottom: '40px' }}>
      <div style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '56px', fontWeight: 800, letterSpacing: '-2px' }}>FAQs</h2>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {faqs.map((faq, i) => (
          <div key={i} style={{
            borderRadius: '16px',
            backgroundColor: 'rgba(30,27,75,0.6)',
            border: '1px solid rgba(255,255,255,0.07)',
            overflow: 'hidden',
          }}>
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              style={{
                width: '100%', display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', padding: '24px 28px',
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'white', textAlign: 'left',
              }}
            >
              <span style={{ fontSize: '17px', fontWeight: 700 }}>{faq.q}</span>
              <span style={{
                fontSize: '24px', fontWeight: 300, color: '#00FFFF',
                flexShrink: 0, marginLeft: '16px', display: 'inline-block',
                transform: openIndex === i ? 'rotate(45deg)' : 'rotate(0)',
                transition: 'transform 0.2s',
              }}>+</span>
            </button>
            {openIndex === i && (
              <div style={{
                padding: '0 28px 24px',
                fontSize: '15px', lineHeight: '1.7',
                color: 'rgba(255,255,255,0.5)',
              }}>
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Campagne() {
  const [amount, setAmount] = useState(5000)
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCampaign() {
      const { data } = await supabase
        .from('campaigns')
        .select('*')
        .eq('status', 'Ouverte')
        .single()
      if (data) setCampaign(data)
      setLoading(false)
    }
    fetchCampaign()
  }, [])

  const { monthlyGrace, monthlyRepayment, totalInterest, totalRepaid } = calcReturns(amount)
  const raisedPct = campaign
    ? Math.min((campaign.raised_amount / campaign.target_amount) * 100, 100)
    : 62

  if (loading) return (
    <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#13102B' }}>
      <p style={{ color: '#00FFFF' }}>Loading...</p>
    </main>
  )

  return (
    <main className="min-h-screen font-sans" style={{ backgroundColor: '#13102B', color: 'white' }}>

      {/* ── BACK ── */}
      <div style={{ padding: '16px 40px' }}>
        <Link href="/" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>
          ← Back
        </Link>
      </div>

      {/* ── HERO ── */}
      <div style={{
        margin: '0 40px', borderRadius: '24px', overflow: 'hidden',
        position: 'relative', minHeight: '460px',
        background: 'linear-gradient(135deg, #1E1B4B 0%, #0D0D2B 100%)',
      }}>
        <img src="/hero-photo2.jpg" alt=""
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center 30%',
          }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, rgba(13,13,43,0.75) 25%, rgba(13,13,43,0.2) 60%, rgba(13,13,43,0.6) 100%)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(13,13,43,0.8) 0%, transparent 50%)',
        }} />

        {/* Title bottom-left */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, padding: '40px', zIndex: 2 }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <span style={{
              fontSize: '11px', padding: '4px 12px', borderRadius: '100px', fontWeight: 600,
              backgroundColor: 'rgba(0,255,255,0.12)', color: '#00FFFF',
            }}>🛴 Urban fleet</span>
            <span style={{
              fontSize: '11px', padding: '4px 12px', borderRadius: '100px', fontWeight: 600,
              backgroundColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)',
            }}>📍 France — 15+ cities</span>
          </div>
          <h1 style={{ fontSize: '48px', fontWeight: 800, letterSpacing: '-1.5px', lineHeight: 1.05, marginBottom: '10px' }}>
            {campaign?.name || 'Spring 2026 Fleet'}
          </h1>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.6)', maxWidth: '480px' }}>
            Finance Pony's electric fleet and earn regular monthly returns.
          </p>
        </div>

        {/* Stats card */}
        <div style={{
          position: 'absolute', right: '40px', top: '50%',
          transform: 'translateY(-50%)', zIndex: 2,
          width: '320px', borderRadius: '20px', padding: '32px',
          backgroundColor: 'rgba(13,11,32,0.98)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.15)',
          boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>Status</span>
            <span style={{
              fontSize: '12px', padding: '5px 12px', borderRadius: '100px', fontWeight: 700,
              backgroundColor: 'rgba(0,255,255,0.12)', color: '#00FFFF',
            }}>🟢 Open</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
            {[
              { label: 'Interest rate', value: '9.5%' },
              { label: 'Duration', value: '36 months' },
              { label: 'Grace period', value: '6 months' },
              { label: 'Min. investment', value: '€500' },
            ].map((row, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px' }}>
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>{row.label}</span>
                <span style={{ fontWeight: 700 }}>{row.value}</span>
              </div>
            ))}
          </div>
          <div style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px', color: 'rgba(255,255,255,0.4)' }}>
              <span>€{(campaign?.raised_amount ?? 312000).toLocaleString('en-GB')} raised</span>
              <span style={{ color: 'white', fontWeight: 700 }}>{raisedPct.toFixed(0)}%</span>
            </div>
            <div style={{ width: '100%', height: '4px', borderRadius: '100px', backgroundColor: 'rgba(255,255,255,0.08)' }}>
              <div style={{
                width: `${raisedPct}%`, height: '4px', borderRadius: '100px',
                backgroundColor: '#00FFFF', boxShadow: '0 0 8px rgba(0,255,255,0.5)',
              }} />
            </div>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '6px' }}>
              €{(campaign?.target_amount ?? 500000).toLocaleString('en-GB')} target
            </p>
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginTop: '4px' }}>
            🛡️ Capital protected by the fleet
          </div>
        </div>
      </div>

      {/* ── SIMULATOR ── */}
      <div style={{
        margin: '16px 40px 0',
        borderRadius: '24px', overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 24px 80px rgba(0,0,0,0.3)',
        display: 'grid', gridTemplateColumns: '1fr 1fr',
      }}>
        {/* Left — input */}
        <div style={{ padding: '40px', backgroundColor: '#1E1B4B' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '4px' }}>Simulate your returns</h2>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginBottom: '28px' }}>
            36 months · 9.5% annual · 6-month grace period
          </p>
          <div style={{
            borderRadius: '14px', padding: '16px 20px',
            backgroundColor: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            fontSize: '32px', fontWeight: 800, textAlign: 'center',
            color: '#00FFFF', letterSpacing: '-1px', marginBottom: '12px',
          }}>
            €{amount.toLocaleString('en-GB')}
          </div>
          <input
            type="range" min={500} max={50000} step={500} value={amount}
            onChange={e => setAmount(Number(e.target.value))}
            style={{ accentColor: '#00FFFF', width: '100%', cursor: 'pointer' }}
          />
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '4px', marginBottom: '24px',
          }}>
            <span>€500</span><span>€50,000</span>
          </div>

          {/* Fleet equivalent */}
          <div style={{
            marginBottom: '24px', padding: '10px 14px', borderRadius: '10px',
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

          {/* Term pills */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '28px' }}>
            {[
              { icon: '📅', label: '36 months' },
              { icon: '📈', label: '9.5% / year' },
              { icon: '🛡️', label: '6-month grace' },
            ].map((pill, i) => (
              <span key={i} style={{
                fontSize: '11px', padding: '6px 12px', borderRadius: '100px',
                backgroundColor: 'rgba(0,255,255,0.06)',
                border: '1px solid rgba(0,255,255,0.12)',
                color: 'rgba(255,255,255,0.6)',
              }}>
                {pill.icon} {pill.label}
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '16px', fontSize: '12px' }}>
            <span style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'underline', cursor: 'pointer' }}>
              Tax information
            </span>
            <span style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'underline', cursor: 'pointer' }}>
              Investment note
            </span>
          </div>
        </div>

        {/* Right — results */}
        <div style={{ padding: '40px', backgroundColor: '#0D0D2B', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '6px' }}>You receive</p>
            <p style={{ fontSize: '52px', fontWeight: 800, color: '#00FFFF', letterSpacing: '-2px', lineHeight: 1 }}>
              €{monthlyGrace.toFixed(2)}
            </p>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginTop: '4px', marginBottom: '28px' }}>
              per month — grace period
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '24px' }}>
              {[
                { label: 'Monthly (months 7–36)', sub: 'capital + interest', value: `€${monthlyRepayment.toFixed(2)}`, highlight: false },
                { label: 'Total interest earned', sub: 'over 36 months', value: `€${totalInterest.toFixed(2)}`, highlight: false },
                { label: 'Total repaid', sub: 'at end of term', value: `€${totalRepaid.toFixed(2)}`, highlight: true },
              ].map((item, i) => (
                <div key={i} style={{
                  borderRadius: '14px', padding: '14px 16px',
                  backgroundColor: item.highlight ? 'rgba(0,255,255,0.08)' : 'rgba(255,255,255,0.04)',
                  border: item.highlight ? '1px solid rgba(0,255,255,0.2)' : '1px solid rgba(255,255,255,0.06)',
                }}>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginBottom: '4px', lineHeight: 1.3 }}>
                    {item.label}<br />
                    <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)' }}>{item.sub}</span>
                  </p>
                  <p style={{ fontSize: '20px', fontWeight: 800, color: item.highlight ? 'white' : '#00FFFF', letterSpacing: '-0.5px' }}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <Link
            href={`/investir?campaignId=${campaign?.id}&amount=${amount}`}
            style={{
              display: 'block', textAlign: 'center',
              backgroundColor: '#00FFFF', color: '#13102B',
              padding: '16px', borderRadius: '14px',
              fontSize: '15px', fontWeight: 800, textDecoration: 'none',
              boxShadow: '0 4px 24px rgba(0,255,255,0.25)',
            }}>
            Invest now →
          </Link>
        </div>
      </div>

      {/* ── ABOUT ── */}
      <div style={{ margin: '80px 40px 0' }}>
        <p style={{
          fontSize: '11px', fontWeight: 700, letterSpacing: '3px',
          color: '#00FFFF', textTransform: 'uppercase', marginBottom: '16px',
        }}>About this campaign</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '48px', alignItems: 'start' }}>
          <div>
            <h2 style={{ fontSize: '32px', fontWeight: 800, lineHeight: 1.1, marginBottom: '16px' }}>
              Spring 2026 Fleet
            </h2>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)' }}>April 2026 — July 2026</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ fontSize: '15px', lineHeight: '1.7', color: 'rgba(255,255,255,0.6)' }}>
              This campaign finances the acquisition and deployment of new Pony electric bikes and scooters
              across French cities. Your investment goes directly into the fleet that riders use every day.
            </p>
            <p style={{ fontSize: '15px', lineHeight: '1.7', color: 'rgba(255,255,255,0.6)' }}>
              Unlike the previous Adopt a Pony model, you do not own a specific vehicle — you finance the
              entire fleet, which reduces risk and simplifies your experience.
            </p>
            <p style={{ fontSize: '15px', lineHeight: '1.7', color: 'rgba(255,255,255,0.6)' }}>
              During the first 6 months (grace period), you receive interest-only payments. From month 7,
              you receive a fixed monthly payment covering both capital repayment and interest until maturity at month 36.
            </p>
            <div style={{
              borderRadius: '16px', padding: '20px',
              backgroundColor: 'rgba(0,255,255,0.05)',
              border: '1px solid rgba(0,255,255,0.12)',
            }}>
              <p style={{ fontSize: '12px', fontWeight: 700, color: '#00FFFF', marginBottom: '4px' }}>⚠️ Risk notice</p>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: '1.6' }}>
                All investments carry risk, including the risk of partial or total capital loss.
                Past performance is not a guarantee of future results.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── KEY NUMBERS ── */}
      <div style={{
        margin: '80px 40px 0',
        borderRadius: '24px', padding: '48px',
        backgroundColor: 'rgba(30,27,75,0.5)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}>
        <p style={{
          fontSize: '11px', fontWeight: 700, letterSpacing: '3px',
          color: '#00FFFF', textTransform: 'uppercase', marginBottom: '32px',
        }}>Key numbers</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0' }}>
          {[
            { value: '50', label: 'Vehicles financed' },
            { value: '5', label: 'French cities' },
            { value: '9.5%', label: 'Annual rate' },
            { value: '36m', label: 'Duration' },
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
        </div>
      </div>

      {/* ── CTA ── */}
      <div style={{
        margin: '80px 40px 0', borderRadius: '24px', padding: '64px',
        background: 'linear-gradient(135deg, #1E1B4B 0%, #0D0D2B 100%)',
        border: '1px solid rgba(255,255,255,0.08)',
        textAlign: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,255,255,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <p style={{
          fontSize: '11px', fontWeight: 700, letterSpacing: '3px',
          color: '#00FFFF', textTransform: 'uppercase', marginBottom: '16px',
        }}>Limited spots available</p>
        <h2 style={{ fontSize: '42px', fontWeight: 800, letterSpacing: '-1px', marginBottom: '16px', lineHeight: 1.1 }}>
          Ready to invest?
        </h2>
        <p style={{
          fontSize: '16px', color: 'rgba(255,255,255,0.5)',
          maxWidth: '480px', margin: '0 auto 32px', lineHeight: '1.6',
        }}>
          Join the investors financing Pony's fleet and earning up to 9.5% annual returns, paid monthly.
        </p>
        <Link
          href={`/investir?campaignId=${campaign?.id}&amount=5000`}
          style={{
            display: 'inline-block',
            backgroundColor: '#00FFFF', color: '#13102B',
            padding: '16px 48px', borderRadius: '14px',
            fontSize: '16px', fontWeight: 800, textDecoration: 'none',
            boxShadow: '0 4px 32px rgba(0,255,255,0.35)',
          }}>
          Invest now →
        </Link>
      </div>

      {/* ── FAQ ── */}
      <FaqSection />

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.05)',
        padding: '32px 40px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <img src="/Logo.png" alt="Pony" style={{ height: '22px', width: 'auto' }} />
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)', textAlign: 'center', maxWidth: '400px' }}>
          All investments carry risk, including the risk of capital loss.
        </p>
        <div style={{ display: 'flex', gap: '24px', fontSize: '12px' }}>
          <a href="#" style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>Privacy policy</a>
          <a href="#" style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>Terms</a>
        </div>
      </footer>

    </main>
  )
}