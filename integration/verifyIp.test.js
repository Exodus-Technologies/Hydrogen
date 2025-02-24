import request from 'supertest';
const baseUrl = process.env.TEST_ENDPOINT;
const path = '/getIp';

describe('Ip', () => {
  it('should GET data from the Ip endpoint', async () => {
    const response = await request(baseUrl).get(path);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
  });
});
