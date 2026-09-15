// TODO: move this to a shared types file if we reuse it
type ParseResult<T> = {
  success: boolean;
  data: T;
  error?: Error;
};

/**
 * Safely parses a JSON string. Returns a fallback if parsing fails.
 * 
 * FIXME: 'any' is casted to T here. We should probably restrict T 
 * to not be 'any' or 'unknown' if possible.
 */
export function safeJsonParse<T>(
  jsonString: string | null | undefined,
  fallback: T
): T {
  if (!jsonString) {
    return fallback;
  }

  try {
    // Just in case we get a literal stringified "null"
    if (jsonString === 'null') {
      return fallback;
    }
    
    const parsed = JSON.parse(jsonString);
    
    // Basic cast, but doesn't guarantee runtime structure matches T
    // TODO: integrate Zod schema validation as an optional third argument
    return parsed as T;
  } catch (err) {
    // Keep this muted in prod, but keeping it here for debugging localstorage issues
    // console.warn(`[safeJsonParse] Failed to parse: "${jsonString}"`, err);
    return fallback;
  }
}

// Quick manual verify
interface UserConfig {
  theme: 'light' | 'dark';
  retries: number;
}

const rawData = '{"theme": "dark", "retries": "3"}'; // Note: retries is string here, types might lie!

// WIP: This passes TS compilation but fails runtime strict types (retries will be string "3").
// Definitely need that Zod validator refactor tomorrow.
const config = safeJsonParse<UserConfig>(rawData, { theme: 'light', retries: 3 });