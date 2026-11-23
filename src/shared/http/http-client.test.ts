import { AppError } from '../errors/app-error';
import { getJson } from './http-client';

const jsonResponse = (body: unknown, status = 200) =>
  ({ ok: status < 400, status, json: async () => body }) as Response;

const hangingFetch = (_url: unknown, init?: RequestInit) =>
  new Promise<Response>((_resolve, reject) => {
    init?.signal?.addEventListener('abort', () => reject(new Error('aborted')));
  });

describe('getJson', () => {
  const fetchMock = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    fetchMock.mockReset();
    globalThis.fetch = fetchMock;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns the parsed body', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ ok: true }));
    await expect(getJson('https://example.test')).resolves.toEqual({ ok: true });
  });

  it('maps 404 to not-found', async () => {
    fetchMock.mockResolvedValue(jsonResponse({}, 404));
    await expect(getJson('https://example.test')).rejects.toMatchObject({ kind: 'not-found' });
  });

  it('maps server errors to network', async () => {
    fetchMock.mockResolvedValue(jsonResponse({}, 503));
    await expect(getJson('https://example.test')).rejects.toMatchObject({ kind: 'network' });
  });

  it('maps a fetch failure to network', async () => {
    fetchMock.mockRejectedValue(new TypeError('Network request failed'));
    await expect(getJson('https://example.test')).rejects.toMatchObject({ kind: 'network' });
  });

  it('maps broken JSON to invalid-data', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => {
        throw new SyntaxError('bad json');
      },
    });
    await expect(getJson('https://example.test')).rejects.toMatchObject({ kind: 'invalid-data' });
  });

  it('maps a slow response to timeout after 10 seconds', async () => {
    fetchMock.mockImplementation(hangingFetch);
    const result = getJson('https://example.test');
    const assertion = expect(result).rejects.toEqual(new AppError('timeout'));
    await jest.advanceTimersByTimeAsync(10_000);
    await assertion;
  });

  it('cancels the request when the caller aborts', async () => {
    fetchMock.mockImplementation(hangingFetch);
    const controller = new AbortController();
    const result = getJson('https://example.test', { signal: controller.signal });
    const assertion = expect(result).rejects.toMatchObject({ kind: 'network' });
    controller.abort();
    await assertion;
  });
});
