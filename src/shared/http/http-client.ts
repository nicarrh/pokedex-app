import { AppError } from '../errors/app-error';

export async function getJson(
  url: string,
  { signal }: { signal?: AbortSignal } = {},
): Promise<unknown> {
  let response: Response;
  try {
    response = await fetch(url, { signal });
  } catch {
    throw new AppError('network');
  }

  if (response.status === 404) throw new AppError('not-found');
  if (!response.ok) throw new AppError('network', `HTTP ${response.status}`);

  try {
    return await response.json();
  } catch {
    throw new AppError('invalid-data', 'Response is not valid JSON');
  }
}
