import { AppError } from '../errors/app-error';

const TIMEOUT_MS = 10_000;

export async function getJson(
  url: string,
  { signal }: { signal?: AbortSignal } = {},
): Promise<unknown> {
  const controller = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, TIMEOUT_MS);
  const forwardAbort = () => controller.abort();

  if (signal?.aborted) controller.abort();
  else signal?.addEventListener('abort', forwardAbort);

  try {
    let response: Response;
    try {
      response = await fetch(url, { signal: controller.signal });
    } catch {
      throw new AppError(timedOut ? 'timeout' : 'network');
    }

    if (response.status === 404) throw new AppError('not-found');
    if (!response.ok) throw new AppError('network', `HTTP ${response.status}`);

    try {
      return await response.json();
    } catch {
      throw new AppError(timedOut ? 'timeout' : 'invalid-data', 'Response is not valid JSON');
    }
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', forwardAbort);
  }
}
