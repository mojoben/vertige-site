// Geo-located dial code for phone fields (Ben, 2026-07-15): derived from the
// browser's locale region — no network call, no permission prompt, no IP
// lookup. Wrong at worst by a guessable default (+44), and the user just
// types over it.

const DIAL: Record<string, string> = {
  GB: '+44', IE: '+353', FR: '+33', CH: '+41', AT: '+43', IT: '+39',
  DE: '+49', ES: '+34', PT: '+351', NL: '+31', BE: '+32', LU: '+352',
  DK: '+45', SE: '+46', NO: '+47', FI: '+358', PL: '+48', CZ: '+420',
  US: '+1', CA: '+1', AU: '+61', NZ: '+64', AE: '+971', SA: '+966',
  QA: '+974', SG: '+65', HK: '+852', ZA: '+27', BR: '+55', MX: '+52',
}

export function localDialCode(): string {
  if (typeof navigator === 'undefined') return '+44'
  const locales = [...(navigator.languages ?? []), navigator.language]
  for (const l of locales) {
    const region = l?.split('-')[1]?.toUpperCase()
    if (region && DIAL[region]) return DIAL[region]
  }
  return '+44'
}

/** onFocus handler: seed an empty phone field with the local dial code. */
export function seedDialCode(value: string, set: (v: string) => void) {
  if (!value.trim()) set(`${localDialCode()} `)
}

/** onFocus handler for uncontrolled inputs (plain form posts). */
export function seedInputDialCode(e: { currentTarget: HTMLInputElement }) {
  if (!e.currentTarget.value.trim()) e.currentTarget.value = `${localDialCode()} `
}
