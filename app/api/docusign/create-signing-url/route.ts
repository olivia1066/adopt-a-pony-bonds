import { NextResponse } from 'next/server'
import docusign from 'docusign-esign'

export async function POST(request: Request) {
  try {
    // === 1. Variables d'environnement ===
    const integrationKey = process.env.DOCUSIGN_INTEGRATION_KEY!
    const userId = process.env.DOCUSIGN_USER_ID!
    const accountId = process.env.DOCUSIGN_ACCOUNT_ID!
    const authBaseUri = process.env.DOCUSIGN_AUTH_BASE_URI!
    const apiBaseUri = process.env.DOCUSIGN_API_BASE_URI!
    const privateKey = Buffer.from(process.env.DOCUSIGN_PRIVATE_KEY_BASE64!, 'base64').toString('utf8')
    const templateId = process.env.DOCUSIGN_TEMPLATE_ID_OS1!

    // === 2. Données de l'investisseur (depuis le body POST) ===
    const body = await request.json()
    const {
      email,
      firstName,
      lastName,
      amount,
      birthDate = '01/01/1990',
      birthCity = 'Paris',
      address = '',
      zipCity = '',
      city = 'Paris',
    } = body

    if (!email || !firstName || !lastName || !amount) {
      return NextResponse.json(
        { success: false, error: 'Champs requis : email, firstName, lastName, amount' },
        { status: 400 },
      )
    }

    const fullName = `${firstName} ${lastName}`.trim()
    const investorAmount = parseInt(String(amount), 10)

    // === 3. Auth JWT ===
    const apiClient = new docusign.ApiClient()
    apiClient.setOAuthBasePath(authBaseUri)
    const results = await apiClient.requestJWTUserToken(
      integrationKey,
      userId,
      ['signature', 'impersonation'],
      privateKey,
      3600,
    )
    const accessToken = results.body.access_token
    apiClient.setBasePath(`${apiBaseUri}/restapi`)
    apiClient.addDefaultHeader('Authorization', `Bearer ${accessToken}`)

    // === 4. Préparation des données à injecter ===
    const today = new Date()
    const dateStr = today.toLocaleDateString('fr-FR')
    const reference = `OS1-2026-${Date.now().toString().slice(-6)}`

    const textTab = (anchor: string, value: string) => ({
      anchorString: anchor,
      anchorUnits: 'pixels',
      anchorXOffset: '0',
      anchorYOffset: '0',
      anchorIgnoreIfNotPresent: 'true',
      value,
      font: 'helvetica',
      fontSize: 'size10',
    })

    const textTabs = [
      textTab('\\fullname1\\', fullName),
      textTab('\\r2\\', birthDate),
      textTab('\\r3\\', birthCity),
      textTab('\\address1\\', address || 'Non renseignée'),
      textTab('\\zipcity1\\', zipCity || 'Non renseigné'),
      textTab('\\amount1\\', `${investorAmount} euros`),
      textTab('\\nbOS1\\', `${investorAmount}`),
      textTab('\\city1\\', city),
      textTab('\\datesigned1\\', dateStr),
      textTab('\\reference1\\', reference),
    ]

    // === 5. Configuration du destinataire pour EMBEDDED SIGNING ===
    const clientUserId = `pony-${Date.now()}`

    const signer = {
      email,
      name: fullName,
      roleName: 'investisseur',
      clientUserId,
      tabs: {
        textTabs: textTabs,
        signHereTabs: [
          {
            anchorString: '\\sig1\\',
            anchorUnits: 'pixels',
            anchorXOffset: '0',
            anchorYOffset: '0',
            anchorIgnoreIfNotPresent: 'true',
          },
        ],
      },
    }

    // === 6. Création de l'enveloppe ===
    const envelopeDefinition = {
      templateId,
      templateRoles: [signer],
      status: 'sent',
      emailSubject: `Votre contrat de souscription Pony Bonds OS 1 - 2026`,
    }

    const envelopesApi = new docusign.EnvelopesApi(apiClient)
    const envelopeResult = await envelopesApi.createEnvelope(accountId, {
      envelopeDefinition,
    })

    const envelopeId = envelopeResult.envelopeId!
    console.log('✅ Enveloppe créée (embedded):', envelopeId)

    // === 7. Génération de l'URL de signature embarquée (Focused View) ===
    const baseUrl = new URL(request.url).origin

    // ⚠️ Passage en PRODUCTION DocuSign : remplacer 'https://apps-d.docusign.com'
    //    par 'https://apps.docusign.com' (et le bundle JS dans investir/page.tsx).
    const recipientViewRequest = {
      authenticationMethod: 'none',
      clientUserId,
      recipientId: '1',
      returnUrl: `${baseUrl}/fr/investir`,
      userName: fullName,
      email,
      frameAncestors: [baseUrl, 'https://apps-d.docusign.com'],
      messageOrigins: ['https://apps-d.docusign.com'],
    }

    const viewResult = await envelopesApi.createRecipientView(accountId, envelopeId, {
      recipientViewRequest,
    })

    console.log('✅ URL de signature générée')

    // Force l'interface de signature en français (append &locale=fr).
    const signingUrl = `${viewResult.url}&locale=fr`

    // === 8. Réponse ===
    return NextResponse.json({
      success: true,
      envelopeId,
      reference,
      signingUrl,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue'
    const stack = error instanceof Error ? error.stack : undefined
    console.error('❌ Erreur DocuSign embedded:', error)
    return NextResponse.json(
      { success: false, error: message, stack },
      { status: 500 },
    )
  }
}