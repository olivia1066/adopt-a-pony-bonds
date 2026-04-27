'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Login() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const update = (field: string, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }))

  async function handleLogin() {
    setError('')

    if (!form.email || !form.password) {
      setError('Veuillez remplir tous les champs.')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      })

      if (error) throw error

      router.push('/dashboard')
    } catch (err: any) {
      setError('Email ou mot de passe incorrect.')
    }
    setLoading(false)
  }

  const inputClass = "w-full rounded-xl px-4 py-3 text-sm text-white outline-none"
  const inputStyle = {backgroundColor: '#1E1B4B', border: '1px solid rgba(255,255,255,0.1)'}

  return (
    <main className="min-h-screen font-sans flex items-center justify-center"
      style={{backgroundColor: '#0D0D2B', color: 'white'}}>

      <div className="w-full max-w-md px-8 py-12">

        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="text-2xl font-bold" style={{color: '#00E5CC'}}>🐴 pony</Link>
        </div>

        <h1 className="text-2xl font-bold mb-2 text-center">Se connecter</h1>
        <p className="text-sm text-center mb-8" style={{color: 'rgba(255,255,255,0.4)'}}>
          Accédez à votre portfolio d'investissement
        </p>

        <div className="space-y-4">
          <div>
            <label className="text-xs mb-1 block" style={{color: 'rgba(255,255,255,0.5)'}}>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={e => update('email', e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              className={inputClass}
              style={inputStyle}
            />
          </div>

          <div>
            <label className="text-xs mb-1 block" style={{color: 'rgba(255,255,255,0.5)'}}>Mot de passe</label>
            <input
              type="password"
              value={form.password}
              onChange={e => update('password', e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              className={inputClass}
              style={inputStyle}
            />
          </div>

          {error && (
            <p className="text-sm px-4 py-3 rounded-xl"
              style={{backgroundColor: 'rgba(255,100,100,0.15)', color: '#FF6464'}}>
              {error}
            </p>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-4 rounded-xl font-bold text-sm"
            style={{backgroundColor: '#00E5CC', color: '#0D0D2B', opacity: loading ? 0.7 : 1}}>
            {loading ? 'Connexion...' : 'Se connecter →'}
          </button>

          <p className="text-center text-sm" style={{color: 'rgba(255,255,255,0.4)'}}>
            Pas encore de compte ?{' '}
            <Link href="/signup" style={{color: '#00E5CC'}}>Créer un compte</Link>
          </p>

          <p className="text-center text-sm">
            <Link href="/reset-password" className="text-xs" style={{color: 'rgba(255,255,255,0.3)'}}>
              Mot de passe oublié ?
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}