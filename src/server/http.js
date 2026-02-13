export async function parseJson(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

export function getErrorMessage(error, fallback) {
  return error instanceof Error ? error.message : fallback;
}

export function toBoolean(value, fallback = false) {
  if (typeof value === 'boolean') return value;
  return fallback;
}
