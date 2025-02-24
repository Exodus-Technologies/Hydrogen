import request from 'supertest';
const app = 'http://localhost:5000'; // Replace with your API endpoint

describe('API Tests', () => {
  it('should GET data from the API', async () => {
    const response = await request(app).get('/your-endpoint');
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
  });
});
