import { IOSOutputFormat, AudioQuality, type RecordingOptions } from 'expo-audio';

/**
 * Recording configuration for Cadence.
 *
 * Why not RecordingPresets.HIGH_QUALITY: it records 44.1kHz stereo AAC.
 * Three things are wrong with that for this product.
 *
 * 1. AAC is PERCEPTUAL compression — it discards what a listener would not
 *    consciously notice. Measured on real audio, a round trip leaves loud
 *    speech 0.2% off but quiet passages 14.6% off, and it stops improving
 *    above 128kbps because the encoder is deliberately throwing that detail
 *    away. The quiet passages are breath, and the fading tail of a sentence
 *    — exactly the signal behind PRD F7's ending: "fade" and the intensity
 *    contour under it. Compression is most destructive precisely where we
 *    are trying to measure.
 * 2. Stereo is pointless from one phone mic and doubles the size.
 * 3. Deepgram, praat-parselmouth and every forced aligner want 16kHz mono.
 *    Recording it directly means nothing has to convert, so no two code
 *    paths can disagree about the timeline.
 *
 * PRD section 9.1 already specifies "consistent WAV PCM across platforms".
 * This is the code finally matching the spec.
 *
 * PLATFORM REALITY: only iOS can do it. Android's MediaRecorder exposes no
 * uncompressed container — expo-audio's AndroidOutputFormat is
 * 'default' | '3gp' | 'mpeg4' | 'amrnb' | 'amrwb' | 'aac_adts' | 'mpeg2ts' |
 * 'webm' and every AndroidAudioEncoder is lossy. So Android gets the best
 * available (16kHz mono AAC at a high bitrate) and its acoustic metrics will
 * be measurably worse than iOS's. Getting true PCM on Android needs
 * AudioRecord via a native module, which is not worth it before the metrics
 * are validated on iOS.
 */
export const CADENCE_RECORDING: RecordingOptions = {
  extension: '.wav',
  sampleRate: 16000,
  numberOfChannels: 1,
  bitRate: 256000, // ignored for PCM on iOS; used by Android's AAC encoder

  ios: {
    outputFormat: IOSOutputFormat.LINEARPCM, // uncompressed
    audioQuality: AudioQuality.MAX,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },

  // Best available, not what we want. See PLATFORM REALITY above.
  android: {
    extension: '.m4a',
    outputFormat: 'mpeg4',
    audioEncoder: 'aac',
  },

  web: {
    mimeType: 'audio/webm',
    bitsPerSecond: 256000,
  },
};

/**
 * Content type for the upload, derived from the file the recorder actually
 * produced rather than assumed from the platform.
 *
 * PRD F3 warns that platforms silently ignore unsupported constraints, so
 * the extension we asked for is not proof of what we got. Reading it back
 * off the real URI is the only honest source.
 */
export function mimeTypeForUri(uri: string): string {
  const ext = uri.split('?')[0].split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'wav':
      return 'audio/wav';
    case 'm4a':
    case 'mp4':
      return 'audio/m4a';
    case 'webm':
      return 'audio/webm';
    case 'ogg':
      return 'audio/ogg';
    case '3gp':
      return 'audio/mpeg';
    default:
      return 'audio/m4a';
  }
}
