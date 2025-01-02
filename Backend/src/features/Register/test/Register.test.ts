import request from 'supertest';
import express from 'express';
import RegisterRoute from '../routes/RegisterRoute.ts';

const app = express();
app.use('/Register', RegisterRoute);

describe('Register Route', () => {
    it('should render the Register page', async () => {
        const res = await request(app).get('/Register');
        expect(res.statusCode).toBe(200);
        expect(res.text).toBe('Render Register page here');
    });
});
