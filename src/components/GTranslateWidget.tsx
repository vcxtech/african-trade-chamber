'use client'

import { useEffect } from 'react'

const GTRANSLATE_SETTINGS = {
  default_language: 'en',
  detect_browser_language: true,
  languages: ['en', 'fr', 'es'],
  alt_flags: {
    en: 'https://cdn.gtranslate.net/flags/svg/countries/us.svg',
  },
  wrapper_selector: '.gtranslate_wrapper',
  switcher_horizontal_position: 'left',
  switcher_vertical_position: 'bottom',
}

declare global {
  interface Window {
    gtranslateSettings?: typeof GTRANSLATE_SETTINGS
  }
}

export function GTranslateWidget() {
  useEffect(() => {
    window.gtranslateSettings = GTRANSLATE_SETTINGS

    const existing = document.querySelector('script[data-atc-gtranslate]')
    if (existing) return

    const script = document.createElement('script')
    script.src = 'https://cdn.gtranslate.net/widgets/latest/float.js'
    script.defer = true
    script.setAttribute('data-atc-gtranslate', 'true')
    document.body.appendChild(script)

    return () => {
      script.remove()
    }
  }, [])

  return <div className="gtranslate_wrapper" />
}
