/**
 * Cadence design system — "Ink & Paper" evolved.
 *
 * An off-white + blue editorial language with playful pops of colour:
 * - Warm cream canvas (#FAF7F0) with pure-white floating cards.
 * - Deep navy (#1E2438) and rich blue (#3D52B4) anchors.
 * - Playful accents: yellow, orange, green, purple, pink, soft blue.
 * - Generous radii (32 for main cards), soft diffuse blue-tinted shadows.
 * - Type: Fraunces (serif display) for hero/expressive headings, Inter for body/UI.
 */

const colors = {
  light: {
    text: '#1B2033',
    tint: '#3D52B4',
    background: '#FAF7F0', // warm cream canvas
    foreground: '#1B2033', // ink navy text
    card: '#FFFFFF',
    cardForeground: '#1B2033',
    primary: '#1E2438', // ink-navy pill CTAs
    primaryForeground: '#FAF8F2',
    secondary: '#F1EEE6', // warm neutral fill (chips on white)
    secondaryForeground: '#1B2033',
    muted: '#ECE8DF',
    mutedForeground: '#6B7186',
    accent: '#3D52B4', // anchor blue
    accentForeground: '#FFFFFF',
    accentSoft: '#E8ECF9', // light blue tint for soft fills
    accentMid: '#8FA0DE', // mid blue for secondary chart marks / borders on blue
    gradientStart: '#4A61C4', // hero surface gradient (deep blue family)
    gradientEnd: '#33459C',
    cream: '#F6E7B9', // complementary cream-yellow
    creamForeground: '#6B5518',
    coral: '#E0785F', // muted coral
    destructive: '#C43D3D',
    destructiveForeground: '#FFFFFF',
    border: '#EAE5DA',
    input: '#E4DFD2',
    ring: '#3D52B4',
    // Playful Accents
    yellow: '#F4C744',
    orange: '#EE7B42',
    green: '#57B57F',
    purple: '#8C67CB',
    pink: '#E56D93',
    softBlue: '#8CB8F3',
    // Text-safe variants (same as base in light; brightened in dark)
    pinkText: '#C2456B',
    orangeText: '#B85425',
    greenText: '#2E7D54', // 5.0:1 on white cards, 4.5:1 on the green-tinted chip
  },
  dark: {
    // "Ink & Paper — after dark": a deep blue-black canvas with elevated
    // slate-navy cards, bright periwinkle accents, and jewel-toned pops.
    // All text/surface pairs pass WCAG AA (body 4.5:1, large/graphics 3:1).
    text: '#F1F2F8',
    tint: '#A5B4F4',
    background: '#0D101A', // blue-black canvas (deeper than cards)
    foreground: '#F1F2F8',
    card: '#171B28', // elevated slate-navy floating cards
    cardForeground: '#F1F2F8',
    primary: '#F1F2F8', // light pill CTAs pop against the dark canvas
    primaryForeground: '#131625',
    secondary: '#232939', // chips on cards
    secondaryForeground: '#F1F2F8',
    muted: '#1F2434',
    mutedForeground: '#A8AEC4', // ~8:1 on card
    accent: '#A5B4F4', // bright periwinkle — text/tint anchor
    accentForeground: '#10142B',
    accentSoft: '#C9D2F8', // light tint — readable on hero gradient
    accentMid: '#6C80D8',
    gradientStart: '#3A4EB5', // hero surface gradient (rich night blue)
    gradientEnd: '#232F73',
    cream: '#423817',
    creamForeground: '#F2E3B3',
    coral: '#EF8A70', // brightened for text on dark cards
    destructive: '#F26D6D',
    destructiveForeground: '#1A0D0D',
    border: '#262C3E',
    input: '#262C3E',
    ring: '#A5B4F4',
    // Playful Accents — deep jewel tones so light foreground/icons stay AA
    yellow: '#7D6118', // deep amber (streak badge behind light text)
    orange: '#AC4E24',
    green: '#3D9269', // white icons 3.8:1 (graphics AA), text on card 4.5:1
    purple: '#6E51A6',
    pink: '#B24A6E',
    softBlue: '#3A5E96',
    // Text-safe variants — the jewel tones above are backgrounds for light
    // text; these brightened versions pass AA (>=4.5:1) as text on cards.
    pinkText: '#E87DA2',
    orangeText: '#EE9059',
    greenText: '#7BD3A4', // 9.6:1 on cards, 8.2:1 on the green-tinted chip
  },
  radius: 32, // larger soft radii
  radiusSm: 16,
};

/**
 * Typography scale
 */
export const type = {
  display: 'Fraunces_600SemiBold',
  displayBold: 'Fraunces_700Bold',
  body: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
} as const;

export const cardShadow = {
  shadowColor: '#27335E',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.06,
  shadowRadius: 20,
  elevation: 3,
} as const;

export const floatShadow = {
  shadowColor: '#27335E',
  shadowOffset: { width: 0, height: 12 },
  shadowOpacity: 0.15,
  shadowRadius: 24,
  elevation: 6,
} as const;

export default colors;
