import request from 'supertest';
const baseUrl = process.env.TEST_ENDPOINT;
const path = '/probeCheck';

describe('Health', () => {
  it('should GET data from the probeCheck endpoint', async () => {
    const response = await request(baseUrl).get(path);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
  });
});
