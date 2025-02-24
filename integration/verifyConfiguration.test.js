import request from 'supertest';
const app = 'http://localhost:5000/hydrogen-service'; // Replace with your API endpoint
const path = '/getConfiguration';

describe('Configuration', () => {
  it('should GET data from the configuration endpoint', async () => {
    const response = await request(app).get(path);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
  });
});
