'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/dashboard'

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ email: '', password: '' })

  const update = (field: string, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }))

  async function handleLogin() {
    setError('')
    if (!form.email || !form.password) {
      setError('Please fill in all fields.')
      return
    }
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      })
      if (error) throw error
      router.push(redirect)
    } catch (err: any) {
      setError('Incorrect email or password.')
    }
    setLoading(false)
  }

  const inputClass = "w-full rounded-xl px-4 py-3 text-sm text-white outline-none"
  const inputStyle = { backgroundColor: '#1E1B4B', border: '1px solid rgba(255,255,255,0.1)' }

  return (
    <main className="min-h-screen font-sans flex items-center justify-center"
      style={{ backgroundColor: '#13102B', color: 'white' }}>
      <div className="w-full max-w-md px-8 py-12">

        <div className="text-center mb-10">
          <Link href="/">
            <img src="/Logo.png" alt="Pony" style={{ height: '35px', width: 'auto', margin: '0 auto' }} />
          </Link>
        </div>

        <h1 className="text-2xl font-bold mb-2 text-center">Sign in</h1>
        <p className="text-sm text-center mb-8" style={{ color: 'rgba(255,255,255,0.4)' }}>
          {redirect.includes('/investir')
            ? 'Sign in to continue your investment'
            : 'Access your investment portfolio'}
        </p>

        <div className="space-y-4">
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'rgba(255,255,255,0.5)' }}>Email</label>
            <input type="email" value={form.email}
              onChange={e => update('email', e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              className={inputClass} style={inputStyle} />
          </div>
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'rgba(255,255,255,0.5)' }}>Password</label>
            <input type="password" value={form.password}
              onChange={e => update('password', e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              className={inputClass} style={inputStyle} />
          </div>

          {error && (
            <p className="text-sm px-4 py-3 rounded-xl"
              style={{ backgroundColor: 'rgba(255,100,100,0.15)', color: '#FF6464' }}>
              {error}
            </p>
          )}

          <button onClick={handleLogin} disabled={loading}
            className="w-full py-4 rounded-xl font-bold text-sm"
            style={{ backgroundColor: '#00FFFF', color: '#13102B', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Signing in...' : 'Sign in →'}
          </button>

          <p className="text-center text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
            No account yet?{' '}
            <Link href={`/signup?redirect=${encodeURIComponent(redirect)}`} style={{ color: '#00FFFF' }}>
              Create an account
            </Link>
          </p>

          <p className="text-center text-sm">
            <Link href="/reset-password" className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Forgot your password?
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}

export default function Login() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#13102B' }}>
        <p style={{ color: '#00FFFF' }}>Loading...</p>
      </main>
    }>
      <LoginForm />
    </Suspense>
  )
}