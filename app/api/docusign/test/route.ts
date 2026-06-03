import { NextResponse } from 'next/server'
import docusign from 'docusign-esign'

export async function GET() {
  try {
    const integrationKey = process.env.DOCUSIGN_INTEGRATION_KEY!
    const userId = process.env.DOCUSIGN_USER_ID!
    const accountId = process.env.DOCUSIGN_ACCOUNT_ID!
    const authBaseUri = process.env.DOCUSIGN_AUTH_BASE_URI!
    const apiBaseUri = process.env.DOCUSIGN_API_BASE_URI!
    const privateKey = Buffer.from(process.env.DOCUSIGN_PRIVATE_KEY_BASE64!, 'base64').toString('utf8')

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

    const accountsApi = new docusign.AccountsApi(apiClient)
    const accountInfo = await accountsApi.getAccountInformation(accountId)

    return NextResponse.json({
      success: true,
      message: 'Hello DocuSign! Connexion reussie.',
      accountName: accountInfo.accountName,
      accountIdHash: accountInfo.accountIdGuid,
      plan: accountInfo.planName,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue'
    const stack = error instanceof Error ? error.stack : undefined
    console.error('Erreur DocuSign:', error)
    return NextResponse.json(
      { success: false, error: message, stack },
      { status: 500 },
    )
  }
}
