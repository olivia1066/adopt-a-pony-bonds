'use client'

import { useTranslations, useLocale } from 'next-intl'
import { Link, useRouter, usePathname } from '@/i18n/navigation'

export default function Header() {
  const t = useTranslations('header')
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  function switchLocale(target: 'fr' | 'en') {
    if (target !== locale) {
      router.replace(pathname, { locale: target })
    }
  }

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '0 48px', height: '64px',
      backgroundColor: 'rgba(19,16,43,0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}>
      {/* Left nav */}
      <nav style={{ display: 'flex', gap: '32px', fontSize: '14px' }}>
        <Link href="/" style={{ color: 'white', textDecoration: 'none' }}>
          {t('home')}
        </Link>
        <Link href="/campagne" style={{ color: 'white', textDecoration: 'none' }}>
          {t('campaigns')}
        </Link>
      </nav>

      {/* Center logo */}
      <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
        <Link href="/">
          <img src="/Logo.png" alt="Pony" style={{ height: '28px', width: 'auto' }} />
        </Link>
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* Language switch */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700 }}>
          <button
            onClick={() => switchLocale('fr')}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px',
              color: locale === 'fr' ? '#00FFFF' : 'rgba(255,255,255,0.4)',
            }}>
            FR
          </button>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>/</span>
          <button
            onClick={() => switchLocale('en')}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px',
              color: locale === 'en' ? '#00FFFF' : 'rgba(255,255,255,0.4)',
            }}>
            EN
          </button>
        </div>

        {/* Book a meeting CTA */}
        <a href="#" style={{
          fontSize: '13px', fontWeight: 700,
          color: '#13102B', backgroundColor: '#00FFFF',
          padding: '8px 16px', borderRadius: '10px',
          textDecoration: 'none',
        }}>
          {t('bookMeeting')}
        </a>
      </div>
    </header>
  )
}