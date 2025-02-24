import request from 'supertest';
const baseUrl = process.env.TEST_ENDPOINT;
const path = '/getConfiguration';

describe('Configuration', () => {
  it('should GET data from the configuration endpoint', async () => {
    const response = await request(baseUrl).get(path);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
  });
});
