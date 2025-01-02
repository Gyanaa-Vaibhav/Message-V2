import request from 'supertest';
import express from 'express';
import LoginRoute from '../routes/LoginRoute';

const app = express();
app.use('/Login', LoginRoute);

describe('Login Route', () => {
    it('should render the Login page', async () => {
        const res = await request(app).get('/Login');
        expect(res.statusCode).toBe(200);
        expect(res.text).toBe('Render Login page here');
    });
});
