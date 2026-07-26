import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { isOnboardingDone, setOnboardingDone } from '@/services/preferences';

interface OnboardingContextType {
  /** null while the persisted flag is still loading. */
  needsOnboarding: boolean | null;
  completeOnboarding: () => Promise<void>;
  resetOnboarding: () => Promise<void>;
}

const OnboardingContext = createContext<OnboardingContextType>({
  needsOnboarding: null,
  completeOnboarding: async () => {},
  resetOnboarding: async () => {},
});

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [needsOnboarding, setNeedsOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    isOnboardingDone().then(done => setNeedsOnboarding(!done));
  }, []);

  const completeOnboarding = useCallback(async () => {
    await setOnboardingDone(true);
    setNeedsOnboarding(false);
  }, []);

  const resetOnboarding = useCallback(async () => {
    await setOnboardingDone(false);
    setNeedsOnboarding(true);
  }, []);

  return (
    <OnboardingContext.Provider value={{ needsOnboarding, completeOnboarding, resetOnboarding }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export const useOnboarding = () => useContext(OnboardingContext);
