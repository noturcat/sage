"use client"

import { ReactNode, useEffect, useState } from 'react'
import { NextIntlClientProvider, type AbstractIntlMessages } from 'next-intl'
import enMessages from '../i18n/messages/en.json'

type I18nProviderProps = {
  children: ReactNode
}

async function loadMessages(locale: string): Promise<AbstractIntlMessages> {
  try {
    const messages = await import(`../i18n/messages/${locale}.json`)
    return messages.default
  } catch {
    const fallback = await import('../i18n/messages/en.json')
    return fallback.default
  }
}

export default function I18nProvider({ children }: I18nProviderProps) {
  const [locale, setLocale] = useState<string>('en')
  const [messages, setMessages] = useState<AbstractIntlMessages>(enMessages as AbstractIntlMessages)

  useEffect(() => {
    const match = document.cookie.match(/(?:^|; )NEXT_LOCALE=([^;]+)/)
    const cookieLocale = match ? decodeURIComponent(match[1]) : 'en'
    if (cookieLocale !== locale) {
      setLocale(cookieLocale)
      loadMessages(cookieLocale).then((m) => setMessages(m))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const timeZone = process.env.NEXT_PUBLIC_TIME_ZONE || 'UTC'

  return (
    <NextIntlClientProvider locale={locale} messages={messages} timeZone={timeZone}>
      {children}
    </NextIntlClientProvider>
  )
}


