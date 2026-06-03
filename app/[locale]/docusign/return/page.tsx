'use client'

import { useEffect } from 'react'

export default function DocusignReturn() {
  useEffect(() => {
    // Cette page est chargée DANS l'iframe après signature.
    // DocuSign appende ?event=signing_complete | cancel | decline | ttl_expired ...
    const event = new URLSearchParams(window.location.search).get('event') || 'unknown'
    try {
      window.parent?.postMessage({ type: 'docusign', event }, window.location.origin)
    } catch {
      /* no-op */
    }
  }, [])

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#13102B',
      }}
    >
      <p style={{ color: '#00FFFF', fontSize: 14 }}>Redirection…</p>
    </main>
  )
}