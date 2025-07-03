import { GET } from '@/app/api/health/route';

describe('API Route: /api/health (Backend)', () => {
  it('debe retornar un estado "ok" y un timestamp', async () => {
    // En el App Router, las rutas son funciones que podemos probar directamente.
    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.status).toBe('ok');
    expect(body).toHaveProperty('timestamp');
  });
});
