'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

function SignupForm() {
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/dashboard'

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    prenom: '',
    nom: '',
  })

  const update = (field: string, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }))

  async function handleSignup() {
    setError('')
    if (!form.email || !form.password || !form.confirmPassword || !form.prenom || !form.nom) {
      setError('Please fill in all fields.')
      return
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    setLoading(true)
    try {
      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: { prenom: form.prenom, nom: form.nom },
        }
      })
      if (error) throw error
      window.location.href = `/login?redirect=${encodeURIComponent(redirect)}`
    } catch (err: any) {
      setError(err.message || 'An error occurred.')
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

        <h1 className="text-2xl font-bold mb-2 text-center">Create an account</h1>
        <p className="text-sm text-center mb-8" style={{ color: 'rgba(255,255,255,0.4)' }}>
          {redirect.includes('/investir')
            ? 'Create an account to continue your investment'
            : 'Join the Pony investor community'}
        </p>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'rgba(255,255,255,0.5)' }}>First name</label>
              <input type="text" value={form.prenom} onChange={e => update('prenom', e.target.value)}
                className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'rgba(255,255,255,0.5)' }}>Last name</label>
              <input type="text" value={form.nom} onChange={e => update('nom', e.target.value)}
                className={inputClass} style={inputStyle} />
            </div>
          </div>

          <div>
            <label className="text-xs mb-1 block" style={{ color: 'rgba(255,255,255,0.5)' }}>Email</label>
            <input type="email" value={form.email} onChange={e => update('email', e.target.value)}
              className={inputClass} style={inputStyle} />
          </div>

          <div>
            <label className="text-xs mb-1 block" style={{ color: 'rgba(255,255,255,0.5)' }}>Password</label>
            <input type="password" value={form.password} onChange={e => update('password', e.target.value)}
              className={inputClass} style={inputStyle} />
            <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>Minimum 8 characters</p>
          </div>

          <div>
            <label className="text-xs mb-1 block" style={{ color: 'rgba(255,255,255,0.5)' }}>Confirm password</label>
            <input type="password" value={form.confirmPassword}
              onChange={e => update('confirmPassword', e.target.value)}
              className={inputClass} style={inputStyle} />
          </div>

          {error && (
            <p className="text-sm px-4 py-3 rounded-xl"
              style={{ backgroundColor: 'rgba(255,100,100,0.15)', color: '#FF6464' }}>
              {error}
            </p>
          )}

          <button onClick={handleSignup} disabled={loading}
            className="w-full py-4 rounded-xl font-bold text-sm"
            style={{ backgroundColor: '#00FFFF', color: '#13102B', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Creating account...' : 'Create my account →'}
          </button>

          <p className="text-center text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Already have an account?{' '}
            <Link href={`/login?redirect=${encodeURIComponent(redirect)}`} style={{ color: '#00FFFF' }}>
              Log in
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}

export default function Signup() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#13102B' }}>
        <p style={{ color: '#00FFFF' }}>Loading...</p>
      </main>
    }>
      <SignupForm />
    </Suspense>
  )
}