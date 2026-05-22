'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Link, useRouter, usePathname } from '@/i18n/navigation'

export default function Header() {
  const t = useTranslations('header')
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  function switchLocale(target: 'fr' | 'en') {
    if (target !== locale) {
      router.replace(pathname, { locale: target })
    }
    setMenuOpen(false)
  }

  return (
    <>
      <header className="site-header" style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0 48px', height: '64px',
        backgroundColor: 'rgba(19,16,43,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <nav className="header-nav-desktop" style={{ display: 'flex', gap: '32px', fontSize: '14px' }}>
          <Link href="/" style={{ color: 'white', textDecoration: 'none' }}>
            {t('home')}
          </Link>
          <Link href="/campagne" style={{ color: 'white', textDecoration: 'none' }}>
            {t('campaigns')}
          </Link>
        </nav>

        <div className="header-logo" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
          <Link href="/">
            <img src="/Logo.png" alt="Pony" style={{ height: '28px', width: 'auto' }} />
          </Link>
        </div>

        <div className="header-right-desktop" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700 }}>
            <button onClick={() => switchLocale('fr')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px', color: locale === 'fr' ? '#00FFFF' : 'rgba(255,255,255,0.4)' }}>FR</button>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>/</span>
            <button onClick={() => switchLocale('en')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px', color: locale === 'en' ? '#00FFFF' : 'rgba(255,255,255,0.4)' }}>EN</button>
          </div>
          <a href="#" style={{ fontSize: '13px', fontWeight: 700, color: '#13102B', backgroundColor: '#00FFFF', padding: '8px 16px', borderRadius: '10px', textDecoration: 'none' }}>
            {t('bookMeeting')}
          </a>
        </div>

        <button className="header-burger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu" style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: '8px', color: 'white', fontSize: '24px', marginLeft: 'auto' }}>
          {menuOpen ? '\u2715' : '\u2630'}
        </button>
      </header>

      {menuOpen && (
        <div className="mobile-menu-overlay" style={{ position: 'fixed', top: '64px', left: 0, right: 0, bottom: 0, zIndex: 49, backgroundColor: 'rgba(19,16,43,0.98)', backdropFilter: 'blur(12px)', display: 'flex', flexDirection: 'column', padding: '40px 24px', gap: '24px' }}>
          <Link href="/" onClick={() => setMenuOpen(false)} style={{ color: 'white', textDecoration: 'none', fontSize: '20px', fontWeight: 700 }}>
            {t('home')}
          </Link>
          <Link href="/campagne" onClick={() => setMenuOpen(false)} style={{ color: 'white', textDecoration: 'none', fontSize: '20px', fontWeight: 700 }}>
            {t('campaigns')}
          </Link>
          <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.1)', margin: '8px 0' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '16px', fontWeight: 700 }}>
            <button onClick={() => switchLocale('fr')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', color: locale === 'fr' ? '#00FFFF' : 'rgba(255,255,255,0.4)' }}>FR</button>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>/</span>
            <button onClick={() => switchLocale('en')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', color: locale === 'en' ? '#00FFFF' : 'rgba(255,255,255,0.4)' }}>EN</button>
          </div>
          <a href="#" onClick={() => setMenuOpen(false)} style={{ fontSize: '15px', fontWeight: 700, color: '#13102B', backgroundColor: '#00FFFF', padding: '14px 20px', borderRadius: '12px', textDecoration: 'none', textAlign: 'center', marginTop: '8px' }}>
            {t('bookMeeting')}
          </a>
        </div>
      )}
    </>
  )
}
