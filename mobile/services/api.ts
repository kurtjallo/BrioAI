import { Analysis } from '@/types';
import { mimeTypeForUri } from '@/constants/recording';

export interface AnalyzeResponse {
  transcript: string;
  analysis: Analysis;
}

/**
 * Resolve the API origin.
 *
 * EXPO_PUBLIC_API_URL is the one to set: a full origin including the scheme,
 * so a local http:// server is reachable. The old EXPO_PUBLIC_DOMAIN path
 * hardcoded https:// (it only ever worked behind Replit's router, which
 * mapped /api onto the app's own origin) and is kept for compatibility.
 *
 * Note for device testing: localhost on a phone means the phone, not your
 * Mac. Use your LAN IP, e.g. EXPO_PUBLIC_API_URL=http://192.168.1.42:8080
 */
function getBaseUrl(): string {
  const explicit = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, '');

  const domain = process.env.EXPO_PUBLIC_DOMAIN?.trim();
  if (domain) {
    return /^https?:\/\//.test(domain) ? domain.replace(/\/+$/, '') : `https://${domain}`;
  }

  throw new Error(
    'No API URL configured. Set EXPO_PUBLIC_API_URL, e.g. http://192.168.1.42:8080 ' +
      '(your Mac\'s LAN IP, not localhost, when running on a device).'
  );
}

export async function analyzeRecording(
  audioUri: string,
  prompt: string,
  duration: number
): Promise<AnalyzeResponse> {
  const baseUrl = getBaseUrl();

  const formData = new FormData();

  // React Native FormData file attachment.
  // Derive the content type from the file the recorder actually produced,
  // not from the platform. iOS records uncompressed .wav and Android falls
  // back to .m4a, and mislabelling either sends the server a file whose
  // declared type does not match its bytes.
  const contentType = mimeTypeForUri(audioUri);
  const filename = `recording.${audioUri.split('?')[0].split('.').pop() ?? 'm4a'}`;
  formData.append('audio', {
    uri: audioUri,
    type: contentType,
    name: filename,
  } as unknown as Blob);
  formData.append('prompt', prompt);
  formData.append('duration', String(duration));

  const response = await fetch(`${baseUrl}/api/analyze`, {
    method: 'POST',
    body: formData,
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    let message = `HTTP ${response.status}`;
    try {
      const err = (await response.json()) as { error?: string; detail?: string };
      if (typeof err.detail === 'string') message = err.detail;
      else if (err.error) message = err.error;
    } catch {
      // ignore parse error
    }
    throw new Error(message);
  }

  return response.json() as Promise<AnalyzeResponse>;
}
