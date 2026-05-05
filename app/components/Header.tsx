'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Header() {
  const router = useRouter()
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession()
      setLoggedIn(!!session)
    }
    checkSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoggedIn(!!session)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  async function handleDashboard() {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      router.push('/dashboard')
    } else {
      router.push('/login?redirect=/dashboard')
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
        <Link href="/" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>
          Home
        </Link>
        <Link href="/campagne" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>
          Campaigns
        </Link>
        <button onClick={handleDashboard} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: '14px', color: 'rgba(255,255,255,0.6)', padding: 0,
        }}>
          My Dashboard
        </button>
      </nav>

      {/* Center logo */}
      <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
        <Link href="/">
          <img src="/Logo.png" alt="Pony" style={{ height: '28px', width: 'auto' }} />
        </Link>
      </div>

      {/* Right */}
      {loggedIn ? (
        <button onClick={handleLogout} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: '14px', color: 'rgba(255,255,255,0.6)', padding: 0,
        }}>
          Sign out
        </button>
      ) : (
        <Link href="/login" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>
          Log in
        </Link>
      )}
    </header>
  )
}