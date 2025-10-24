interface Env {
  DISCORD_WEBHOOK_URL: string;
  FIREBASE_CREDENTIALS: string;
}

function validateEnv(): Env {
  const requiredEnvVars = [
    "DISCORD_WEBHOOK_URL",
    "FIREBASE_CREDENTIALS",
  ] as const;

  const env: Record<string, string | undefined> = { ...process.env };

  for (const key of requiredEnvVars) {
    if (!env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }

  const webhookUrl = env.DISCORD_WEBHOOK_URL;
  const credentials = env.FIREBASE_CREDENTIALS;

  if (!webhookUrl || !credentials) {
    throw new Error("Required environment variables are not set");
  }

  // Validate Firebase credentials can be parsed as JSON
  try {
    JSON.parse(credentials);
  } catch (error) {
    throw new Error("FIREBASE_CREDENTIALS must be valid JSON");
  }

  // Validate Discord webhook URL format
  try {
    new URL(webhookUrl);
  } catch (error) {
    throw new Error("DISCORD_WEBHOOK_URL must be a valid URL");
  }

  return {
    DISCORD_WEBHOOK_URL: webhookUrl,
    FIREBASE_CREDENTIALS: credentials,
  };
}

// Run validation and export validated environment variables
export const env = validateEnv();

// Re-export the Env type
export type { Env };
