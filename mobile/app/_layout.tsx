import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { Fraunces_600SemiBold, Fraunces_700Bold } from '@expo-google-fonts/fraunces';
import { Redirect, Stack, usePathname } from 'expo-router';
import { OnboardingProvider, useOnboarding } from '@/contexts/OnboardingContext';
import * as SplashScreen from 'expo-splash-screen';
import { SessionProvider } from '@/contexts/SessionContext';
import { WordProvider } from '@/contexts/WordContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  const { needsOnboarding } = useOnboarding();
  const pathname = usePathname();

  if (needsOnboarding === null) return null;

  // While onboarding is incomplete, only force users into the flow when they
  // are outside it. The recording and results screens are part of the
  // onboarding journey (steps 3–5), so they must remain reachable.
  const inOnboardingFlow =
    pathname.startsWith('/onboarding') ||
    pathname.startsWith('/recording') ||
    pathname.startsWith('/results');

  return (
    <>
      {needsOnboarding && !inOnboardingFlow && <Redirect href="/onboarding" />}
    <Stack screenOptions={{ headerBackTitle: 'Back' }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="settings" options={{ headerShown: false, presentation: 'modal' }} />
      <Stack.Screen
        name="recording"
        options={{ headerShown: false, presentation: 'fullScreenModal' }}
      />
      <Stack.Screen
        name="results/[id]"
        options={{ headerShown: false, animation: 'slide_from_bottom' }}
      />
    </Stack>
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Fraunces_600SemiBold,
    Fraunces_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <KeyboardProvider>
              <ThemeProvider>
                <OnboardingProvider>
                  <SessionProvider>
                    <WordProvider>
                      <RootLayoutNav />
                    </WordProvider>
                  </SessionProvider>
                </OnboardingProvider>
              </ThemeProvider>
            </KeyboardProvider>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
