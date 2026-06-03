import { NextResponse } from 'next/server'
import docusign from 'docusign-esign'

export async function GET(request: Request) {
  try {
    // === 1. Variables d'environnement ===
    const integrationKey = process.env.DOCUSIGN_INTEGRATION_KEY!
    const userId = process.env.DOCUSIGN_USER_ID!
    const accountId = process.env.DOCUSIGN_ACCOUNT_ID!
    const authBaseUri = process.env.DOCUSIGN_AUTH_BASE_URI!
    const apiBaseUri = process.env.DOCUSIGN_API_BASE_URI!
    const privateKey = Buffer.from(process.env.DOCUSIGN_PRIVATE_KEY_BASE64!, 'base64').toString('utf8')
    const templateId = process.env.DOCUSIGN_TEMPLATE_ID_OS1!

    // === 2. Données du test (params d'URL ou valeurs par défaut) ===
    const url = new URL(request.url)
    const investorEmail = url.searchParams.get('email') || 'olivia@getapony.com'
    const investorName = url.searchParams.get('name') || 'Olivia Bally'
    const amount = parseInt(url.searchParams.get('amount') || '5000', 10)

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

    const textTab = (anchor: string, value: string, xOffset: number = 0, yOffset: number = 0) => ({
      anchorString: anchor,
      anchorUnits: 'pixels',
      anchorXOffset: String(xOffset),
      anchorYOffset: String(yOffset),
      anchorIgnoreIfNotPresent: 'true',
      value,
      font: 'helvetica',
      fontSize: 'size10',
    })

    const textTabs = [
      textTab('\\fullname1\\', investorName, 0, 0),
      textTab('\\r2\\', '01/01/1990', 0, 0),
      textTab('\\r3\\', 'Paris', 0, 0),
      textTab('\\address1\\', '12 rue de Test', 0, 0),
      textTab('\\zipcity1\\', '75001 Paris', 0, 0),
      textTab('\\amount1\\', `${amount} euros`, 0, 0),
      textTab('\\nbOS1\\', `${amount}`, 0, 0),
      textTab('\\city1\\', 'Paris', 0, 0),
      textTab('\\datesigned1\\', dateStr, 0, 0),
      textTab('\\reference1\\', reference, 0, 0),
    ]

    // === 5. Configuration du destinataire (signer) ===
    const signer = {
      email: investorEmail,
      name: investorName,
      roleName: 'investisseur',
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
      emailBlurb: `Bonjour ${investorName},\n\nMerci de votre intérêt pour Pony Bonds. Veuillez signer votre contrat de souscription pour finaliser votre investissement de ${amount} €.\n\nL'équipe Pony`,
    }

    const envelopesApi = new docusign.EnvelopesApi(apiClient)
    const envelopeResult = await envelopesApi.createEnvelope(accountId, {
      envelopeDefinition,
    })

    console.log('✅ Enveloppe créée:', envelopeResult.envelopeId)

    // === 7. Réponse ===
    return NextResponse.json({
      success: true,
      message: `📧 Contrat envoyé par email à ${investorEmail}`,
      envelopeId: envelopeResult.envelopeId,
      status: envelopeResult.status,
      reference,
      amount,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue'
    const stack = error instanceof Error ? error.stack : undefined
    console.error('❌ Erreur DocuSign:', error)
    return NextResponse.json(
      { success: false, error: message, stack },
      { status: 500 },
    )
  }
}