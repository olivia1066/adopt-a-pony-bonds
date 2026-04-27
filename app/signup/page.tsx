'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Signup() {
  const router = useRouter()
  const [step, setStep] = useState(1)
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
      setError('Veuillez remplir tous les champs.')
      return
    }

    if (form.password !== form.confirmPassword) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }

    if (form.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.')
      return
    }

    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            prenom: form.prenom,
            nom: form.nom,
          }
        }
      })

      if (error) throw error

      // Create investor record
      await supabase.from('investors').insert({
        prenom: form.prenom,
        nom: form.nom,
        email: form.email,
        kyc_status: 'En attente',
      })

      setStep(2)
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue')
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

        {step === 1 && (
          <>
            <h1 className="text-2xl font-bold mb-2 text-center">Créer un compte</h1>
            <p className="text-sm text-center mb-8" style={{color: 'rgba(255,255,255,0.4)'}}>
              Rejoignez la communauté des investisseurs Pony
            </p>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs mb-1 block" style={{color: 'rgba(255,255,255,0.5)'}}>Prénom</label>
                  <input type="text" value={form.prenom} onChange={e => update('prenom', e.target.value)}
                    className={inputClass} style={inputStyle} />
                </div>
                <div>
                  <label className="text-xs mb-1 block" style={{color: 'rgba(255,255,255,0.5)'}}>Nom</label>
                  <input type="text" value={form.nom} onChange={e => update('nom', e.target.value)}
                    className={inputClass} style={inputStyle} />
                </div>
              </div>

              <div>
                <label className="text-xs mb-1 block" style={{color: 'rgba(255,255,255,0.5)'}}>Email</label>
                <input type="email" value={form.email} onChange={e => update('email', e.target.value)}
                  className={inputClass} style={inputStyle} />
              </div>

              <div>
                <label className="text-xs mb-1 block" style={{color: 'rgba(255,255,255,0.5)'}}>Mot de passe</label>
                <input type="password" value={form.password} onChange={e => update('password', e.target.value)}
                  className={inputClass} style={inputStyle} />
                <p className="text-xs mt-1" style={{color: 'rgba(255,255,255,0.3)'}}>Minimum 8 caractères</p>
              </div>

              <div>
                <label className="text-xs mb-1 block" style={{color: 'rgba(255,255,255,0.5)'}}>Confirmer le mot de passe</label>
                <input type="password" value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)}
                  className={inputClass} style={inputStyle} />
              </div>

              {error && (
                <p className="text-sm px-4 py-3 rounded-xl"
                  style={{backgroundColor: 'rgba(255,100,100,0.15)', color: '#FF6464'}}>
                  {error}
                </p>
              )}

              <button onClick={handleSignup} disabled={loading}
                className="w-full py-4 rounded-xl font-bold text-sm"
                style={{backgroundColor: '#00E5CC', color: '#0D0D2B', opacity: loading ? 0.7 : 1}}>
                {loading ? 'Création du compte...' : 'Créer mon compte →'}
              </button>

              <p className="text-center text-sm" style={{color: 'rgba(255,255,255,0.4)'}}>
                Déjà un compte ?{' '}
                <Link href="/login" style={{color: '#00E5CC'}}>Se connecter</Link>
              </p>
            </div>
          </>
        )}

        {step === 2 && (
          <div className="text-center space-y-6">
            <div className="text-6xl">📧</div>
            <h2 className="text-2xl font-bold">Vérifiez votre email !</h2>
            <p className="text-sm" style={{color: 'rgba(255,255,255,0.5)'}}>
              Un email de confirmation a été envoyé à <strong>{form.email}</strong>. 
              Cliquez sur le lien pour activer votre compte.
            </p>
            <Link href="/login"
              className="inline-block px-8 py-3 rounded-xl text-sm font-bold"
              style={{backgroundColor: '#00E5CC', color: '#0D0D2B'}}>
              Aller à la connexion →
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}