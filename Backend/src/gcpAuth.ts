import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Returns the options object for Google Cloud clients (Storage / Vision).
 *
 * Resolution order (so the app works both locally and on free hosts where you
 * cannot commit a key file):
 *   1. GCP_CREDENTIALS_JSON  -> the full service-account JSON as a string (recommended for Render/Railway/etc.)
 *   2. GOOGLE_APPLICATION_CREDENTIALS -> a path to a key file (standard Google env var)
 *   3. A local fallback key file (dev only, git-ignored)
 */
export function gcpClientOptions(): any {
  const inlineJson = process.env.GCP_CREDENTIALS_JSON;
  if (inlineJson) {
    try {
      return { credentials: JSON.parse(inlineJson) };
    } catch {
      throw new Error('GCP_CREDENTIALS_JSON is set but is not valid JSON');
    }
  }

  const keyFile =
    process.env.GOOGLE_APPLICATION_CREDENTIALS ||
    'src/skilled-circle-448817-d1-e3457c9445ad.json';

  if (fs.existsSync(keyFile)) {
    return { keyFilename: keyFile };
  }

  throw new Error(
    'No Google Cloud credentials found. Set GCP_CREDENTIALS_JSON (inline JSON) ' +
      'or GOOGLE_APPLICATION_CREDENTIALS (key file path).'
  );
}

/** Name of the Google Cloud Storage bucket, configurable via env. */
export const GCS_BUCKET = process.env.GCS_BUCKET || 'votingbuck';
