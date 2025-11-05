import { getRequestConfig } from 'next-intl/server'
import type { AbstractIntlMessages } from 'next-intl'

export default getRequestConfig(async ({ locale }) => {
  const resolvedLocale = locale ?? 'en'
  const messages = (await import(`./messages/${resolvedLocale}.json`)).default as AbstractIntlMessages
  return { locale: resolvedLocale, messages }
})


