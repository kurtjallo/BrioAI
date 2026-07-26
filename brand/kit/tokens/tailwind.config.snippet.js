// Cadence — Tailwind theme extension ("Ink & Paper")
module.exports = {
  theme: {
    extend: {
      colors: {
        cream: '#FAF7F0',
        ink: { DEFAULT: '#1E2438', text: '#1B2033' },
        blue: {
          50: '#F1F4FC', 100: '#E8ECF9', 200: '#C9D2F8', 300: '#A5B4F4',
          400: '#8FA0DE', 500: '#6C80D8', 600: '#4A61C4', 700: '#3D52B4',
          800: '#33459C', 900: '#232F73',
        },
        accent: {
          yellow: '#F4C744', orange: '#EE7B42', green: '#57B57F',
          purple: '#8C67CB', pink: '#E56D93', softblue: '#8CB8F3',
        },
        accentText: { pink: '#C2456B', orange: '#B85425', green: '#2E7D54' },
        mutedfg: '#6B7186',
        borderwarm: '#EAE5DA',
      },
      borderRadius: { card: '32px', control: '16px' },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
};
