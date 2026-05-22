'use client'

import { useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'

// ── Responsive hook ──
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return isMobile
}

function TestimonialsSection() {
  const t = useTranslations('home.testimonials')
  const [current, setCurrent] = useState(0)

  const testimonials = [
    { name: 'Hugo',    key: '1',  titleColor: '#FF6B6B', cardColor: 'linear-gradient(135deg, #FF6B6B 0%, #C44B4B 100%)' },
    { name: 'Vincent', key: '2',  titleColor: '#00FFFF', cardColor: 'linear-gradient(135deg, #00BFFF 0%, #0066CC 100%)' },
    { name: 'Marie',   key: '3',  titleColor: '#A78BFA', cardColor: 'linear-gradient(135deg, #A78BFA 0%, #6D28D9 100%)' },
    { name: 'Thomas',  key: '4',  titleColor: '#34D399', cardColor: 'linear-gradient(135deg, #34D399 0%, #059669 100%)' },
    { name: 'Camille', key: '5',  titleColor: '#FBBF24', cardColor: 'linear-gradient(135deg, #FBBF24 0%, #D97706 100%)' },
    { name: 'Antoine', key: '6',  titleColor: '#F472B6', cardColor: 'linear-gradient(135deg, #F472B6 0%, #DB2777 100%)' },
    { name: 'Lucie',   key: '7',  titleColor: '#00FFFF', cardColor: 'linear-gradient(135deg, #2DD4BF 0%, #0D9488 100%)' },
    { name: 'Maxime',  key: '8',  titleColor: '#FB923C', cardColor: 'linear-gradient(135deg, #FB923C 0%, #EA580C 100%)' },
    { name: 'Sophie',  key: '9',  titleColor: '#A78BFA', cardColor: 'linear-gradient(135deg, #818CF8 0%, #4F46E5 100%)' },
    { name: 'Romain',  key: '10', titleColor: '#4ADE80', cardColor: 'linear-gradient(135deg, #4ADE80 0%, #16A34A 100%)' },
  ]

  const prev = () => setCurrent(i => (i - 1 + testimonials.length) % testimonials.length)
  const next = () => setCurrent(i => (i + 1) % testimonials.length)

  const getVisible = () => {
    const indices = []
    for (let i = 0; i < 3; i++) {
      indices.push((current + i) % testimonials.length)
    }
    return indices
  }

  return (
    <section style={{
      padding: '120px 96px',
      borderTop: '1px solid rgba(255,255,255,0.05)',
      backgroundColor: '#13102B',
    }}>
      <div style={{ marginBottom: '64px' }}>
        <h2 style={{ fontSize: '38px', fontWeight: 800, marginBottom: '16px' }}>
          {t('title')}
        </h2>
        <p style={{ fontSize: '16px', color: 'white', maxWidth: '400px', lineHeight: '1.6' }}>
          {t('subtitle')}
        </p>
      </div>

      <div style={{ display: 'flex', gap: '24px', marginBottom: '40px' }}>
        {getVisible().map((idx, pos) => {
          const tm = testimonials[idx]
          return (
            <div key={idx} style={{
              flex: '0 0 calc(33.333% - 16px)',
              borderRadius: '24px',
              overflow: 'hidden',
              backgroundColor: '#1E1B4B',
              border: '1px solid rgba(255,255,255,0.08)',
              opacity: pos === 2 ? 0.4 : 1,
              transition: 'opacity 0.3s',
              position: 'relative',
            }}>
              <div style={{ position: 'absolute', bottom: '160px', left: '-60px', width: '220px', height: '220px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', bottom: '80px', right: '-40px', width: '160px', height: '160px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', top: '200px', right: '-20px', width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />

              <div style={{ padding: '28px 28px 16px', textAlign: 'center' }}>
                <p style={{ fontWeight: 700, fontSize: '16px', marginBottom: '4px' }}>{tm.name}</p>
                <p style={{ fontSize: '14px', color: tm.titleColor, fontWeight: 600 }}>{t(`${tm.key}.title`)}</p>
              </div>

              <div style={{ padding: '0 20px 20px' }}>
                <div style={{ borderRadius: '16px', overflow: 'hidden', position: 'relative' }}>
                  <div style={{ height: '280px', background: tm.cardColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}>👤</div>
                  </div>
                  <div style={{ backgroundColor: 'white', padding: '20px' }}>
                    <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#1E1B4B', fontWeight: 500 }}>
                      {t(`${tm.key}.quote`)}
                    </p>
                  </div>
                </div>
              </div>

              <div style={{ padding: '0 28px 24px', display: 'flex', gap: '16px', alignItems: 'center', justifyContent: 'flex-end' }}>
                <span style={{ fontSize: '14px', cursor: 'pointer', color: 'white', fontWeight: 700 }}>𝕏</span>
                <span style={{ fontSize: '14px', cursor: 'pointer', color: 'white', fontWeight: 700 }}>in</span>
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <button onClick={prev} style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', fontSize: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>
        <button onClick={next} style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#00FFFF', border: 'none', color: '#13102B', fontSize: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>›</button>
        <span style={{ fontSize: '13px', color: 'white', marginLeft: '8px' }}>
          {current + 1} / {testimonials.length}
        </span>
      </div>
    </section>
  )
}

// ── Campaign status (TEMP — to be replaced by Supabase) ──
type CampaignStatus = 'ongoing' | 'coming_soon' | 'sold_out'
const CAMPAIGN_STATUS: CampaignStatus = 'coming_soon'

function FAQSection() {
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
    <section style={{ padding: '120px 96px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '38px', fontWeight: 800, letterSpacing: '-1px' }}>{t('title')}</h2>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '900px' }}>
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
    </section>
  )
}

function AngelPerksSection() {
  const t = useTranslations('home.angelPerks')
  const [activeIndex, setActiveIndex] = useState(0)

  const items = [
    { icon: '👑', titleKey: 'item1Title', descKey: 'item1Desc', imageIndex: 0 },
    { icon: '🎁', titleKey: 'item2Title', descKey: 'item2Desc', imageIndex: 1 },
    { icon: '📰', titleKey: 'item3Title', descKey: 'item3Desc', imageIndex: 2 },
    { icon: '📡', titleKey: 'item4Title', descKey: 'item4Desc', imageIndex: 2 },
  ]

  // Auto-rotation every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % items.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [items.length])

  const currentImageIndex = items[activeIndex].imageIndex

  return (
    <section style={{ padding: '120px 96px' }}>
      <h2 style={{ fontSize: '34px', fontWeight: 800, lineHeight: '1.3', color: 'white', maxWidth: '1100px', marginBottom: '96px' }}>
        {t('title')}
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
        {/* LEFT — Image carousel */}
        <div style={{ position: 'relative', height: '400px', borderRadius: '16px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px dashed rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>
            Image {currentImageIndex + 1} à venir
          </span>
        </div>

        {/* RIGHT — 4 items, only one active */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {items.map((item, i) => {
            const isActive = i === activeIndex
            return (
              <div
                key={i}
                onClick={() => setActiveIndex(i)}
                style={{
                  cursor: 'pointer',
                  opacity: isActive ? 1 : 0.3,
                  transition: 'opacity 0.4s',
                }}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', marginBottom: '16px' }}>
                  {item.icon}
                </div>
                <h3 style={{ fontWeight: 700, fontSize: '20px', marginBottom: '8px', color: 'white' }}>
                  {t(item.titleKey)}
                </h3>
                <p style={{ fontSize: '15px', color: 'white', lineHeight: '1.6' }}>
                  {t(item.descKey)}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
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

export default function Home() {
  const locale = useLocale()
  const t = useTranslations('home')
  const [amount, setAmount] = useState(2000)
  const isMobile = useIsMobile()

  const { monthlyPayment, totalInterest, totalRepaid } = calcReturns(amount)

  // Number formatting helpers based on locale
  const numberLocale = locale === 'fr' ? 'fr-FR' : 'en-GB'
  const fmtInt = (n: number) => new Intl.NumberFormat(numberLocale, { maximumFractionDigits: 0 }).format(n)
  const fmtDec = (n: number) => new Intl.NumberFormat(numberLocale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)

  return (
    <main className="min-h-screen font-sans" style={{ backgroundColor: '#13102B', color: 'white' }}>

      {/* ── HERO ── */}
      <section className="hero-section" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        <div className="hero-bg-image" style={{ position: 'absolute', inset: 0, zIndex: 0, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <img src="/Rectangle (1).png" alt=""
            style={{
              height: '90%', width: 'auto', objectFit: 'contain',
              opacity: 0.18, marginRight: '5%',
              maskImage: 'linear-gradient(to left, rgba(0,0,0,0.9) 40%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,0.9) 40%, transparent 100%)',
            }} />
        </div>
        <div className="hero-glow" style={{ position: 'absolute', top: '50%', left: '15%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,255,255,0.06) 0%, transparent 70%)', zIndex: 0, pointerEvents: 'none' }} />

        <div className="hero-container" style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '60px',
          padding: '80px 64px 80px 96px',
          width: '100%',
          position: 'relative',
          zIndex: 1
        }}>
          {/* Left */}
          <div className="hero-left" style={{
            flex: '0 0 auto',
            maxWidth: '500px',
            marginTop: '-80px',
            marginLeft: '80px'
          }}>
            <div style={{ marginBottom: '28px' }}>
              <img src="/Icon (1).png" alt="Pony Angel" style={{ width: '52px', height: '52px', borderRadius: '14px' }} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <h1 className="hero-title" style={{
                fontSize: '50px',
                lineHeight: '1.0',
                fontWeight: 800,
                letterSpacing: '-2px',
                whiteSpace: 'nowrap'
              }}>
                {t('hero.title')}
              </h1>
            </div>
            <p className="hero-subtitle" style={{ color: 'white', fontSize: '16px', fontWeight: 500, lineHeight: '1.5', marginBottom: '32px' }}>
              {t('hero.subtitle1')}{' '}
              <span style={{ color: '#00FFFF', fontWeight: 600 }}>8,5 %</span>{t('hero.subtitle2')}
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link href="/campagne" style={{ backgroundColor: '#00FFFF', color: '#13102B', padding: '14px 28px', borderRadius: '12px', fontSize: '14px', fontWeight: 600, letterSpacing: '0.3px', textDecoration: 'none'}}>
                {t('hero.cta')}
              </Link>
              <a href="#" style={{ backgroundColor: 'transparent', color: '#00FFFF', padding: '14px 28px', borderRadius: '12px', fontSize: '14px', fontWeight: 600, letterSpacing: '0.3px', textDecoration: 'none', border: '2px solid #00FFFF' }}>
                {t('hero.bookMeeting')}
              </a>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '32px', padding: '8px 16px', borderRadius: '100px', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex' }}>
                {['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'].map((c, i) => (
                  <div key={i} style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: c, border: '2px solid #13102B', marginLeft: i > 0 ? '-8px' : '0' }} />
                ))}
              </div>
              <span style={{ fontSize: '12px', color: 'white' }}>
                <span style={{ color: 'white', fontWeight: 700 }}>500k+</span> {t('hero.usersBadge')}
              </span>
            </div>
            <p style={{ marginTop: '16px', fontSize: '13px', color: 'white', lineHeight: '1.5', paddingLeft: '4px' }}>
              {t('hero.riskNotice')}
            </p>
          </div>

          {/* Right: simulator (2 columns) */}
          <div className="hero-right" style={{
            flex: '0 0 720px',
            marginLeft: 'auto',
            marginTop: '-80px',
            marginRight: '80px'
          }}>
            <div className="simulator-grid" style={{
              borderRadius: '24px',
              backgroundColor: 'rgba(30,27,75,0.9)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,255,255,0.05)',
              overflow: 'hidden',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr'
            }}>

              {/* LEFT — INPUT */}
              <div className="simulator-input" style={{ padding: '32px', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
                <p style={{ fontSize: '18px', fontWeight: 700, color: 'white', marginBottom: '20px' }}>
                  {t('simulator.ifYouInvestWith')}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '13px', color: 'white' }}>{t('simulator.iWantToInvest')}</span>
                  <span className="simulator-amount" style={{ fontSize: '32px', fontWeight: 800, color: '#00FFFF', letterSpacing: '-1px', lineHeight: 1 }}>
                    €{fmtInt(amount)}
                  </span>
                </div>

                <input
                  type="range" min={500} max={200000} step={500} value={amount}
                  onChange={e => setAmount(Number(e.target.value))}
                  style={{ accentColor: '#00FFFF', width: '100%', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'white', marginTop: '2px' }}>
                  <span>€500</span><span>€200,000</span>
                </div>

                <div style={{ marginTop: '20px', padding: '10px 14px', borderRadius: '10px', backgroundColor: 'rgba(0,255,255,0.06)', border: '1px solid rgba(0,255,255,0.12)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px' }}>🛴</span>
                  <span style={{ fontSize: '12px', color: 'white', lineHeight: 1.4 }}>
                    {t('simulator.fleetFinances')}{' '}
                    <span style={{ color: '#00FFFF', fontWeight: 700 }}>
                      {amount / 2100 < 1 ? (amount / 2100).toFixed(1) : Math.floor(amount / 2100)} {t('simulator.ebikes')}
                    </span>
                    {' '}{t('simulator.inFleet')}
                  </span>
                </div>

                <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.06)', margin: '28px -32px 20px' }} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {[
                    { label: t('simulator.duration'), value: t('simulator.durationValue') },
                    { label: t('simulator.rate'), value: t('simulator.rateValue') },
                    { label: t('simulator.capital'), value: t('simulator.capitalValue') },
                    { label: t('simulator.gracePeriod'), value: t('simulator.gracePeriodValue') },
                  ].map((row, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1px 0' }}>
                      <span style={{ fontSize: '13px', color: 'white' }}>{row.label}</span>
                      <span style={{ fontSize: '12px', fontWeight: 700, padding: '3px 12px', borderRadius: '6px', backgroundColor: 'rgba(0,255,255,0.1)', border: '1px solid rgba(0,255,255,0.2)', color: '#00FFFF' }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT — RESULTS */}
              <div className="simulator-results" style={{ padding: '32px', backgroundColor: 'rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column' }}>
                <p style={{ fontSize: '18px', fontWeight: 700, color: 'white', marginBottom: '20px' }}>
                  {t('simulator.youReceive')}
                </p>

                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '4px', marginBottom: '24px' }}>
                  <span className="simulator-monthly" style={{ fontSize: '32px', fontWeight: 800, color: '#00FFFF', letterSpacing: '-1px', lineHeight: 1 }}>
                    €{fmtDec(monthlyPayment)}
                  </span>
                  <span title={t('simulator.paymentDetails')} style={{ fontSize: '14px', color: '#00FFFF', cursor: 'help' }}>*</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                  <div style={{ padding: '14px 18px', borderRadius: '10px', backgroundColor: 'rgba(0,255,255,0.08)', border: '1px solid rgba(0,255,255,0.25)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ fontSize: '13px', color: 'white', fontWeight: 700 }}>{t('simulator.totalRepaid')}</p>
                    <p style={{ fontSize: '20px', fontWeight: 800, color: 'white', letterSpacing: '-0.5px' }}>
                      €{fmtInt(totalRepaid)}
                    </p>
                  </div>
                  <div style={{ padding: '14px 18px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ fontSize: '13px', color: 'white', fontWeight: 700 }}>{t('simulator.totalInterest')}</p>
                    <p style={{ fontSize: '20px', fontWeight: 800, color: 'white', letterSpacing: '-0.5px' }}>
                      €{fmtInt(totalInterest)}
                    </p>
                  </div>
                </div>

                <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)', fontStyle: 'italic', marginBottom: '16px', lineHeight: 1.4 }}>
                  *{t('simulator.paymentDetails')}
                </p>

                <Link href="/campagne" style={{ display: 'block', width: '100%', textAlign: 'center', backgroundColor: '#00FFFF', color: '#13102B', padding: '14px', borderRadius: '10px', fontSize: '14px', fontWeight: 800, textDecoration: 'none', marginTop: 'auto' }}>
                  {t('hero.cta')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRESS ── */}
      <section className="press-section" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '48px 96px', marginBottom: '80px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '48px' }}>
        {[
          { name: 'Maddyness', url: 'https://www.maddyness.com' },
          { name: 'le Bonbon', url: 'https://www.lebonbon.fr' },
          { name: 'TRAX', url: 'https://www.traxmag.com' },
          { name: 'LE FIGARO', url: 'https://www.lefigaro.fr' },
        ].map((press, i, arr) => (
          <div key={i} className="press-item" style={{ flex: '1', textAlign: 'center', borderRight: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none', padding: '0 32px' }}>
            <a href={press.url} target="_blank" rel="noopener noreferrer">
              <div style={{ height: '32px', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', color: 'white' }}>
                {press.name} logo
              </div>
            </a>
          </div>
        ))}
      </section>

      {/* ── MISSION ── */}
      <section className="mission-section" style={{ padding: '120px 96px' }}>
        <h2 className="mission-title" style={{ fontSize: '34px', fontWeight: 800, lineHeight: '1.3', color: 'white', maxWidth: '1100px', marginBottom: '176px' }}>
          {t('mission.title')}
        </h2>

        <div className="mission-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 360px)', gap: '80px', justifyContent: 'space-between', marginBottom: '64px' }}>
          {[
            { emoji: '🛴', title: t('mission.item1Title'), desc: t('mission.item1Desc') },
            { emoji: '📅', title: t('mission.item2Title'), desc: t('mission.item2Desc') },
            { emoji: '🎮', title: t('mission.item3Title'), desc: t('mission.item3Desc') },
          ].map((item, i) => (
            <div key={i}>
              <div style={{ width: '64px', height: '64px', borderRadius: '18px', backgroundColor: 'rgba(0,255,255,0.08)', border: '1px solid rgba(0,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', marginBottom: '24px' }}>
                {item.emoji}
              </div>
              <h3 style={{ fontWeight: 700, fontSize: '20px', marginBottom: '8px', color: 'white' }}>{item.title}</h3>
              <p style={{ fontSize: '15px', color: 'white', lineHeight: '1.6' }}>{item.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link href="/campagne" style={{ backgroundColor: '#00FFFF', color: '#13102B', padding: '14px 28px', borderRadius: '12px', fontSize: '14px', fontWeight: 600, letterSpacing: '0.3px', textDecoration: 'none' }}>
            {t('hero.cta')}
          </Link>
          <a href="#" style={{ backgroundColor: 'transparent', color: '#00FFFF', padding: '14px 28px', borderRadius: '12px', fontSize: '14px', fontWeight: 600, letterSpacing: '0.3px', textDecoration: 'none', border: '2px solid #00FFFF' }}>
            {t('hero.bookMeeting')}
          </a>
        </div>
      </section>

      {/* ── CAMPAIGN + STATS ── */}
      <section className="campaign-section" style={{ padding: '120px 96px', display: 'flex', alignItems: 'center', position: 'relative' }}>

        {/* LEFT — STATS COLUMN */}
        <div className="campaign-stats" style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', gap: '48px', marginLeft: '250px' }}>
          {[
            { value: '22', label: t('stats.cities') },
            { value: '500+', label: t('stats.users') },
            { value: '95%', label: t('stats.co2') },
            { value: '20,000', label: t('stats.riders') },
          ].map((stat, i) => (
            <div key={i}>
              <p style={{ fontSize: '52px', fontWeight: 800, color: '#00FFFF', letterSpacing: '-1px', lineHeight: 1 }}>
                {stat.value}
              </p>
              <p style={{ marginTop: '8px', fontSize: '11px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: '#00FFFF' }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* CENTER — CAMPAIGN CARD */}
        <div className="campaign-card" style={{ position: 'absolute', left: '50%', transform: 'translateX(calc(-50% + 160px))', width: '500px', borderRadius: '24px', padding: '32px', backgroundColor: 'rgba(30,27,75,0.9)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,255,255,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            {/* Status badge */}
            <div style={{ marginBottom: '24px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 12px', borderRadius: '100px', backgroundColor: 'rgba(0,255,255,0.12)', color: '#00FFFF', letterSpacing: '1px' }}>
                {CAMPAIGN_STATUS === 'ongoing' ? t('campaignCard.statusOngoing') : CAMPAIGN_STATUS === 'coming_soon' ? t('campaignCard.statusComingSoon') : t('campaignCard.statusSoldOut')}
              </span>
            </div>

            {/* Title + description */}
            <h3 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '8px' }}>{t('campaignCard.title')}</h3>
            <p style={{ fontSize: '14px', color: 'white', lineHeight: '1.6', marginBottom: '24px' }}>
              {t('campaignCard.subtitle')}
            </p>

            {/* Separator */}
            <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.06)', margin: '0 -32px 24px' }} />

            {/* Terms — 4 lines, simulator style */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
              {[
                { label: t('simulator.duration'), value: t('simulator.durationValue') },
                { label: t('simulator.rate'), value: t('simulator.rateValue') },
                { label: t('simulator.capital'), value: t('simulator.capitalValue') },
                { label: t('simulator.gracePeriod'), value: t('simulator.gracePeriodValue') },
              ].map((row, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '3px 0' }}>
                  <span style={{ fontSize: '13px', color: 'white' }}>{row.label}</span>
                  <span style={{ fontSize: '12px', fontWeight: 700, padding: '3px 12px', borderRadius: '6px', backgroundColor: 'rgba(0,255,255,0.1)', border: '1px solid rgba(0,255,255,0.2)', color: '#00FFFF' }}>{row.value}</span>
                </div>
              ))}
            </div>

            {/* Progress bar — only if ongoing or sold_out */}
            {CAMPAIGN_STATUS !== 'coming_soon' && (
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px', color: 'white' }}>
                  <span>€{fmtInt(CAMPAIGN_STATUS === 'sold_out' ? 500000 : 312000)} {t('campaignCard.raised')}</span>
                  <span style={{ fontWeight: 700, color: 'white' }}>{CAMPAIGN_STATUS === 'sold_out' ? '100%' : '62%'}</span>
                </div>
                <div style={{ width: '100%', height: '4px', borderRadius: '100px', backgroundColor: 'rgba(255,255,255,0.08)' }}>
                  <div style={{ width: CAMPAIGN_STATUS === 'sold_out' ? '100%' : '62%', height: '4px', borderRadius: '100px', backgroundColor: '#00FFFF' }} />
                </div>
                <p style={{ fontSize: '11px', color: 'white', marginTop: '6px' }}>€{fmtInt(500000)} {t('campaignCard.target')}</p>
              </div>
            )}
          </div>

          <Link href="/campagne" style={{ display: 'block', textAlign: 'center', backgroundColor: '#00FFFF', color: '#13102B', padding: '15px', borderRadius: '12px', fontSize: '14px', fontWeight: 800, textDecoration: 'none' }}>
            {t('campaignCard.cta')}
          </Link>
        </div>
      </section>

      {/* ── WHY INVEST ── */}
      <section className="why-section" style={{ padding: '120px 96px', borderTop: '1px solid rgba(255,255,255,0.05)', backgroundColor: '#0D0B20' }}>
        <p style={{
          fontSize: '11px', fontWeight: 700, letterSpacing: '3px',
          color: '#00FFFF', textTransform: 'uppercase', marginBottom: '96px',
        }}>{t('whyInvest.kicker')}</p>

        {/* Ligne 1 — 3 items */}
        <div className="why-row1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '64px', marginBottom: '80px' }}>
          {[
            { icon: '🛡️', title: t('whyInvest.item1Title'), desc: t('whyInvest.item1Desc') },
            { icon: '📈', title: t('whyInvest.item2Title'), desc: t('whyInvest.item2Desc') },
            { icon: '🏙️', title: t('whyInvest.item3Title'), desc: t('whyInvest.item3Desc') },
          ].map((item, i) => (
            <div key={i}>
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', marginBottom: '24px' }}>
                {item.icon}
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>{item.title}</h3>
              <p style={{ fontSize: '15px', lineHeight: '1.6', color: 'white' }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Ligne 2 — 2 items centrés */}
        <div className="why-row2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '64px', maxWidth: 'calc(66.666% - 21px)', margin: '0 auto' }}>
          {[
            { icon: '🌱', title: t('whyInvest.item4Title'), desc: t('whyInvest.item4Desc') },
            { icon: '📡', title: t('whyInvest.item5Title'), desc: t('whyInvest.item5Desc') },
          ].map((item, i) => (
            <div key={i}>
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', marginBottom: '24px' }}>
                {item.icon}
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>{item.title}</h3>
              <p style={{ fontSize: '15px', lineHeight: '1.6', color: 'white' }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── WAITLIST ── (visible only if coming_soon or sold_out) */}
      {CAMPAIGN_STATUS !== 'ongoing' && (
        <section style={{ padding: '120px 96px' }}>
          <div style={{ borderRadius: '24px', backgroundColor: '#321E64', padding: '64px', display: 'flex', alignItems: 'center', gap: '80px', maxWidth: 'calc(100% - 320px)', margin: '0 auto' }}>

            {/* LEFT — Image placeholder */}
            <div style={{ flex: '0 0 400px', height: '300px', borderRadius: '16px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px dashed rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>Image à venir</span>
            </div>

            {/* RIGHT — Form */}
            <div style={{ flex: '1' }}>
              <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '16px', color: 'white' }}>
                {t('waitlist.title')}
              </h2>
              <p style={{ fontSize: '16px', color: 'white', lineHeight: '1.6', marginBottom: '8px' }}>
                {t('waitlist.subtitle1')}
              </p>
              <p style={{ fontSize: '16px', color: 'white', lineHeight: '1.6', marginBottom: '32px' }}>
                {t('waitlist.subtitle2')}
              </p>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'white', marginBottom: '8px' }}>
                  {t('waitlist.emailLabel')}*
                </label>
                <input
                  type="email"
                  placeholder={t('waitlist.emailPlaceholder')}
                  disabled
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'white',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
              </div>

              <button
                disabled
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '10px',
                  backgroundColor: '#00FFFF',
                  color: '#13102B',
                  fontSize: '14px',
                  fontWeight: 800,
                  border: 'none',
                  cursor: 'not-allowed',
                  opacity: 0.7,
                }}
              >
                {t('waitlist.submit')}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ── LIMITED RISKS ── */}
      <section style={{ padding: '120px 96px', borderTop: '1px solid rgba(255,255,255,0.05)', backgroundColor: '#0D0B20' }}>
        <p style={{
          fontSize: '11px', fontWeight: 700, letterSpacing: '3px',
          color: '#00FFFF', textTransform: 'uppercase', marginBottom: '96px',
        }}>{t('limitedRisks.kicker')}</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '55px' }}>
          {[
            { icon: '🛡️', title: t('limitedRisks.item1Title'), desc: t('limitedRisks.item1Desc') },
            { icon: '🔒', title: t('limitedRisks.item2Title'), desc: t('limitedRisks.item2Desc') },
            { icon: '🤝', title: t('limitedRisks.item3Title'), desc: t('limitedRisks.item3Desc') },
            { icon: '⚖️', title: t('limitedRisks.item4Title'), desc: t('limitedRisks.item4Desc') },
          ].map((item, i) => (
            <div key={i} style={{
              padding: '24px',
              borderRadius: '24px',
              backgroundColor: 'rgba(30,27,75,0.9)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,255,255,0.05)',
            }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', marginBottom: '24px' }}>
                {item.icon}
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>{item.title}</h3>
              <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'white' }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW WE OPERATE ── */}
      <section style={{ display: 'flex', alignItems: 'stretch', overflow: 'hidden', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ flex: '0 0 55%', backgroundColor: '#321E64', padding: '120px 96px' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '3px', color: '#00FFFF', textTransform: 'uppercase', marginBottom: '20px' }}>{t('howWeOperate.kicker')}</p>
          <h2 style={{ fontSize: '38px', fontWeight: 800, lineHeight: '1.1', marginBottom: '64px' }}>
            {t('howWeOperate.title')}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '64px' }}>
            {[
              { icon: '🔋', title: t('howWeOperate.item1Title'), desc: t('howWeOperate.item1Desc') },
              { icon: '🪖', title: t('howWeOperate.item2Title'), desc: t('howWeOperate.item2Desc') },
              { icon: '📱', title: t('howWeOperate.item3Title'), desc: t('howWeOperate.item3Desc') },
              { icon: '🏙️', title: t('howWeOperate.item4Title'), desc: t('howWeOperate.item4Desc') },
            ].map((item, i) => (
              <div key={i}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', marginBottom: '20px' }}>
                  {item.icon}
                </div>
                <h3 style={{ fontWeight: 700, fontSize: '20px', marginBottom: '8px', color: 'white' }}>{item.title}</h3>
                <p style={{ fontSize: '15px', color: 'white', lineHeight: '1.6', maxWidth: '1000px' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: '1', position: 'relative', overflow: 'hidden' }}>
          <img src="/hero-photo2.jpg" alt="Pony fleet"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
          />
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,200,255,0.55)', mixBlendMode: 'color' }} />
          <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '120px', clipPath: 'polygon(0 0, 100% 0, 0 100%)', backgroundColor: '#321E64' }} />
        </div>
      </section>

      {/* ── ANGEL PERKS ── */}
      <AngelPerksSection />

      {/* ── COMPARISON TABLE ── */}
      <section style={{ padding: '120px 96px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '3px', color: '#00FFFF', textTransform: 'uppercase', marginBottom: '20px' }}>{t('comparison.kicker')}</p>
        <h2 style={{ fontSize: '38px', fontWeight: 800, lineHeight: 1.1, marginBottom: '64px' }}>
          {t('comparison.title1')}<br />{t('comparison.title2')}
        </h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr>
                <th style={{ width: '180px', padding: '16px 20px', textAlign: 'left' }} />
                <th style={{ padding: '20px 24px', textAlign: 'center', backgroundColor: '#00FFFF', borderRadius: '16px 16px 0 0', color: '#13102B' }}>
                  <img src="/Logo.png" alt="Pony" style={{ height: '20px', width: 'auto', filter: 'invert(1) brightness(0)' }} />
                  <p style={{ fontSize: '11px', fontWeight: 700, marginTop: '4px', color: '#13102B' }}>{t('comparison.ponyLabel')}</p>
                </th>
                {['Livret A', 'Assurance vie', 'Crowdfunding\nimmo', 'Bourse'].map((col, i) => (
                  <th key={i} style={{ padding: '16px 20px', textAlign: 'center', color: 'white', fontWeight: 600, fontSize: '13px' }}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label: t('comparison.rateLabel'), pony: t('simulator.rateValue'), others: ['3%', '3–4%', '8–12%', '5–7%'], highlight: true },
                { label: t('comparison.durationLabel'), pony: t('comparison.ponyDuration'), others: [t('comparison.livretADuration'), t('comparison.assuranceVieDuration'), t('comparison.crowdfundingDuration'), t('comparison.bourseDuration')], highlight: false },
                { label: t('comparison.monthlyPaymentsLabel'), pony: '✅', others: ['❌', '❌', '❌', '❌'], highlight: false },
                { label: t('comparison.capitalLabel'), pony: '✅', others: ['✅', t('comparison.partial'), '❌', '❌'], highlight: false },
                { label: t('comparison.feesLabel'), pony: '0%', others: ['0%', '1–3%', '0–5%', '0–3%'], highlight: false },
                { label: t('comparison.amfLabel'), pony: '✅', others: ['✅', '✅', '✅', '✅'], highlight: false },
                { label: t('comparison.assetLabel'), pony: t('comparison.ponyAsset'), others: ['❌', '❌', t('comparison.property'), '❌'], highlight: false },
              ].map((row, rowIndex) => (
                <tr key={rowIndex} style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <td style={{ padding: '18px 20px', color: 'rgba(255,255,255,0.55)', fontSize: '13px', fontWeight: 500 }}>{row.label}</td>
                  <td style={{ padding: '18px 24px', textAlign: 'center', backgroundColor: row.highlight ? 'rgba(0,255,255,0.15)' : 'rgba(0,255,255,0.06)', borderLeft: '1px solid rgba(0,255,255,0.2)', borderRight: '1px solid rgba(0,255,255,0.2)', color: '#00FFFF', fontWeight: 800, fontSize: '15px' }}>{row.pony}</td>
                  {row.others.map((val, i) => (
                    <td key={i} style={{ padding: '18px 20px', textAlign: 'center', color: 'white', fontSize: '13px' }}>{val}</td>
                  ))}
                </tr>
              ))}
              <tr>
                <td />
                <td style={{ backgroundColor: 'rgba(0,255,255,0.06)', borderLeft: '1px solid rgba(0,255,255,0.2)', borderRight: '1px solid rgba(0,255,255,0.2)', borderBottom: '2px solid rgba(0,255,255,0.3)', borderRadius: '0 0 16px 16px', height: '8px' }} />
                {[0,1,2,3].map(i => <td key={i} />)}
              </tr>
            </tbody>
          </table>
        </div>
        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', marginTop: '24px', textAlign: 'center' }}>
          {t('comparison.disclaimer')}
        </p>
      </section>

      {/* ── TESTIMONIALS ── */}
      <TestimonialsSection />

      {/* ── FAQ ── */}
      <FAQSection />

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '40px 96px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <img src="/Logo.png" alt="Pony" style={{ height: '22px', width: 'auto' }} />
        <p style={{ fontSize: '12px', color: 'white', maxWidth: '400px', textAlign: 'center' }}>
          {t('footer.disclaimer')}
        </p>
        <div style={{ display: 'flex', gap: '24px', fontSize: '12px' }}>
          <a href="#" style={{ color: 'white', textDecoration: 'none' }}>{t('footer.privacy')}</a>
          <a href="#" style={{ color: 'white', textDecoration: 'none' }}>{t('footer.terms')}</a>
          <Link href="/admin" style={{ color: 'rgba(255,255,255,0.15)', textDecoration: 'none' }}>{t('footer.admin')}</Link>
        </div>
      </footer>

    </main>
  )
}