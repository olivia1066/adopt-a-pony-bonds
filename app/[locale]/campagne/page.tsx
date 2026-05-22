'use client'

import { useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { supabase } from '@/lib/supabase'
import { Link } from '@/i18n/navigation'

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

// ── Product terms ──
const ANNUAL_RATE = 0.085
const MONTHLY_RATE = ANNUAL_RATE / 12
const GRACE_MONTHS = 12
const PAYBACK_MONTHS = 36

function calcReturns(amount: number) {
  const capitalAfterGrace = amount * Math.pow(1 + MONTHLY_RATE, GRACE_MONTHS)
  const paybackInterest = capitalAfterGrace * ANNUAL_RATE * (PAYBACK_MONTHS / 12)
  const monthlyPayment = (capitalAfterGrace + paybackInterest) / PAYBACK_MONTHS
  const totalRepaid = capitalAfterGrace + paybackInterest
  const totalInterest = totalRepaid - amount
  return { capitalAfterGrace, paybackInterest, monthlyPayment, totalRepaid, totalInterest }
}

function FaqSection() {
  const t = useTranslations('campagne.faq')
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    { q: t('q1'), a: t('soon') },
    { q: t('q2'), a: t('soon') },
    { q: t('q3'), a: t('soon') },
    { q: t('q4'), a: t('soon') },
    { q: t('q5'), a: t('soon') },
  ]

  return (
    <div style={{ margin: '80px 200px', paddingBottom: '40px' }}>
      <div style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '56px', fontWeight: 800, letterSpacing: '-2px' }}>{t('title')}</h2>
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
                color: 'white',
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
  const t = useTranslations('campagne')
  const locale = useLocale()
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

  const { monthlyPayment, totalInterest, totalRepaid } = calcReturns(amount)
  const raisedPct = campaign
    ? Math.min((campaign.raised_amount / campaign.target_amount) * 100, 100)
    : 62

  // Number formatting helpers
  const numberLocale = locale === 'fr' ? 'fr-FR' : 'en-GB'
  const fmtInt = (n: number) => new Intl.NumberFormat(numberLocale, { maximumFractionDigits: 0 }).format(n)
  const fmtDec = (n: number) => new Intl.NumberFormat(numberLocale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)

  if (loading) return (
    <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#13102B' }}>
      <p style={{ color: '#00FFFF' }}>{t('loading')}</p>
    </main>
  )

  return (
    <main className="min-h-screen font-sans" style={{ backgroundColor: '#13102B', color: 'white' }}>

      {/* ── BACK ── */}
      <div className="campagne-back" style={{ padding: '16px 40px' }}>
        <Link href="/" style={{ fontSize: '13px', color: 'white', textDecoration: 'none' }}>
          {t('back')}
        </Link>
      </div>

      {/* ── HERO ── */}
      <div className="campagne-hero" style={{
        margin: '0 200px', borderRadius: '24px', overflow: 'hidden',
        position: 'relative', minHeight: '420px',
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

        <div className="campagne-hero-content" style={{ position: 'absolute', bottom: 0, left: 0, padding: '40px', zIndex: 2 }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <span style={{
              fontSize: '11px', padding: '4px 12px', borderRadius: '100px', fontWeight: 600,
              backgroundColor: 'rgba(0,255,255,0.12)', color: '#00FFFF',
            }}>{t('hero.tagUrban')}</span>
            <span style={{
              fontSize: '11px', padding: '4px 12px', borderRadius: '100px', fontWeight: 600,
              backgroundColor: 'rgba(255,255,255,0.08)', color: 'white',
            }}>{t('hero.tagCities')}</span>
          </div>
          <h1 style={{ fontSize: '48px', fontWeight: 800, letterSpacing: '-1.5px', lineHeight: 1.05, marginBottom: '10px' }}>
            {campaign?.name || t('hero.defaultName')}
          </h1>
          <p style={{ fontSize: '16px', color: 'white', maxWidth: '480px' }}>
            {t('hero.subtitle')}
          </p>
        </div>

        <div className="campagne-hero-card" style={{
          position: 'absolute', right: '40px', top: '50%',
          transform: 'translateY(-50%)', zIndex: 2,
          width: '320px', borderRadius: '20px', padding: '32px',
          backgroundColor: 'rgba(13,11,32,0.98)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.15)',
          boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <span style={{ fontSize: '14px', color: 'white' }}>{t('hero.statusLabel')}</span>
            <span style={{
              fontSize: '12px', padding: '5px 12px', borderRadius: '100px', fontWeight: 700,
              backgroundColor: 'rgba(0,255,255,0.12)', color: '#00FFFF',
            }}>{t('hero.statusOpen')}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
            {[
              { label: t('hero.interestRate'), value: t('simulator.rateValue') },
              { label: t('hero.duration'), value: t('simulator.durationValue') },
              { label: t('hero.capital'), value: t('hero.capitalValue') },
              { label: t('hero.minInvestment'), value: '€500' },
            ].map((row, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px' }}>
                <span style={{ color: 'white' }}>{row.label}</span>
                <span style={{ fontWeight: 700, color: 'white' }}>{row.value}</span>
              </div>
            ))}
          </div>
          <div style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px', color: 'white' }}>
              <span>€{fmtInt(campaign?.raised_amount ?? 312000)} {t('hero.raised')}</span>
              <span style={{ fontWeight: 700 }}>{raisedPct.toFixed(0)}%</span>
            </div>
            <div style={{ width: '100%', height: '4px', borderRadius: '100px', backgroundColor: 'rgba(255,255,255,0.08)' }}>
              <div style={{
                width: `${raisedPct}%`, height: '4px', borderRadius: '100px',
                backgroundColor: '#00FFFF',
              }} />
            </div>
            <p style={{ fontSize: '11px', color: 'white', marginTop: '6px' }}>
              €{fmtInt(campaign?.target_amount ?? 500000)} {t('hero.target')}
            </p>
          </div>
          <div style={{ fontSize: '12px', color: 'white', marginTop: '4px' }}>
            {t('hero.protected')}
          </div>
        </div>
      </div>

      {/* ── SIMULATOR ── */}
      <div className="campagne-simulator" style={{
        margin: '16px 200px 0',
        borderRadius: '24px', overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 24px 80px rgba(0,0,0,0.3)',
        display: 'grid', gridTemplateColumns: '1fr 1fr',
      }}>
        {/* Left — input */}
        <div className="campagne-sim-input" style={{ padding: '40px', backgroundColor: '#1E1B4B' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '22px', fontWeight: 800, color: 'white' }}>{t('simulator.ifYouInvest')}</span>
            <span className="campagne-sim-amount" style={{ fontSize: '28px', fontWeight: 800, color: '#00FFFF', letterSpacing: '-1px' }}>
              €{fmtInt(amount)}
            </span>
          </div>
          <input
            type="range" min={500} max={50000} step={500} value={amount}
            onChange={e => setAmount(Number(e.target.value))}
            style={{ accentColor: '#00FFFF', width: '100%', cursor: 'pointer' }}
          />
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            fontSize: '11px', color: 'white', marginTop: '4px', marginBottom: '20px',
          }}>
            <span>€500</span><span>€50,000</span>
          </div>

          <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.06)', marginBottom: '20px' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '20px' }}>
            {[
              { label: t('simulator.duration'), value: t('simulator.durationValue') },
              { label: t('simulator.rate'), value: t('simulator.rateValue') },
              { label: t('simulator.capital'), value: t('simulator.capitalValue') },
            ].map((row, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '4px 0',
              }}>
                <span style={{ fontSize: '13px', color: 'white' }}>{row.label}</span>
                <span style={{
                  fontSize: '12px', fontWeight: 700,
                  padding: '3px 12px', borderRadius: '6px',
                  backgroundColor: 'rgba(0,255,255,0.1)',
                  border: '1px solid rgba(0,255,255,0.2)',
                  color: '#00FFFF',
                }}>{row.value}</span>
              </div>
            ))}
          </div>

          <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.06)', marginBottom: '20px' }} />

          <div style={{
            marginBottom: '28px', padding: '10px 14px', borderRadius: '10px',
            backgroundColor: 'rgba(0,255,255,0.06)',
            border: '1px solid rgba(0,255,255,0.12)',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            <span style={{ fontSize: '16px' }}>🛴</span>
            <span style={{ fontSize: '12px', color: 'white' }}>
              {t('simulator.fleetFinances')}{' '}
              <span style={{ color: '#00FFFF', fontWeight: 700 }}>
                {amount / 2100 < 1 ? (amount / 2100).toFixed(1) : Math.floor(amount / 2100)} {t('simulator.ebikes')}
              </span>
              {' '}{t('simulator.inFleet')}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '16px', fontSize: '12px' }}>
            <span style={{ color: 'white', textDecoration: 'underline', cursor: 'pointer' }}>
              {t('simulator.taxInfo')}
            </span>
            <span style={{ color: 'white', textDecoration: 'underline', cursor: 'pointer' }}>
              {t('simulator.investmentNote')}
            </span>
          </div>
        </div>

        {/* Right — results */}
        <div className="campagne-sim-results" style={{ padding: '40px', backgroundColor: '#0D0D2B', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '22px', fontWeight: 800, color: 'white' }}>{t('simulator.receiveMonthly')}</span>
              <span className="campagne-sim-monthly" style={{ fontSize: '52px', fontWeight: 800, color: '#00FFFF', letterSpacing: '-2px', lineHeight: 1 }}>
                €{fmtDec(monthlyPayment)}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
              <p style={{ fontSize: '12px', color: 'white' }}>
                {t('simulator.fromMonth13')}
              </p>
              <a href="#" style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                fontSize: '12px', color: 'white',
                textDecoration: 'none',
                padding: '6px 12px', borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.15)',
              }}>
                {t('simulator.paymentSchedule')}
              </a>
            </div>

           <div className="campagne-sim-summary" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '24px' }}>
              <div style={{
                borderRadius: '14px', padding: '20px',
                backgroundColor: 'rgba(0,255,255,0.08)',
                border: '1px solid rgba(0,255,255,0.2)',
                display: 'flex', flexDirection: 'column', justifyContent: 'center',
              }}>
                <p style={{ fontSize: '12px', color: 'white', fontWeight: 700, marginBottom: '8px' }}>
                  {t('simulator.totalRepaid')}
                </p>
                <p style={{ fontSize: '32px', fontWeight: 800, color: 'white', letterSpacing: '-1px' }}>
                  €{fmtInt(totalRepaid)}
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{
                  borderRadius: '14px', padding: '16px', flex: 1,
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}>
                  <p style={{ fontSize: '11px', color: 'white', marginBottom: '6px' }}>{t('simulator.totalInterest')}</p>
                  <p style={{ fontSize: '20px', fontWeight: 800, color: '#00FFFF', letterSpacing: '-0.5px' }}>
                    €{fmtInt(totalInterest)}
                  </p>
                </div>
                <div style={{
                  borderRadius: '14px', padding: '16px', flex: 1,
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}>
                  <p style={{ fontSize: '11px', color: 'white', marginBottom: '6px' }}>{t('simulator.capitalInvested')}</p>
                  <p style={{ fontSize: '20px', fontWeight: 800, color: '#00FFFF', letterSpacing: '-0.5px' }}>
                    €{fmtInt(amount)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Link
            href={`/investir?campaignId=${campaign?.id}&amount=${amount}`}
            style={{
              display: 'block', textAlign: 'center',
              backgroundColor: '#00FFFF', color: '#13102B',
              padding: '16px', borderRadius: '14px',
              fontSize: '15px', fontWeight: 800, textDecoration: 'none',
            }}>
            {t('simulator.investNow')}
          </Link>
        </div>
      </div>

      {/* ── ABOUT ── */}
      <div className="campagne-block campagne-about" style={{ margin: '80px 200px 0' }}>
        <p style={{
          fontSize: '11px', fontWeight: 700, letterSpacing: '3px',
          color: '#00FFFF', textTransform: 'uppercase', marginBottom: '16px',
        }}>{t('about.kicker')}</p>
        <div className="campagne-block-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '48px', alignItems: 'start' }}>
          <div>
            <h2 style={{ fontSize: '32px', fontWeight: 800, lineHeight: 1.1 }}>
              {t('about.title')}
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ fontSize: '15px', lineHeight: '1.7', color: 'white' }}>
              {t('about.paragraph1')}
            </p>
            <p style={{ fontSize: '15px', lineHeight: '1.7', color: 'white' }}>
              {t('about.paragraph2')}
            </p>
            <div style={{
              borderRadius: '16px', padding: '20px',
              backgroundColor: 'rgba(0,255,255,0.05)',
              border: '1px solid rgba(0,255,255,0.12)',
            }}>
              <p style={{ fontSize: '12px', fontWeight: 700, color: '#00FFFF', marginBottom: '4px' }}>{t('about.riskTitle')}</p>
              <p style={{ fontSize: '13px', color: 'white', lineHeight: '1.6' }}>
                {t('about.riskDesc')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── PROCÉDURE ── */}
      <div className="campagne-block" style={{ margin: '80px 200px 0' }}>
        <div className="campagne-block-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '48px', alignItems: 'start' }}>
          <div>
            <h2 style={{ fontSize: '32px', fontWeight: 800, lineHeight: 1.1 }}>
              {t('procedure.title')}
            </h2>
          </div>
          <div>
            <p style={{ fontSize: '15px', lineHeight: '1.7', color: 'white' }}>
              {t('procedure.soon')}
            </p>
          </div>
        </div>
      </div>

      {/* ── PROTECTION DU CAPITAL ── */}
      <div className="campagne-block" style={{ margin: '80px 200px 0' }}>
        <div className="campagne-block-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '48px', alignItems: 'start' }}>
          <div>
            <h2 style={{ fontSize: '32px', fontWeight: 800, lineHeight: 1.1 }}>
              {t('capitalProtection.title')}
            </h2>
          </div>
          <div>
            <p style={{ fontSize: '15px', lineHeight: '1.7', color: 'white' }}>
              {t('capitalProtection.soon')}
            </p>
          </div>
        </div>
      </div>

      {/* ── KEY NUMBERS ── */}
      <div className="campagne-keynumbers" style={{
        margin: '80px 200px 0',
        borderRadius: '24px', padding: '48px',
        backgroundColor: 'rgba(30,27,75,0.5)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}>
        <p style={{
          fontSize: '11px', fontWeight: 700, letterSpacing: '3px',
          color: '#00FFFF', textTransform: 'uppercase', marginBottom: '32px',
        }}>{t('keyNumbers.kicker')}</p>
        <div className="campagne-keynumbers-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0' }}>
          {[
            { value: '50', label: t('keyNumbers.vehicles') },
            { value: '5', label: t('keyNumbers.cities') },
            { value: t('simulator.rateValue'), label: t('keyNumbers.annualRate') },
            { value: '48m', label: t('keyNumbers.duration') },
          ].map((stat, i) => (
            <div key={i} className="campagne-keynumber-item" style={{
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
                color: 'white',
              }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="campagne-cta" style={{
        margin: '80px 200px 0', borderRadius: '24px', padding: '64px',
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
        }}>{t('cta.kicker')}</p>
        <h2 style={{ fontSize: '42px', fontWeight: 800, letterSpacing: '-1px', marginBottom: '16px', lineHeight: 1.1 }}>
          {t('cta.title')}
        </h2>
        <p style={{
          fontSize: '16px', color: 'white',
          maxWidth: '480px', margin: '0 auto 32px', lineHeight: '1.6',
        }}>
          {t('cta.subtitle')}
        </p>
        <Link
          href={`/investir?campaignId=${campaign?.id}&amount=5000`}
          style={{
            display: 'inline-block',
            backgroundColor: '#00FFFF', color: '#13102B',
            padding: '16px 48px', borderRadius: '14px',
            fontSize: '16px', fontWeight: 800, textDecoration: 'none',
          }}>
          {t('cta.button')}
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
        <p style={{ fontSize: '12px', color: 'white', textAlign: 'center', maxWidth: '400px' }}>
          {t('footer.disclaimer')}
        </p>
        <div style={{ display: 'flex', gap: '24px', fontSize: '12px' }}>
          <a href="#" style={{ color: 'white', textDecoration: 'none' }}>{t('footer.privacy')}</a>
          <a href="#" style={{ color: 'white', textDecoration: 'none' }}>{t('footer.terms')}</a>
        </div>
      </footer>

    </main>
  )
}