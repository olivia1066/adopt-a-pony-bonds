import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
  serverExternalPackages: ['docusign-esign'],
}

export default withNextIntl(nextConfig)