import colors from '@/constants/colors';
import { useTheme } from '@/contexts/ThemeContext';

/**
 * Returns the design tokens for the active app theme.
 *
 * The palette follows the user's in-app theme choice (Light / Dark /
 * System) from Settings, stored via ThemeContext. Light remains the
 * default for new users.
 */
export function useColors() {
  const { scheme } = useTheme();
  return { ...colors[scheme], radius: colors.radius, radiusSm: colors.radiusSm };
}
